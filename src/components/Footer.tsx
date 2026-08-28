import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { footerLinks } from "@/lib/content";

const socials: { name: string; href: string; icon: ReactNode }[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/inrealartgallery/",
    icon: (
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38a3.7 3.7 0 0 1 1.38-.9c.42-.17 1.06-.37 2.23-.42C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.94.05-1.45.2-1.79.34-.45.17-.77.38-1.11.72-.34.34-.55.66-.72 1.11-.13.34-.29.85-.34 1.79-.06 1.24-.07 1.6-.07 4.74s.01 3.5.07 4.74c.05.94.2 1.45.34 1.79.17.45.38.77.72 1.11.34.34.66.55 1.11.72.34.13.85.29 1.79.34 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.94-.05 1.45-.2 1.79-.34.45-.17.77-.38 1.11-.72.34-.34.55-.66.72-1.11.13-.34.29-.85.34-1.79.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.05-.94-.2-1.45-.34-1.79a2.98 2.98 0 0 0-.72-1.11 2.98 2.98 0 0 0-1.11-.72c-.34-.13-.85-.29-1.79-.34C15.5 4.01 15.14 4 12 4Zm0 3.07a4.93 4.93 0 1 1 0 9.86 4.93 4.93 0 0 1 0-9.86Zm0 1.8a3.13 3.13 0 1 0 0 6.26 3.13 3.13 0 0 0 0-6.26Zm5.13-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/inrealart/",
    icon: (
      <path d="M4.98 3.5A2.5 2.5 0 0 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.25 9.75h3.5V21h-3.5V9.75Zm5.75 0h3.35v1.54h.05c.47-.88 1.6-1.8 3.3-1.8 3.53 0 4.18 2.32 4.18 5.33V21h-3.5v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.9 1.28-1.9 2.6V21h-3.5V9.75Z" />
    ),
  },
];

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-background pt-16 pb-8">
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-[0.65rem] text-gold">
                IRA
              </span>
              <span className="serif text-lg uppercase tracking-[0.3em]">
                InRealArt
              </span>
            </div>
            <p className="footer-link mt-4 max-w-xs !text-gray-400">
              {t("description")}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {t("agencyHeading")}
            </p>
            <ul className="mt-4 flex flex-col">
              {footerLinks.agency.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="footer-link">
                    {t(`agencyLinks.${link.id}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {t("contactHeading")}
            </p>
            <p className="mt-4 text-sm text-gray-400">
              {t("contactQuestion")}
            </p>
            <a
              href="mailto:teaminrealart@gmail.com"
              className="footer-link mt-2 !text-gold"
            >
              teaminrealart@gmail.com
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white">
              {t("followHeading")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-colors hover:border-gold hover:text-gold"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-[18px] w-[18px]"
                      aria-hidden
                    >
                      {social.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.65rem] uppercase tracking-[0.1em] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <ul className="flex flex-wrap gap-6">
            {footerLinks.legal.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {t(`legalLinks.${link.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
