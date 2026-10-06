"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { formatPrice, formatSizes, type Format } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = {
  format: Format;
  currency: "EUR" | "USD";
  onClose: () => void;
};

export default function ReservationModal({ format, currency, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [selectedSize, setSelectedSize] = useState(
    () => formatSizes.find((size) => size.id === format.id) ?? formatSizes[0]
  );
  useModalBehavior(true, onClose);
  const t = useTranslations("reservationModal");
  const tFormats = useTranslations("formats");
  const locale = useLocale();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }

    const formData = new FormData(event.currentTarget);
    setSubmitError(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          address: formData.get("address"),
          formatId: format.id,
          sizeId: selectedSize.id,
          currency,
          captchaToken,
        }),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(true);
      setCaptchaToken(null);
      turnstileRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
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
        className="relative w-full max-w-lg rounded-sm border border-black/10 bg-card p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="absolute right-4 top-4 text-black/70 transition-colors hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <span className="tag-badge inline-block border-gold text-[0.6rem] uppercase tracking-[0.15em] text-gold">
          {t("badge")}
        </span>
        <h3 className="serif mt-4 text-2xl italic text-black">
          {t("title")}
        </h3>

        <div className="mt-4 rounded-sm border border-black/10 bg-background p-4">
          <p className="text-sm text-black">{tFormats(`items.${format.id}.name`)}</p>

          <fieldset className="mt-3">
            <legend className="text-[0.65rem] uppercase tracking-[0.15em] text-black/70">
              {t("sizeLabel")}
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {formatSizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize.id === size.id}
                  className={`rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.05em] transition-colors ${
                    selectedSize.id === size.id
                      ? "border-gold bg-gold text-black"
                      : "border-black/20 text-black/70 hover:border-black/40"
                  }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-xs uppercase tracking-[0.1em]">
            <span className="text-black/70">
              {t("totalWithAmount", {
                amount: formatPrice(selectedSize.priceTotal, currency, locale),
              })}
            </span>
            <span className="text-gold">
              {t("depositWithAmount", {
                amount: formatPrice(selectedSize.priceDeposit, currency, locale),
              })}
            </span>
          </div>
        </div>

        {submitted ? (
          <p className="mt-6 text-[15px] leading-relaxed text-gold">
            {t("success")}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
              {t("nameLabel")}
              <input
                required
                id="reservation-name"
                name="name"
                type="text"
                autoComplete="name"
                className="rounded-none border-b border-black/20 bg-transparent py-2 text-sm text-black outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
              {t("emailLabel")}
              <input
                required
                id="reservation-email"
                name="email"
                type="email"
                autoComplete="email"
                className="rounded-none border-b border-black/20 bg-transparent py-2 text-sm text-black outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
              {t("addressLabel")}
              <input
                required
                id="reservation-address"
                name="address"
                type="text"
                autoComplete="street-address"
                className="rounded-none border-b border-black/20 bg-transparent py-2 text-sm text-black outline-none focus:border-gold"
              />
            </label>

            <div className="mt-2 rounded-sm border border-dashed border-black/20 p-3 text-xs text-black/40">
              {t("paymentPreview")}
            </div>

            <div className="flex flex-col gap-1">
              <Turnstile
                ref={turnstileRef}
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
                  "1x00000000000000000000AA"
                }
                options={{
                  theme: "light",
                  refreshExpired: "manual",
                }}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  setCaptchaError(false);
                }}
                onExpire={() => {
                  setCaptchaToken(null);
                  turnstileRef.current?.reset();
                }}
                onError={() => setCaptchaToken(null)}
              />
              {captchaError && (
                <span className="text-xs normal-case tracking-normal text-red-400">
                  {t("captchaError")}
                </span>
              )}
            </div>

            {submitError && (
              <p className="text-xs normal-case tracking-normal text-red-400">
                {t("submitError")}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-action mt-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
            <p className="text-center text-[0.6rem] uppercase tracking-[0.1em] text-black/30">
              {t("sslNote")}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
