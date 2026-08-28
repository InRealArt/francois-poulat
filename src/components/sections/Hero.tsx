import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function Hero() {
  const t = await getTranslations("hero");
  const features = t.raw("features") as string[];
  const badges = t.raw("badges") as string[];

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-white/10 bg-background pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:px-10 lg:gap-20">
        <Reveal direction="up">
          <span className="section-number">{t("eyebrow")}</span>
          <h1 className="serif text-4xl italic leading-[1.1] sm:text-5xl md:text-6xl">
            {t("titleLine1")}
            <br />
            <span className="text-gold">{t("titleLine2")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-loose text-gray-300 md:text-base">
            {t("description")}
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-gray-200 sm:text-sm"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#formats" className="btn-action text-center">
              {t("ctaPrimary")}
            </a>
            <a href="#genese" className="btn-cta text-center">
              {t("ctaSecondary")}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] uppercase tracking-[0.2em] text-gray-500">
            {badges.map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                {badge}
                <Image
                  src="/images/hero/french_flag.svg"
                  alt="Made in France"
                  width={32}
                  height={24}
                  className="inline-block h-6 w-auto rounded-[2px]"
                />
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15} className="relative">
          <div className="artwork-image relative aspect-square w-full overflow-hidden rounded-sm border-white/10 bg-card">
            <Image
              src="/images/hero/hero.webp"
              alt={t("imageAlt")}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />

            <span className="absolute left-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              {t("tagSetup")}
            </span>
            <span className="absolute right-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              {t("tagDetail")}
            </span>

            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 rounded-sm bg-black/70 p-4 backdrop-blur">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-gold">
                {t("formatOfficial")}
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-gray-300">
                {t("technique")}
              </p>
            </div>
          </div>

          <div className="advantage-box mt-6 flex flex-col gap-3 rounded-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="serif italic text-lg text-white">
              {t("unboxingTitle")}
              <span className="serif block text-sm not-italic text-gray-400">
                {t("unboxingSubtitle")}
              </span>
            </p>
            <a href="#formats" className="btn-mag shrink-0">
              {t("unboxingCta")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
