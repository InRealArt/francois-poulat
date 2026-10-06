import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function Artist() {
  const t = await getTranslations("artist");

  return (
    <section
      id="artiste"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 px-3 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-10 lg:gap-20">
        <Reveal
          direction="left"
          className="member-card artwork-image relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-sm sm:max-w-sm"
        >
          <Image
            src="/images/francois_poulat.webp"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 640px) 640px, 540px"
            className="member-image object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-sm bg-black/70 p-4 backdrop-blur">
            <p className="font-montserrat text-xs uppercase tracking-[0.15em] text-white">
              {t("name")}
            </p>
            <p className="font-montserrat text-[0.65rem] uppercase tracking-[0.15em] text-gray-400">
              {t("role")}
            </p>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.15}>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
          <p className="mt-5 text-[15px] leading-loose text-[var(--light-text-muted)] md:text-[17px]">
            {t("body")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
