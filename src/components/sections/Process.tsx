import { processSteps } from "@/lib/content";

export default function Process() {
  return (
    <section className="border-b border-white/10 bg-[var(--background-grey)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.number} className="flex flex-col">
              <span className="step-number">{step.number}</span>
              <span className="section-number mt-4">{step.eyebrow}</span>
              <h3 className="serif text-2xl italic text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-loose text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
