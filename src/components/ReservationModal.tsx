"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { formatPrice, formatSizes, type Format } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";
import { Link } from "@/i18n/navigation";

// Mirrors /api/checkout. Validated here so error messages follow the page
// language (native browser messages follow the browser's language instead).
const reservationSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.email().max(200),
  address: z.string().trim().min(2).max(500),
  acceptTerms: z.literal(true),
});

type ReservationField = keyof z.infer<typeof reservationSchema>;

type Props = {
  format: Format;
  currency: "EUR" | "USD";
  eurToUsd: number;
  onClose: () => void;
};

export default function ReservationModal({
  format,
  currency,
  eurToUsd,
  onClose,
}: Props) {
  // One id per modal opening: retries of the same cart reuse the same Stripe session.
  const [attemptId] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<ReservationField, boolean>>
  >({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [selectedSize, setSelectedSize] = useState(
    () => formatSizes.find((size) => size.id === format.id) ?? formatSizes[0]
  );
  useModalBehavior(true, onClose);
  const t = useTranslations("reservationModal");
  const tFormats = useTranslations("formats");
  const locale = useLocale();

  // Back button from Stripe restores this page from bfcache mid-"redirecting".
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        setSubmitting(false);
        setCaptchaToken(null);
        turnstileRef.current?.reset();
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = reservationSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      address: formData.get("address"),
      acceptTerms: formData.get("acceptTerms") === "on",
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<ReservationField, boolean>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ReservationField;
        fieldErrors[field] = true;
      }
      setErrors(fieldErrors);
      setCaptchaError(!captchaToken);
      return;
    }

    setErrors({});

    if (!captchaToken) {
      setCaptchaError(true);
      return;
    }

    setSubmitError(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          formatId: format.id,
          sizeId: selectedSize.id,
          currency,
          locale,
          attemptId,
          captchaToken,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        url?: string;
      } | null;

      if (!response.ok || !data?.url) {
        throw new Error("request_failed");
      }

      // Keep the button disabled while the browser leaves for Stripe.
      window.location.assign(data.url);
    } catch {
      setSubmitError(true);
      setSubmitting(false);
      setCaptchaToken(null);
      turnstileRef.current?.reset();
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
        <h3 className="serif mt-4 text-2xl italic text-black">{t("title")}</h3>

        <div className="mt-4 rounded-sm border border-black/10 bg-background p-4">
          <p className="text-sm text-black">
            {tFormats(`items.${format.id}.name`)}
          </p>

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
                amount: formatPrice(
                  selectedSize.priceTotal,
                  currency,
                  locale,
                  eurToUsd
                ),
              })}
            </span>
            <span className="text-gold">
              {t("depositWithAmount", {
                amount: formatPrice(
                  selectedSize.priceDeposit,
                  currency,
                  locale,
                  eurToUsd
                ),
              })}
            </span>
          </div>
          {currency === "USD" && (
            <p className="mt-2 text-[0.6rem] uppercase tracking-[0.1em] text-black/40">
              {t("approxRate")}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
            {t("nameLabel")}
            <input
              required
              id="reservation-name"
              name="name"
              type="text"
              autoComplete="name"
              aria-invalid={errors.name || undefined}
              aria-describedby={
                errors.name ? "reservation-name-error" : undefined
              }
              className={`rounded-none border-b bg-transparent py-2 text-sm text-black outline-none focus:border-gold ${
                errors.name ? "border-red-500" : "border-black/20"
              }`}
            />
            {errors.name && (
              <span
                id="reservation-name-error"
                className="normal-case tracking-normal text-red-400"
              >
                {t("requiredError")}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
            {t("emailLabel")}
            <input
              required
              id="reservation-email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email || undefined}
              aria-describedby={
                errors.email ? "reservation-email-error" : undefined
              }
              className={`rounded-none border-b bg-transparent py-2 text-sm text-black outline-none focus:border-gold ${
                errors.email ? "border-red-500" : "border-black/20"
              }`}
            />
            {errors.email && (
              <span
                id="reservation-email-error"
                className="normal-case tracking-normal text-red-400"
              >
                {t("emailError")}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-black/70">
            {t("addressLabel")}
            <input
              required
              id="reservation-address"
              name="address"
              type="text"
              autoComplete="street-address"
              aria-invalid={errors.address || undefined}
              aria-describedby={
                errors.address ? "reservation-address-error" : undefined
              }
              className={`rounded-none border-b bg-transparent py-2 text-sm text-black outline-none focus:border-gold ${
                errors.address ? "border-red-500" : "border-black/20"
              }`}
            />
            {errors.address && (
              <span
                id="reservation-address-error"
                className="normal-case tracking-normal text-red-400"
              >
                {t("requiredError")}
              </span>
            )}
          </label>

          <p className="mt-2 text-xs leading-relaxed text-black/70">
            {t("paymentNote", {
              amount: formatPrice(
                selectedSize.priceDeposit,
                currency,
                locale,
                eurToUsd
              ),
            })}
          </p>

          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-3 text-xs leading-relaxed text-black/70">
              <input
                required
                id="reservation-accept-terms"
                name="acceptTerms"
                type="checkbox"
                aria-invalid={errors.acceptTerms || undefined}
                aria-describedby={
                  errors.acceptTerms
                    ? "reservation-accept-terms-error"
                    : undefined
                }
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold-accent)]"
              />
              <span>
                {t.rich("acceptTerms", {
                  terms: (chunks) => (
                    <Link
                      href="/terms-and-conditions"
                      target="_blank"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {chunks}
                    </Link>
                  ),
                  withdrawal: (chunks) => (
                    <Link
                      href="/terms-and-conditions#withdrawal"
                      target="_blank"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>
            {errors.acceptTerms && (
              <span
                id="reservation-accept-terms-error"
                className="text-xs text-red-400"
              >
                {t("termsError")}
              </span>
            )}
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
            {submitting ? t("redirecting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
