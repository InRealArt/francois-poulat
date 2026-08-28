import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import { unboxingPhotos } from "@/lib/content";

export default async function Genese() {
  const t = await getTranslations("genese");

  return (
    <section
      id="genese"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            {t("titleMain")}{" "}
            <span className="text-gold">{t("titleAccent")}</span>
          </h2>
          <p className="mt-4 text-sm leading-loose text-[var(--light-text-muted)] md:text-base">
            {t("intro")}
          </p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-8 lg:grid-cols-[1.25fr_1fr] lg:items-stretch">
          <Reveal direction="left" className="flex">
            <div className="artwork-image relative aspect-video w-full self-stretch overflow-hidden rounded-sm bg-black lg:aspect-auto">
              <video
                src="https://pub-d7df68395d644bd3bc80d24168d6d8be.r2.dev/Grim-Valorant-Landing/unboxing.mp4"
                poster="/images/unboxing/unboxing1.webp"
                controls
                playsInline
                aria-label={t("videoAria")}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/75 to-transparent px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm border border-white/40 px-2 py-[3px] text-[0.55rem] uppercase tracking-[0.15em] text-white/85">
                    {t("replayBadge")}
                  </span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/70">
                    {t("replaySource")}
                  </span>
                </div>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-white/65">
                  {t("videoFormat")}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal
            direction="right"
            delay={0.15}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-4">
              <span className="section-number mb-0 shrink-0">
                {t("photosLabel")}
              </span>
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-[var(--gold-accent)] to-transparent"
              />
            </div>

            <p className="mt-4 text-sm leading-loose text-[var(--light-text-muted)] md:text-base">
              {t("body")}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {unboxingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="artwork-image relative aspect-square w-full overflow-hidden rounded-sm"
                >
                  <Image
                    src={photo.image}
                    alt={t(`photos.${photo.id}.alt`)}
                    width={280}
                    height={280}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="tag-badge absolute inset-x-1 bottom-1 truncate border-0 bg-black/60 !px-1.5 !py-0.5 text-center text-[0.4rem] uppercase leading-none tracking-[0.08em] text-white backdrop-blur">
                    {t(`photos.${photo.id}.badge`)}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#formats"
              className="btn-action btn-pulse mt-7 self-start text-center"
            >
              {t("ctaSecondary")}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
