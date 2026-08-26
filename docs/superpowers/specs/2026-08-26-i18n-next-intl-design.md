# Internationalisation (FR/EN) avec next-intl — Design

## Contexte

Le site est une landing page one-page Next.js 16 (App Router) pour l'édition
d'art « Pokepoulat » (François Poulat x Grim, curation InRealArt). Tout le
texte est actuellement en français, en dur :

- soit dans `src/lib/content.ts` (données structurées : nav, hero features,
  process steps, formats, guarantees, gallery, FAQ, footer links),
- soit directement dans le JSX des composants (`Header`, `Footer`,
  `AnnouncementBar`, `ReservationModal`, et chaque section sous
  `src/components/sections/`) : titres, paragraphes, labels de formulaire,
  `alt`, `aria-label`, textes de boutons.

Objectif : rendre le site multilangue (FR/EN) avec un impact SEO et
performance neutre-à-positif, en s'appuyant sur `next-intl`.

## Décisions validées

- **Librairie** : `next-intl` (rendu serveur natif App Router, meilleur
  SEO/perf que `react-i18next` client-only — voir justification ci-dessous).
- **Routing** : routing internationalisé avec préfixe de chemin
  (`localePrefix: "as-needed"`).
- **Locale par défaut** : **anglais** (`en`), servie sans préfixe (`/`).
  Le français est servi sous `/fr`.
- **Langues au lancement** : `en`, `fr`. Structure des messages pensée pour
  ajouter d'autres langues facilement plus tard.
- **Détection automatique** : middleware next-intl basé sur
  `Accept-Language`, avec fallback vers la locale par défaut (`en`).

### Pourquoi next-intl plutôt que react-i18next

- Un switch de langue purement client-side (`react-i18next` sans routing)
  est invisible pour les moteurs de recherche : Google ne crawle qu'une
  version de la page, pas de `hreflang`, pas de sitemap multilingue, le
  contenu anglais ne serait jamais indexable séparément.
- `next-intl` avec routing par locale sert des URLs distinctes
  crawlables/indexables par langue, supporte `hreflang` via les métadonnées
  Next.js, et charge uniquement le JSON de messages nécessaire côté serveur
  (Server Components) — pas de bundle JS de traduction supplémentaire pour
  le contenu statique, meilleur LCP/CWV qu'une lib client-only.

## Architecture

```
middleware.ts                     # détection + redirection de locale
src/i18n/routing.ts                # locales, defaultLocale, localePrefix
src/i18n/navigation.ts             # Link/useRouter/usePathname localisés (wrappers next-intl)
src/i18n/request.ts                # résolution des messages par locale (getRequestConfig)
messages/en.json                   # messages anglais (référence structurelle)
messages/fr.json                   # messages français
src/app/[locale]/layout.tsx        # remplace src/app/layout.tsx
src/app/[locale]/page.tsx          # remplace src/app/page.tsx
next.config.ts                     # withNextIntl(nextConfig)
```

`src/lib/content.ts` est conservé mais allégé : il garde uniquement les
données non-textuelles ou non traduisibles par nature (ids, tailles en cm,
noms de fichiers image, prix numériques, icônes) et la fonction
`formatPrice`. Chaque item garde son `id` stable, utilisé comme clé pour
retrouver le texte correspondant dans les messages (ex.
`formats.items.intime.name`).

## Structure des messages (`messages/en.json` / `fr.json`)

Namespacée par section, avec les mêmes clés `id` que celles utilisées dans
`content.ts` pour les listes (formats, guarantees, gallery, FAQ, process,
footer) :

