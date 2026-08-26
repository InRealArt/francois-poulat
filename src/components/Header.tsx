"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { nav } from "@/lib/content";
import { useModalBehavior } from "@/hooks/useModalBehavior";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useModalBehavior(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    if (menuOpen) {
      closeButtonRef.current?.focus();
      return;
    }
    menuButtonRef.current?.focus();
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [menuOpen]);

  function switchLocale(nextLocale: "en" | "fr") {
    router.replace(pathname + window.location.hash, { locale: nextLocale });
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] h-16 md:h-[90px] border-b border-white/10 bg-[rgb(var(--background-rgb))]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1536px] items-center justify-between px-3 sm:px-6 lg:px-10">
        <Link
          href="#top"
          aria-hidden={menuOpen}
          tabIndex={menuOpen ? -1 : undefined}
          className="serif flex items-center gap-3 uppercase tracking-[0.2em] text-sm md:text-lg"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-[0.65rem] font-montserrat tracking-normal text-gold">
            IRA
          </span>
          <span className="hidden sm:flex flex-col leading-tight normal-case">
            <span className="tracking-[0.4em] uppercase">{t("header.brand")}</span>
            <span className="font-montserrat text-[0.55rem] tracking-[0.3em] uppercase text-gray-400">
              {t("header.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-3">
          {nav.map((item, index) => (
            <span key={item.href} className="flex items-center gap-3">
              {index > 0 && (
                <span
                  aria-hidden
                  className="h-[3px] w-[3px] rounded-full bg-gold/50"
                />
              )}
              <a
                href={item.href}
                className="text-[13px] uppercase tracking-[0.25em] text-white/80 transition-colors hover:text-gold"
              >
                {t(`nav.${item.id}`)}
              </a>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div
            role="group"
            aria-label={t("languageSwitcher.label")}
            className="relative hidden items-center rounded-full border border-white/20 p-[3px] text-[11px] md:flex"
          >
            <span
              aria-hidden
              className={`absolute top-[3px] h-[calc(100%-6px)] w-9 rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                locale === "fr" ? "translate-x-9" : "translate-x-0"
              }`}
            />
            {(["en", "fr"] as const).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                aria-current={locale === loc}
                className={`relative z-10 w-9 py-1.5 uppercase tracking-[0.1em] transition-colors ${
                  locale === loc ? "text-background" : "text-white/60 hover:text-white"
                }`}
              >
                {t(`languageSwitcher.${loc}`)}
              </button>
            ))}
          </div>

          <a
            href="#formats"
            aria-hidden={menuOpen}
            tabIndex={menuOpen ? -1 : undefined}
            className="btn-cta hidden md:inline-flex"
          >
            {t("header.reserveLong")}
          </a>
          <a
            href="#formats"
            aria-hidden={menuOpen}
            tabIndex={menuOpen ? -1 : undefined}
            className="md:hidden text-[11px] uppercase tracking-[0.15em] text-gold"
          >
            {t("header.reserveShort")}
          </a>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={t("header.openMenu")}
            aria-hidden={menuOpen}
            tabIndex={menuOpen ? -1 : undefined}
            className="lg:hidden flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
          >
            <span className="h-px w-6 bg-white transition-transform" />
            <span className="h-px w-6 bg-white transition-opacity" />
            <span className="h-px w-6 bg-white transition-transform" />
          </button>
        </div>
      </div>
      </header>

      {menuOpen && (
        <div
          ref={dialogRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("header.menuLabel")}
          className="fixed inset-0 top-16 z-[80] flex flex-col bg-[rgb(var(--background-rgb))] md:top-[90px] lg:hidden"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={t("header.closeMenu")}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-2xl text-white"
          >
            &times;
          </button>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="serif text-2xl italic text-white transition-colors hover:text-gold"
              >
                {t(`nav.${item.id}`)}
              </a>
            ))}

            <a
              href="#formats"
              onClick={() => setMenuOpen(false)}
              className="btn-cta mt-6"
            >
              {t("header.reserveLong")}
            </a>
          </nav>

          <div className="flex items-center justify-center pb-8">
            <div
              role="group"
              aria-label={t("languageSwitcher.label")}
              className="relative flex items-center rounded-full border border-white/20 p-[3px] text-xs"
            >
              <span
                aria-hidden
                className={`absolute top-[3px] h-[calc(100%-6px)] w-10 rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  locale === "fr" ? "translate-x-10" : "translate-x-0"
                }`}
              />
              {(["en", "fr"] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    switchLocale(loc);
                  }}
                  aria-current={locale === loc}
                  className={`relative z-10 w-10 py-2 uppercase tracking-[0.1em] transition-colors ${
                    locale === loc ? "text-background" : "text-white/60"
                  }`}
                >
                  {t(`languageSwitcher.${loc}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
