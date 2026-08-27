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
      <div className="mx-auto max-w-[1180px] px-3 sm:px-6 lg:px-10">
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

        <div className="mt-14 grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Reveal direction="left" className="flex flex-col gap-4">
            <div className="artwork-image relative aspect-video w-full overflow-hidden rounded-sm bg-black">
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

            <p className="text-sm leading-loose text-[var(--light-text-muted)] md:text-base">
              {t("body")}
            </p>

            <a href="#formats" className="btn-action mt-2 self-start text-center">
              {t("ctaSecondary")}
            </a>
          </Reveal>

          <Reveal direction="right" delay={0.15} className="flex flex-col gap-3.5">
            <span className="section-number mb-0">{t("photosLabel")}</span>

            <div className="artwork-image relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <Image
                src={unboxingPhotos[0].image}
                alt={t(`photos.${unboxingPhotos[0].id}.alt`)}
                fill
                sizes="(min-width: 1024px) 35vw, 100vw"
                className="object-cover"
              />
              <span className="absolute left-2.5 bottom-2.5 tag-badge bg-black/60 text-[0.55rem] uppercase tracking-[0.15em] text-white backdrop-blur">
                {t(`photos.${unboxingPhotos[0].id}.badge`)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {unboxingPhotos.slice(1).map((photo) => (
                <div
                  key={photo.id}
                  className="artwork-image relative aspect-[3/4] w-full overflow-hidden rounded-sm"
                >
                  <Image
                    src={photo.image}
                    alt={t(`photos.${photo.id}.alt`)}
                    fill
                    sizes="(min-width: 1024px) 18vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute left-2 bottom-2 tag-badge bg-black/60 text-[0.5rem] uppercase tracking-[0.1em] text-white backdrop-blur">
                    {t(`photos.${photo.id}.badge`)}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
