"use client";

import { useState } from "react";
import { faqItems } from "@/lib/content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-10">
        <div className="text-center">
          <span className="section-number mx-auto">
            {"// Des Questions ?"}
          </span>
          <h2 className="serif text-3xl italic sm:text-4xl">
            Foire Aux Questions Client
          </h2>
        </div>

        <div className="mt-12 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="serif text-lg italic text-white sm:text-xl">
                    {item.question}
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
                  <p className="pb-6 text-sm leading-loose text-gray-300">
                    {item.answer}
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
