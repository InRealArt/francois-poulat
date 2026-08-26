"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { faqItems } from "@/lib/content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations("faq");

  return (
    <section
      id="faq"
      className="section-light border-b border-black/10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-10">
        <div className="text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
        </div>

        <div className="mt-12 flex flex-col divide-y divide-black/10 border-y border-black/10">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="serif text-lg italic text-[var(--light-text)] sm:text-xl">
                    {t(`items.${item.id}.question`)}
                  </span>
                  <span
                    className={`shrink-0 text-2xl text-gold transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                  <p className="pb-6 text-sm leading-loose text-[var(--light-text-muted)]">
                    {t(`items.${item.id}.answer`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
