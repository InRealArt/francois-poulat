"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = {
  onClose: () => void;
};

export default function CustomOrderModal({ onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  useModalBehavior(true, onClose);
  const t = useTranslations("customOrderModal");

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
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <span className="tag-badge inline-block border-gold text-[0.6rem] uppercase tracking-[0.15em] text-gold">
          {t("badge")}
        </span>
        <h3 className="serif mt-4 text-2xl italic text-white">{t("title")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          {t("intro")}
        </p>

        {submitted ? (
          <p className="mt-6 text-sm leading-relaxed text-gold">
            {t("success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("formatLabel")}
              <input
                required
                id="custom-order-format"
                name="format"
                type="text"
                placeholder={t("formatPlaceholder")}
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("mediumLabel")}
              <input
                required
                id="custom-order-medium"
                name="medium"
                type="text"
                placeholder={t("mediumPlaceholder")}
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("supportLabel")}
              <input
                required
                id="custom-order-support"
                name="support"
                type="text"
                placeholder={t("supportPlaceholder")}
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("pokemonsLabel")}
              <input
                required
                id="custom-order-pokemons"
                name="pokemons"
                type="text"
                placeholder={t("pokemonsPlaceholder")}
                className="rounded-none border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold"
              />
            </label>

            <button type="submit" className="btn-action mt-2">
              {t("submit")}
            </button>
            <p className="text-center text-[0.6rem] uppercase tracking-[0.1em] text-gray-600">
              {t("responseNote")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
