import "server-only";
import type Stripe from "stripe";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { getStripe } from "@/lib/stripe";
import { sendEmail, sendTeamEmail, TEAM_EMAIL } from "@/lib/orderEmail";
import { routing } from "@/i18n/routing";

export type CheckoutOutcome =
  | {
      status: "paid";
      amount: number;
      currency: string;
      size: string;
      email: string | null;
      customerNotified: boolean;
      invoiceUrl: string | null;
    }
  | { status: "pending" }
  | { status: "invalid" };

function formatMinor(amountMinor: number, currency: string) {
  return `${(amountMinor / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

function formatMoney(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

// Shipping address collected by Stripe Checkout, one line per element.
function formatShippingAddress(session: Stripe.Checkout.Session, locale: string) {
  const details = session.collected_information?.shipping_details;
  if (!details) {
    return "";
  }
  const { line1, line2, postal_code, city, state, country } = details.address;
  const countryName = country
    ? (new Intl.DisplayNames([locale], { type: "region" }).of(country) ?? country)
    : "";
  return [
    details.name,
    line1,
    line2,
    [postal_code, city].filter(Boolean).join(" "),
    state,
    countryName,
  ]
    .filter(Boolean)
    .join("\n");
}

// Re-reads the session from Stripe (never trusts the redirect), then sends the
// team email and the customer confirmation once each. No DB: markers live in
// the PaymentIntent's metadata (fulfilled_at = team, customer_notified_at =
// customer). Emails are sent before marking, so a crash in between can produce
// a duplicate email but never a lost one.
export async function fulfillCheckoutSession(
  sessionId: string
): Promise<CheckoutOutcome> {
  const stripe = getStripe();

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "invoice"],
    });
  } catch (error) {
    console.error("[fulfill] retrieve failed", sessionId, error);
    return { status: "invalid" };
  }

  if (session.payment_status !== "paid") {
    return session.status === "open" || session.status === "complete"
      ? { status: "pending" }
      : { status: "invalid" };
  }

  const meta = session.metadata ?? {};
  const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
  const invoice = session.invoice as Stripe.Invoice | null;
  const invoiceUrl = invoice?.hosted_invoice_url ?? null;
  const amount = session.amount_total ?? 0;
  const currency = session.currency ?? "eur";
  const name = meta.name ?? session.customer_details?.name ?? "";
  const email = session.customer_details?.email ?? meta.email ?? "";
  const locale = hasLocale(routing.locales, meta.locale)
    ? meta.locale
    : routing.defaultLocale;

  const outcome = {
    status: "paid" as const,
    amount,
    currency,
    size: meta.size ?? "",
    email: email || null,
    customerNotified: Boolean(paymentIntent?.metadata.customer_notified_at),
    invoiceUrl,
  };

  if (!paymentIntent) {
    return outcome;
  }

  const markers: Record<string, string> = {};

  if (!paymentIntent.metadata.fulfilled_at) {
    try {
      await sendTeamEmail({
        senderName: "PIKAPOULAT Reservations",
        subject: `Deposit paid — ${meta.size ?? ""} — ${name}`,
        title: "New Grim Edition Order — Deposit Paid",
        intro:
          "A client paid the deposit for a print from the Formats section. Payment confirmed by Stripe — reply directly to the client's email to schedule production and the balance.",
        footer: "Sent automatically after a successful Stripe Checkout payment.",
        rows: [
          { label: "Client name", value: name },
          { label: "Client email", value: email },
          {
            label: "Shipping address",
            value: formatShippingAddress(session, "en"),
          },
          { label: "Format", value: meta.formatId ?? "" },
          { label: "Size", value: meta.size ?? "" },
          { label: "Deposit paid", value: formatMinor(amount, currency) },
          {
            label: "Balance due",
            value: `${meta.balance ?? "?"} ${currency.toUpperCase()}`,
          },
          {
            label: "Deposit (EUR ref.)",
            value: `${meta.depositEur ?? "?"} EUR`,
          },
          { label: "Total (EUR ref.)", value: `${meta.totalEur ?? "?"} EUR` },
          { label: "Language", value: locale },
          {
            label: "CGV accepted",
            value: `${meta.termsVersion ?? "?"} at ${new Date(session.created * 1000).toISOString()}`,
          },
          { label: "Invoice", value: invoice?.number ?? "—" },
          { label: "Stripe payment", value: paymentIntent.id },
        ],
        replyTo: email ? { email, name } : { email: TEAM_EMAIL },
      });
      markers.fulfilled_at = new Date().toISOString();
    } catch (error) {
      // Not marked: the next visit of the success page retries the email.
      console.error("[fulfill] team email failed", session.id, error);
    }
  }

  if (!paymentIntent.metadata.customer_notified_at && email) {
    try {
      await sendCustomerEmail({
        session,
        locale,
        name,
        email,
        invoice,
      });
      markers.customer_notified_at = new Date().toISOString();
      outcome.customerNotified = true;
    } catch (error) {
      console.error("[fulfill] customer email failed", session.id, error);
    }
  }

  if (Object.keys(markers).length > 0) {
    try {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: markers,
      });
    } catch (error) {
      console.error("[fulfill] marking failed", paymentIntent.id, error);
    }
  }

  return outcome;
}

// Confirmation on a durable medium (Code de la consommation L221-13): order
// summary, CGV reference, withdrawal right with the model form, guarantees.
async function sendCustomerEmail({
  session,
  locale,
  name,
  email,
  invoice,
}: {
  session: Stripe.Checkout.Session;
  locale: (typeof routing.locales)[number];
  name: string;
  email: string;
  invoice: Stripe.Invoice | null;
}) {
  const meta = session.metadata ?? {};
  const currency = session.currency ?? "eur";
  const t = await getTranslations({ locale, namespace: "orderEmail" });
  const tCgv = await getTranslations({ locale, namespace: "cgv" });

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const termsUrl = `${siteUrl}${prefix}/terms-and-conditions`;

  const orderDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "Europe/Paris",
  }).format(new Date(session.created * 1000));

  const balance = Number(meta.balance);
  const links = [
    ...(invoice?.hosted_invoice_url
      ? [{ label: t("invoiceLink"), url: invoice.hosted_invoice_url }]
      : []),
    ...(invoice?.invoice_pdf
      ? [{ label: t("invoicePdfLink"), url: invoice.invoice_pdf }]
      : []),
    { label: t("termsLink"), url: termsUrl },
  ];

  await sendEmail({
    to: { email, name },
    senderName: "InRealArt",
    subject: t("subject", { size: meta.size ?? "" }),
    title: t("title"),
    intro: t("intro", { name }),
    footer: t("footer", { email: TEAM_EMAIL }),
    rows: [
      { label: t("orderDate"), value: orderDate },
      { label: t("artwork"), value: t("artworkValue", { size: meta.size ?? "" }) },
      { label: t("depositPaid"), value: formatMoney((session.amount_total ?? 0) / 100, currency, locale) },
      {
        label: t("balanceDue"),
        value: Number.isFinite(balance)
          ? formatMoney(balance, currency, locale)
          : "—",
      },
      {
        label: t("shippingAddress"),
        value: formatShippingAddress(session, locale),
      },
      ...(invoice?.number
        ? [{ label: t("invoiceNumber"), value: invoice.number }]
        : []),
      { label: t("terms"), value: tCgv("reference") },
    ],
    links,
    sections: [
      { heading: tCgv("withdrawal.heading"), body: tCgv("withdrawal.body") },
      { heading: tCgv("warranties.heading"), body: tCgv("warranties.body") },
    ],
    replyTo: { email: TEAM_EMAIL, name: "InRealArt" },
  });
}
