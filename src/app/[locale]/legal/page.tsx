import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, type Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LegalPageProps
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "legal",
  });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations("legal");

  const sections = [
    "editor",
    "host",
    "intellectualProperty",
    "liability",
    "data",
  ] as const;

  return (
    <>
      <Header />
      <main className="bg-background pt-28 pb-24 md:pt-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            {t("kicker")}
          </p>
          <h1 className="serif mt-4 text-3xl uppercase tracking-[0.2em] md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-sm text-gray-500">{t("reference")}</p>

          <div className="mt-16 flex flex-col gap-14">
            {sections.map((id) => (
              <section key={id}>
                <h2 className="serif text-xl uppercase tracking-[0.2em] text-gold">
                  {t(`${id}.heading`)}
                </h2>
                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                  {t(`${id}.body`)}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
