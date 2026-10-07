import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getTranslations } from "next-intl/server";
import {
  convertFromEur,
  formats,
  formatSizes,
  SHIPPING_COUNTRIES,
  TERMS_VERSION,
} from "@/lib/content";
import { getEurToUsd } from "@/lib/fxRate";
import { getStripe } from "@/lib/stripe";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { routing } from "@/i18n/routing";

// Stripe metadata values are capped at 500 characters.
const checkoutRequestSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.email().max(200),
  formatId: z.string().trim().min(1).max(50),
  sizeId: z.string().trim().min(1).max(50),
  currency: z.enum(["EUR", "USD"]),
  locale: z.enum(routing.locales),
  attemptId: z.uuid(),
  // Consumer law: explicit, non-prechecked acceptance of the CGV.
  acceptTerms: z.literal(true),
  captchaToken: z.string().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const {
    name,
    email,
    formatId,
    sizeId,
    currency,
    locale,
    attemptId,
    captchaToken,
  } = parsed.data;

  // Prices come from the server-side catalog, never from the client.
  const format = formats.find((item) => item.id === formatId);
  const size = formatSizes.find((item) => item.id === sizeId);
  if (!format || format.contactOnly || !size) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for");

  let captchaValid: boolean;
  try {
    captchaValid = await verifyTurnstileToken(captchaToken, remoteIp);
  } catch {
    return NextResponse.json(
      { error: "captcha_verification_failed" },
      { status: 502 }
    );
  }

  if (!captchaValid) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error("[checkout] Missing NEXT_PUBLIC_SITE_URL");
    return NextResponse.json(
      { error: "checkout_unavailable" },
      { status: 500 }
    );
  }

  const rate = currency === "USD" ? await getEurToUsd() : 1;
  const depositAmount = convertFromEur(size.priceDeposit, currency, rate);
  const balanceAmount =
    convertFromEur(size.priceTotal, currency, rate) - depositAmount;
  const amountMinor = depositAmount * 100;

  const t = await getTranslations({ locale, namespace: "checkout" });
  const tFormats = await getTranslations({ locale, namespace: "formats" });

  // Base URL from env, not the Host header. "as-needed" prefix: none for default.
  const base = siteUrl.replace(/\/$/, "");
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  const metadata = {
    formatId,
    sizeId,
    size: size.size,
    name,
    email,
    locale,
    depositEur: String(size.priceDeposit),
    totalEur: String(size.priceTotal),
    eurToUsd: String(rate),
    balance: String(balanceAmount),
    termsVersion: TERMS_VERSION,
    // Acceptance time = session.created (kept out of params: idempotency).
    termsAccepted: "true",
  };

  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: amountMinor,
              product_data: {
                name: t("productName", {
                  format: tFormats(`items.${format.id}.name`),
                  size: size.size,
                }),
                description: t("productDescription"),
              },
            },
          },
        ],
        // Payment methods stay managed in the Dashboard; EPS is unwanted in
        // both test and live modes (Dashboard settings are per mode).
        excluded_payment_method_types: ["eps"],
        customer_email: email,
        // Stripe collects a structured, country-validated shipping address.
        shipping_address_collection: {
          allowed_countries: [...SHIPPING_COUNTRIES],
        },
        locale,
        metadata,
        payment_intent_data: {
          metadata,
          description: `Deposit — ${format.id} ${size.size} — ${name}`,
        },
        // Deposit invoice (facture d'acompte), finalized by Stripe once paid.
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: t("invoiceDescription", {
              balance: new Intl.NumberFormat(locale, {
                style: "currency",
                currency,
              }).format(balanceAmount),
            }),
            footer: t("invoiceFooter"),
            metadata: { formatId, sizeId, size: size.size },
          },
        },
        success_url: `${base}${prefix}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}${prefix}/order/cancel`,
      },
      // Same attempt + same cart → same session (double click, retry).
      // Amount is part of the key so a refreshed FX rate never collides.
      {
        idempotencyKey: `checkout:${attemptId}:${sizeId}:${currency}:${amountMinor}`,
      }
    );

    if (!session.url) {
      throw new Error("checkout_session_without_url");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error("[checkout]", error.type, error.code, error.requestId);
    } else {
      console.error("[checkout]", error);
    }
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }
}
