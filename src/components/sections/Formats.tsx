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
      className="border-b border-white/10 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-number mx-auto">{t("eyebrow")}</span>
          <h2 className="serif text-3xl italic sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-sm leading-loose text-gray-300 md:text-base">
            {t("description")}
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/20 p-1 text-xs uppercase tracking-[0.15em]">
            {(["EUR", "USD"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  currency === c
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {c === "EUR" ? "€" : "$"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {formats.map((format) => (
            <article
              key={format.id}
              className={`flex flex-col rounded-sm border p-6 transition-all duration-500 ${
                format.featured
                  ? "border-gold bg-[color-mix(in_srgb,var(--gold-accent)_12%,var(--card))]"
                  : "border-white/10 bg-card hover:border-white/30"
              }`}
            >
              {format.featured && (
                <span className="mb-3 self-start rounded-full bg-gold px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-black">
                  {t("featuredBadge")}
                </span>
              )}
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                {t(`items.${format.id}.tag`)}
              </span>
              <h3 className="serif mt-2 text-xl italic text-white">
                {t(`items.${format.id}.name`)}
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-gray-400">
                {t.has(`items.${format.id}.size`)
                  ? t(`items.${format.id}.size`)
                  : format.size}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-300">
                {t(`items.${format.id}.description`)}
              </p>
              {t.has(`items.${format.id}.extra`) && (
                <p className="mt-3 text-xs leading-relaxed text-gold">
                  {t(`items.${format.id}.extra`)}
                </p>
              )}

              {format.contactOnly ? (
                <button
                  type="button"
                  onClick={() => setCustomOrderOpen(true)}
                  className="btn-cta mt-6 text-center"
                >
                  {t("galleryContact")}
                </button>
              ) : (
                <>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="serif text-2xl italic text-white">
                      {formatPrice(format.priceTotal!, currency, locale)}
                    </p>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-[0.15em] text-gray-500">
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
          ))}
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
