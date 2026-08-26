"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice, type Format } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = {
  format: Format;
  currency: "EUR" | "USD";
  onClose: () => void;
};

export default function ReservationModal({ format, currency, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  useModalBehavior(true, onClose);
  const t = useTranslations("reservationModal");
  const tFormats = useTranslations("formats");
  const locale = useLocale();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t("ariaLabel")}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-sm border border-white/10 bg-card p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <span className="tag-badge inline-block border-gold text-[0.6rem] uppercase tracking-[0.15em] text-gold">
          {t("badge")}
        </span>
        <h3 className="serif mt-4 text-2xl italic text-white">
          {t("title")}
        </h3>

        <div className="mt-4 rounded-sm border border-white/10 bg-background p-4">
          <p className="text-sm text-white">{tFormats(`items.${format.id}.name`)}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-gray-400">
            {format.size}
          </p>
          {format.priceTotal && format.priceDeposit && (
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs uppercase tracking-[0.1em]">
              <span className="text-gray-400">
                {t("totalLabel")}&nbsp;: {formatPrice(format.priceTotal, currency, locale)}
              </span>
              <span className="text-gold">
                {t("depositLabel")}&nbsp;: {formatPrice(format.priceDeposit, currency, locale)}
              </span>
            </div>
          )}
        </div>

        {submitted ? (
          <p className="mt-6 text-sm leading-relaxed text-gold">
            {t("success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("nameLabel")}
              <input
                required
                id="reservation-name"
                name="name"
                type="text"
                autoComplete="name"
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("emailLabel")}
              <input
                required
                id="reservation-email"
                name="email"
                type="email"
                autoComplete="email"
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("addressLabel")}
              <input
                required
                id="reservation-address"
                name="address"
                type="text"
                autoComplete="street-address"
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none focus:border-gold"
              />
            </label>

            <div className="mt-2 rounded-sm border border-dashed border-white/20 p-3 text-xs text-gray-500">
              {t("paymentPreview")}
            </div>

            <button type="submit" className="btn-action mt-2">
              {t("submit")}
            </button>
            <p className="text-center text-[0.6rem] uppercase tracking-[0.1em] text-gray-600">
              {t("sslNote")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
