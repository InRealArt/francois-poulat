import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

const screens = [
  {
    id: "agency",
    image: { fr: "/images/inrealart/screen_agence.webp", en: "/images/inrealart/screen_agence_en.webp" },
  },
  {
    id: "media",
    image: { fr: "/images/inrealart/screen_media.webp", en: "/images/inrealart/screen_media_en.webp" },
  },
  {
    id: "store",
    image: { fr: "/images/inrealart/screen_store.webp", en: "/images/inrealart/screen_store_en.webp" },
  },
] as const;

export default async function InRealArt() {
  const t = await getTranslations("inrealart");
  const locale = (await getLocale()) === "fr" ? "fr" : "en";

  return (
    <section
      id="inrealart"
      className="border-b border-black/10 bg-white py-20 text-black md:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <Reveal
          direction="left"
          className="artwork-image relative aspect-[1920/1835] w-full overflow-hidden rounded-sm"
        >
          <Image
            src={
              locale === "fr"
                ? "/images/inrealart/main_inrealart.webp"
                : "/images/inrealart/main_inrealart_en.webp"
            }
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <h2 className="serif text-2xl font-light uppercase tracking-[0.4em] text-black md:text-4xl">
            InRealArt
          </h2>
          <p className="mt-8 text-[15px] leading-loose text-black/70 md:text-[17px]">
            {t("body")}
          </p>
        </Reveal>
      </div>

      <ul className="mx-auto mt-16 grid max-w-[1440px] gap-8 px-3 sm:grid-cols-3 sm:px-6 lg:mt-20 lg:px-10">
        {screens.map((screen, index) => (
          <Reveal as="li" key={screen.id} delay={index * 0.1}>
            <div>
              <div className="overflow-hidden rounded-sm border border-black/10 bg-black/5">
                <div className="flex items-center gap-1.5 border-b border-black/10 px-3 py-2" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={screen.image[locale]}
                    alt={t(`screens.${screen.id}.alt`)}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-black/60">
                {t(`screens.${screen.id}.label`)}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