```jsonc
{
  "meta": { "title": "...", "description": "..." },
  "nav": { "genese": "...", "artiste": "...", "formats": "...", "garanties": "...", "galerie": "...", "faq": "..." },
  "announcementBar": { "text": "...", "cta": "..." },
  "header": { "tagline": "...", "reserveLong": "...", "reserveShort": "...", "openMenu": "...", "closeMenu": "...", "menuLabel": "..." },
  "hero": { "eyebrow": "...", "titleLine1": "...", "titleLine2": "...", "description": "...", "features": ["...", "..."], "ctaPrimary": "...", "ctaSecondary": "...", "badges": ["Stripe SSL", "..."], "imageAlt": "...", "tagSetup": "...", "tagDetail": "...", "formatOfficial": "...", "technique": "...", "unboxingTitle": "...", "unboxingSubtitle": "...", "unboxingCta": "..." },
  "genese": { "eyebrow": "...", "title": "...", "intro": "...", "imageAlt": "...", "tagReview": "...", "tagFormat": "...", "videoAria": "...", "replayLabel": "...", "quote": "...", "quoteSub": "...", "body": "...", "ctaPrimary": "...", "ctaSecondary": "..." },
  "process": { "steps": { "01": { "eyebrow": "...", "title": "...", "description": "..." }, "02": {...}, "03": {...} } },
  "artist": { "eyebrow": "...", "title": "...", "body": "...", "quote": "...", "imageAlt": "...", "name": "...", "role": "...", "stats": { "handmade": {...}, "canvas": {...}, "certificate": {...} }, "cta": "..." },
  "formats": { "eyebrow": "...", "title": "...", "description": "...", "featuredBadge": "...", "reserveDefault": "...", "reserveFeatured": "...", "galleryContact": "...", "depositLabel": "...", "items": { "intime": { "name": "...", "tag": "...", "description": "..." }, "standard": {...}, "studio": {...}, "collector": {..., "extra": "..."}, "galerie": {...}, "monumentale": {...}, "sur-mesure": {..., "extra": "..."} } },
  "guarantees": { "eyebrow": "...", "title": "...", "description": "...", "items": { "certificate": {...}, "crate": {...}, "shield": {...}, "wallet": {...} } },
  "gallery": { "eyebrow": "...", "title": "...", "hint": "...", "ariaLabel": "...", "prevLabel": "...", "nextLabel": "...", "closeLabel": "...", "dotLabel": "...", "items": { "matieres": { "title": "...", "caption": "..." }, "pigments": {...}, "chassis": {...}, "signature": {...}, "finition": {...} } },
  "faq": { "eyebrow": "...", "title": "...", "items": { "payment": { "question": "...", "answer": "..." }, "delivery": {...}, "packaging": {...}, "certificate": {...} } },
  "footer": { "description": "...", "agencyHeading": "...", "contactHeading": "...", "contactQuestion": "...", "followHeading": "...", "copyright": "...", "agencyLinks": { "site": "...", "genese": "...", "artist": "...", "formats": "..." }, "legalLinks": { "mentions": "...", "privacy": "...", "cgv": "..." } },
  "reservationModal": { "badge": "...", "title": "...", "totalLabel": "...", "depositLabel": "...", "success": "...", "nameLabel": "...", "emailLabel": "...", "addressLabel": "...", "paymentPreview": "...", "submit": "...", "sslNote": "...", "closeLabel": "...", "ariaLabel": "..." },
  "languageSwitcher": { "label": "..." }
}
```

Les clés `items.*` utilisées pour formats/guarantees/gallery/faq/process
correspondent aux `id` déjà présents dans `content.ts`, pour garder un seul
point de vérité pour l'ordre et les données non-textuelles, et éviter toute
duplication de logique de mapping.

## Composants impactés

Tous les composants suivants perdent leur texte français en dur et
utilisent soit `useTranslations()` (Client Components : `Header`,
`Formats`, `Faq`, `GalleryDetails`, `ReservationModal`, `AnnouncementBar`
reste Server si possible), soit `getTranslations()` côté Server Component
(`Hero`, `Genese`, `Process`, `Artist`, `Guarantees`, `Footer`) :

- `src/components/Header.tsx` — nav, CTA, aria-labels menu, ajoute le
  sélecteur de langue (liens `Link` de `src/i18n/navigation.ts` avec
  `locale="en"|"fr"`, préserve le `pathname` courant).
- `src/components/Footer.tsx` — description, headings, liens (labels
  traduits, `href` conservés depuis `content.ts`), `socials` (labels
  seulement, pas de traduction nécessaire pour les noms de marques —
  restent en dur, mais migrés dans un tableau simple, pas de clé i18n).
- `src/components/AnnouncementBar.tsx` — texte + CTA.
- `src/components/ReservationModal.tsx` — tous les textes/labels/aria.
- `src/components/sections/Hero.tsx`, `Genese.tsx`, `Process.tsx`,
  `Artist.tsx`, `Formats.tsx`, `Guarantees.tsx`, `GalleryDetails.tsx`,
  `Faq.tsx` — titres, paragraphes, alt text, aria-labels, CTA.
- `src/app/[locale]/layout.tsx` — `metadata` traduite via
  `generateMetadata` + `getTranslations`, `lang={locale}` dynamique,
  `NextIntlClientProvider`.

`Reveal.tsx` et `useModalBehavior.ts` ne portent aucun texte, non impactés.

## Erreurs / cas limites

- Locale non supportée dans l'URL → 404 standard Next.js (comportement par
  défaut de next-intl `notFound()` dans `i18n/request.ts`).
- `formatPrice` : le formatage `Intl.NumberFormat` reste basé sur la devise
  choisie (EUR/USD), indépendant de la locale d'affichage — pas de
  changement de comportement, mais on pourra passer `locale` au lieu du
  `"fr-FR"` codé en dur pour un rendu de séparateurs cohérent avec la
  langue active (à faire dans le cadre de cette migration, comportement
  visuel mineur).

## Tests / vérification

- `tsc --noEmit`, `next lint`.
- `next build` (vérifie `generateStaticParams` pour `en`/`fr`).
- Test manuel navigateur : `/`, `/fr`, switch de langue via le sélecteur du
  Header en conservant la position de scroll/section, ancre `#formats`
  fonctionnelle sur les deux locales, FAQ/carousel/modal fonctionnels dans
  les deux langues.

## Hors périmètre

- Pas de traduction du contenu `Reveal`/animations GSAP (aucun texte).
- Pas de nouvelles langues au-delà de `en`/`fr` pour cette itération.
- Pas de détection de devise liée à la locale (le sélecteur EUR/USD dans
  `Formats` reste indépendant du choix de langue).
