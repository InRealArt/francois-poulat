import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function InRealArt() {
  const t = await getTranslations("inrealart");

  return (
    <section
      id="inrealart"
      className="border-b border-black/10 bg-[#0a0a0a] py-20 text-white md:py-28"
    >
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-3 text-center sm:px-6 lg:px-10">
        <h2 className="serif pl-[0.4em] text-2xl font-light uppercase tracking-[0.4em] text-white md:text-4xl">
          InRealArt
        </h2>
        <p className="mt-8 text-left text-sm leading-loose text-white/70 md:text-base">
          {t("body")}
        </p>
      </Reveal>
    </section>
  );
}
