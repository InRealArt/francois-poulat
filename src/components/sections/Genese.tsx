import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function Genese() {
  const t = await getTranslations("genese");

  return (
    <section
      id="genese"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-sm leading-loose text-[var(--light-text-muted)] md:text-base">
            {t("intro")}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal
            direction="left"
            className="artwork-image relative aspect-[4/3] w-full overflow-hidden rounded-sm"
          >
            <Image
              src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1400&auto=format&fit=crop"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              {t("tagReview")}
            </span>
            <span className="absolute right-4 top-4 tag-badge bg-black/60 text-[0.65rem] uppercase tracking-[0.15em] backdrop-blur">
              {t("tagFormat")}
            </span>

            <button
              type="button"
              className="group absolute inset-0 flex items-center justify-center bg-black/20 transition-colors hover:bg-black/40"
              aria-label={t("videoAria")}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/80 text-white transition-transform group-hover:scale-110">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="ml-1 h-6 w-6"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>

            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                {t("replayLabel")}
              </p>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.15}>
            <p className="serif text-xl italic text-[var(--light-text)]">
              {t("quote")}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[var(--light-text-muted)]">
              {t("quoteSub")}
            </p>
            <p className="mt-6 text-sm leading-loose text-[var(--light-text-muted)] md:text-base">
              {t("body")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#genese" className="btn-action text-center">
                {t("ctaPrimary")}
              </a>
              <a
                href="#formats"
                className="border-b-[1.5px] border-[var(--light-text)] self-center text-[0.7rem] font-semibold uppercase tracking-[0.15em] transition-colors hover:text-gold hover:border-gold"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
