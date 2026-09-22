import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";

export default async function GrimStory() {
  const t = await getTranslations("grimStory");
  const paragraphs = t("body").split("\n\n");

  return (
    <section
      id="histoire"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-10">
        <Reveal className="text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
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
    </section>
  );
}
