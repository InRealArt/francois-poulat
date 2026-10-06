import { getTranslations } from "next-intl/server";
import { processSteps } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default async function Process() {
  const t = await getTranslations("process");

  return (
    <section className="border-b border-black/10 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <Reveal stagger className="grid gap-12 sm:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.id} className="flex flex-col">
              <span className="step-number">{t(`items.${step.id}.value`)}</span>
              <h3 className="serif mt-4 text-2xl italic text-black">
                {t(`items.${step.id}.title`)}
              </h3>
              <p className="mt-3 text-[15px] leading-loose md:text-base text-black/70">
                {t(`items.${step.id}.description`)}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
