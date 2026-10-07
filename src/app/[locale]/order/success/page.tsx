import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, type Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fulfillCheckoutSession } from "@/lib/payments/fulfill";

type OrderSuccessPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: OrderSuccessPageProps
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "orderConfirmation",
  });

  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: OrderSuccessPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("orderConfirmation");
  const { session_id: sessionId } = await searchParams;

  // Server-side re-read from Stripe; the redirect alone proves nothing.
  const outcome =
    typeof sessionId === "string" && sessionId.startsWith("cs_")
      ? await fulfillCheckoutSession(sessionId)
      : ({ status: "invalid" } as const);

  return (
    <>
      <Header />
      <main className="bg-background pt-28 pb-24 md:pt-40">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            {t("kicker")}
          </p>

          {outcome.status === "paid" && (
            <>
              <h1 className="serif mt-4 text-3xl italic md:text-4xl">
                {t("paidTitle")}
              </h1>
              <p className="mt-6 text-[15px] leading-loose text-black/70 md:text-[17px]">
                {t("paidBody", {
                  amount: new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: outcome.currency.toUpperCase(),
                  }).format(outcome.amount / 100),
                  size: outcome.size,
                })}
              </p>
              {outcome.customerNotified && outcome.email && (
                <p className="mt-4 text-sm text-black/70">
                  {t("confirmationEmailNote", { email: outcome.email })}
                </p>
              )}
              {outcome.invoiceUrl && (
                <p className="mt-4">
                  <a
                    href={outcome.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold underline underline-offset-4"
                  >
                    {t("invoiceLink")}
                  </a>
                </p>
              )}
            </>
          )}

          {outcome.status === "pending" && (
            <>
              <h1 className="serif mt-4 text-3xl italic md:text-4xl">
                {t("pendingTitle")}
              </h1>
              <p className="mt-6 text-[15px] leading-loose text-black/70 md:text-[17px]">
                {t("pendingBody")}
              </p>
            </>
          )}

          {outcome.status === "invalid" && (
            <>
              <h1 className="serif mt-4 text-3xl italic md:text-4xl">
                {t("invalidTitle")}
              </h1>
              <p className="mt-6 text-[15px] leading-loose text-black/70 md:text-[17px]">
                {t("invalidBody")}
              </p>
            </>
          )}

          <Link href="/" className="btn-action mt-10 inline-block">
            {t("backHome")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
