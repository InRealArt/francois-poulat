import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, type Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type OrderCancelPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: OrderCancelPageProps
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "orderCancelled",
  });

  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function OrderCancelPage({
  params,
}: OrderCancelPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("orderCancelled");

  return (
    <>
      <Header />
      <main className="bg-background pt-28 pb-24 md:pt-40">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            {t("kicker")}
          </p>
          <h1 className="serif mt-4 text-3xl italic md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-[15px] leading-loose text-black/70 md:text-[17px]">
            {t("body")}
          </p>
          <Link href="/#formats" className="btn-action mt-10 inline-block">
            {t("backToFormats")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
