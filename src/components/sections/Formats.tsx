"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formats, formatPrice, type Format } from "@/lib/content";
import ReservationModal from "@/components/ReservationModal";
import CustomOrderModal from "@/components/CustomOrderModal";

export default function Formats() {
  const [currency, setCurrency] = useState<"EUR" | "USD">("EUR");
  const [selected, setSelected] = useState<Format | null>(null);
  const [customOrderOpen, setCustomOrderOpen] = useState(false);
  const t = useTranslations("formats");
  const locale = useLocale();

  return (
    <section
      id="formats"
      className="border-b border-black/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-sm leading-loose text-black/60 md:text-base">
            {t("description")}
          </p>

          <div className="mt-6 inline-flex rounded-full border border-black/20 p-1 text-xs uppercase tracking-[0.15em]">
            {(["EUR", "USD"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  currency === c
                    ? "bg-black text-white"
                    : "text-black/50 hover:text-black"
                }`}
              >
                {c === "EUR" ? "€" : "$"}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
          {formats.map((format) => {
            const features = t.raw(`items.${format.id}.features`) as string[];

            return (
              <article
                key={format.id}
                className={`flex flex-col rounded-sm border p-8 transition-all duration-500 ${
                  format.featured
                    ? "border-gold bg-[color-mix(in_srgb,var(--gold-accent)_12%,var(--card))]"
                    : "border-black/10 bg-card hover:border-black/30"
                }`}
              >
                <span
                  className={`mb-4 self-start rounded-full px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] ${
                    format.featured
                      ? "bg-gold text-black"
                      : "border border-black/20 text-black/60"
                  }`}
                >
                  {t(`items.${format.id}.tag`)}
                </span>
                <h3 className="serif text-2xl italic text-black">
                  {t(`items.${format.id}.name`)}
                </h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-black/50">
                  {t.has(`items.${format.id}.size`)
                    ? t(`items.${format.id}.size`)
                    : format.size}
                </p>

                <ul className="mt-5 flex flex-1 flex-col gap-3 text-sm leading-relaxed text-black/60">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {format.contactOnly ? (
                  <button
                    type="button"
                    onClick={() => setCustomOrderOpen(true)}
                    className="btn-cta mt-8 text-center"
                  >
                    {t("galleryContact")}
                  </button>
                ) : (
                  <>
                    <div className="mt-6 border-t border-black/10 pt-4">
                      <p className="serif text-2xl italic text-black">
                        {formatPrice(format.priceTotal!, currency, locale)}
                      </p>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-black/40">
                        {t("depositWithAmount", {
                          amount: formatPrice(
                            format.priceDeposit!,
                            currency,
                            locale
                          ),
                        })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(format)}
                      className="btn-action mt-6"
                    >
                      {format.featured
                        ? t("reserveFeatured")
                        : t("reserveDefault")}
                    </button>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {selected && (
        <ReservationModal
          format={selected}
          currency={currency}
          onClose={() => setSelected(null)}
        />
      )}

      {customOrderOpen && (
        <CustomOrderModal onClose={() => setCustomOrderOpen(false)} />
      )}
    </section>
  );
}
