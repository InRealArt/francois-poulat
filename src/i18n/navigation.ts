import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// Plain-<a> href to a section of the home page, e.g. "/#formats" or
// "/fr#formats". Same page: native anchor jump. Elsewhere: loads the home page.
// (next-intl <Link> appends hashes after a client navigation: "/#formats#faq".)
export function homeAnchorHref(locale: string, anchor: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix || "/"}${anchor}`;
}
