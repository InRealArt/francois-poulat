import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

const screens = [
  {
    id: "artist",
    image: "/images/inrealart/screen_artist.webp",
    url: "https://www.inrealart.com/artists/francois-poulat",
  },
  {
    id: "media",
    image: "/images/inrealart/screen_media.webp",
    url: "https://www.inrealart.com/media",
  },
  {
    id: "store",
    image: "/images/inrealart/screen_store.webp",
    url: "https://www.inrealart.com/presale",
  },
] as const;

export default async function InRealArt() {
  const t = await getTranslations("inrealart");

  return (
    <section
      id="inrealart"
      className="border-b border-black/10 bg-[#0a0a0a] py-20 text-white md:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-10">
        <Reveal
          direction="left"
          className="artwork-image relative aspect-[3/2] w-full overflow-hidden rounded-sm"
        >
          <Image
            src="/images/inrealart/inrealart.webp"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <h2 className="serif text-2xl font-light uppercase tracking-[0.4em] text-white md:text-4xl">
            InRealArt
          </h2>
          <p className="mt-8 text-[15px] leading-loose text-white/70 md:text-[17px]">
            {t("body")}
          </p>
        </Reveal>
      </div>

      <ul className="mx-auto mt-16 grid max-w-[1440px] gap-8 px-3 sm:grid-cols-3 sm:px-6 lg:mt-20 lg:px-10">
        {screens.map((screen, index) => (
          <Reveal as="li" key={screen.id} delay={index * 0.1}>
            <a
              href={screen.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white/60"
            >
              <div className="overflow-hidden rounded-sm border border-white/10 bg-white/5">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={screen.image}
                    alt={t(`screens.${screen.id}.alt`)}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/60 transition-colors group-hover:text-white">
                {t(`screens.${screen.id}.label`)}
              </p>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
