"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useModalBehavior } from "@/hooks/useModalBehavior";

type Props = {
  onClose: () => void;
};

const customOrderSchema = z.object({
  format: z.string().trim().min(2),
  medium: z.string().trim().min(2),
  support: z.string().trim().min(2),
  pokemons: z.string().trim().min(2),
  captchaToken: z.string().min(1),
});

type CustomOrderField = keyof z.infer<typeof customOrderSchema>;

export default function CustomOrderModal({ onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<CustomOrderField, boolean>>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  useModalBehavior(true, onClose);
  const t = useTranslations("customOrderModal");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = customOrderSchema.safeParse({
      format: formData.get("format"),
      medium: formData.get("medium"),
      support: formData.get("support"),
      pokemons: formData.get("pokemons"),
      captchaToken,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<CustomOrderField, boolean>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as CustomOrderField;
        fieldErrors[field] = true;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
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
          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("formatLabel")}
              <input
                id="custom-order-format"
                name="format"
                type="text"
                placeholder={t("formatPlaceholder")}
                aria-invalid={errors.format || undefined}
                aria-describedby={errors.format ? "custom-order-format-error" : undefined}
                className={`rounded-none border-b bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold ${
                  errors.format ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.format && (
                <span id="custom-order-format-error" className="normal-case tracking-normal text-red-400">
                  {t("requiredError")}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("mediumLabel")}
              <input
                id="custom-order-medium"
                name="medium"
                type="text"
                placeholder={t("mediumPlaceholder")}
                aria-invalid={errors.medium || undefined}
                aria-describedby={errors.medium ? "custom-order-medium-error" : undefined}
                className={`rounded-none border-b bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold ${
                  errors.medium ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.medium && (
                <span id="custom-order-medium-error" className="normal-case tracking-normal text-red-400">
                  {t("requiredError")}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("supportLabel")}
              <input
                id="custom-order-support"
                name="support"
                type="text"
                placeholder={t("supportPlaceholder")}
                aria-invalid={errors.support || undefined}
                aria-describedby={errors.support ? "custom-order-support-error" : undefined}
                className={`rounded-none border-b bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold ${
                  errors.support ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.support && (
                <span id="custom-order-support-error" className="normal-case tracking-normal text-red-400">
                  {t("requiredError")}
                </span>
              )}
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.15em] text-gray-400">
              {t("pokemonsLabel")}
              <input
                id="custom-order-pokemons"
                name="pokemons"
                type="text"
                placeholder={t("pokemonsPlaceholder")}
                aria-invalid={errors.pokemons || undefined}
                aria-describedby={errors.pokemons ? "custom-order-pokemons-error" : undefined}
                className={`rounded-none border-b bg-transparent py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold ${
                  errors.pokemons ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.pokemons && (
                <span id="custom-order-pokemons-error" className="normal-case tracking-normal text-red-400">
                  {t("requiredError")}
                </span>
              )}
            </label>

            <div className="flex flex-col gap-1">
              <Turnstile
                ref={turnstileRef}
                siteKey={
                  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
                  "1x00000000000000000000AA"
                }
                options={{
                  theme: "dark",
                  refreshExpired: "manual",
                }}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  setErrors((prev) => ({ ...prev, captchaToken: false }));
                }}
                onExpire={() => {
                  setCaptchaToken(null);
                  turnstileRef.current?.reset();
                }}
                onError={() => setCaptchaToken(null)}
              />
              {errors.captchaToken && (
                <span className="text-xs normal-case tracking-normal text-red-400">
                  {t("captchaError")}
                </span>
              )}
            </div>

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
