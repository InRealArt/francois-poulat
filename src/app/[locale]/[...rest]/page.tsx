import { redirect } from "@/i18n/navigation";
import type { Locale } from "next-intl";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

// Catches any unknown path under a valid locale (e.g. `/fr/test`) and
// sends the visitor back to the localized home page instead of a 404.
export default async function CatchAllLocalePage({
  params,
}: PageProps<"/[locale]/[...rest]">) {
  const { locale } = await params;
  const resolved: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  redirect({ href: "/", locale: resolved });
}
