import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

const photos = [
  {
    src: "/images/grim_story/grim_playing_1.webp",
    tilt: "lg:rotate-[-4deg] lg:translate-y-6 lg:hover:rotate-0 lg:hover:translate-y-0",
  },
  {
    src: "/images/grim_story/grim_playing_2.webp",
    tilt: "lg:rotate-[2deg] lg:-translate-y-5 lg:hover:rotate-0 lg:hover:translate-y-0",
  },
  {
    src: "/images/grim_story/grim_playing_3.webp",
    tilt: "lg:rotate-[-2deg] lg:translate-y-10 lg:hover:rotate-0 lg:hover:translate-y-0",
  },
] as const;

export default async function GrimStory() {
  const t = await getTranslations("grimStory");
  const paragraphs = t("body").split("\n\n");

  return (
    <section
      id="histoire"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div>
            <Reveal>
              <span className="section-number">{t("eyebrow")}</span>
              <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--light-text-muted)]">
                {t("subtitle")}
              </p>
            </Reveal>

            <Reveal
              delay={0.1}
              className="mt-8 flex flex-col gap-5 text-sm leading-loose text-[var(--light-text-muted)] md:text-base"
            >
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Reveal>
          </div>

          <Reveal
            direction="right"
            delay={0.15}
            stagger
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                className="w-[68vw] shrink-0 snap-center sm:w-[42vw] lg:w-full lg:shrink"
              >
                <div
                  className={`group relative aspect-[9/16] w-full overflow-hidden rounded-sm shadow-[0_16px_40px_rgba(19,19,19,0.14)] transition-transform duration-500 ease-out lg:hover:z-10 ${photo.tilt}`}
                >
                  <Image
                    src={photo.src}
                    alt={t(`photoAlt${index + 1}`)}
                    fill
                    sizes="(min-width: 1024px) 20vw, 60vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-black/10"
                  />
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
