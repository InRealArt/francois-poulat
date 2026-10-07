export type Format = {
  id: string;
  size: string;
  priceTotal?: number;
  priceDeposit?: number;
  featured?: boolean;
  contactOnly?: boolean;
};

export const nav = [
  { id: "genese", href: "#genese" },
  { id: "artiste", href: "#artiste" },
  { id: "formats", href: "#formats" },
  { id: "garanties", href: "#garanties" },
  { id: "galerie", href: "#galerie" },
  { id: "faq", href: "#faq" },
] as const;

export const processSteps = [
  { id: "01" },
  { id: "02" },
  { id: "03" },
] as const;

export const formats: Format[] = [
  {
    id: "standard",
    size: "50 × 50 cm",
    priceTotal: 1800,
    priceDeposit: 1350,
    featured: true,
  },
  { id: "sur-mesure", size: "Sur-Mesure", contactOnly: true },
];

export type FormatSize = {
  id: string;
  size: string;
  priceTotal: number;
  priceDeposit: number;
};

export const formatSizes: FormatSize[] = [
  { id: "intime", size: "36 × 36 cm", priceTotal: 1200, priceDeposit: 900 },
  { id: "standard", size: "50 × 50 cm", priceTotal: 1800, priceDeposit: 1350 },
  { id: "studio", size: "70 × 70 cm", priceTotal: 2600, priceDeposit: 1950 },
  { id: "collector", size: "100 × 100 cm", priceTotal: 3800, priceDeposit: 2850 },
  { id: "galerie", size: "120 × 120 cm", priceTotal: 5200, priceDeposit: 3900 },
  { id: "monumentale", size: "150 × 150 cm", priceTotal: 7500, priceDeposit: 5625 },
];

export const unboxingPhotos = [
  { id: "reaction", image: "/images/unboxing/unboxing1.webp" },
  { id: "setup", image: "/images/unboxing/unboxing2.webp" },
  { id: "collector", image: "/images/unboxing/unboxing3.webp" },
] as const;

export const guarantees = [
  { id: "certificate", icon: "certificate" },
  { id: "crate", icon: "crate" },
  { id: "shield", icon: "shield" },
  { id: "wallet", icon: "wallet" },
] as const;

export const galleryDetails = [
  { id: "matieres", image: "/images/carousel/PikaPoulat1.webp" },
  { id: "pigments", image: "/images/carousel/PikaPoulat2.webp" },
  { id: "chassis", image: "/images/carousel/PikaPoulat3.webp" },
  { id: "signature", image: "/images/carousel/PikaPoulat4.webp" },
  { id: "finition", image: "/images/carousel/PikaPoulat5.webp" },
  { id: "elagant", image: "/images/carousel/PikaPoulat6.webp" },
] as const;

export const faqItems = [
  { id: "origin" },
  { id: "payment" },
  { id: "delivery" },
  { id: "packaging" },
  { id: "certificate" },
  { id: "paymentMethods" },
  { id: "damage" },
  { id: "shipping" },
] as const;

export const footerLinks = {
  agency: [
    { id: "site", href: "https://inrealart.com" },
    { id: "genese", href: "#genese" },
    { id: "artist", href: "#artiste" },
    { id: "formats", href: "#formats" },
  ],
  legal: [
    { id: "mentions", href: "/legal" },
    { id: "privacy", href: "/privacy-policy" },
    { id: "cgv", href: "/terms-and-conditions" },
    { id: "influencerDisclosure", href: "/influencer-disclosure" },
    { id: "cookies", href: "/cookie-policy" },
  ],
} as const;

// Must match the date in messages cgv.reference; stored with each order as
// proof of which CGV the customer accepted.
export const TERMS_VERSION = "2026-10-07";

// Used when the live rate is unavailable (client before fetch, or FX API down).
export const FALLBACK_EUR_TO_USD = 1.08;

// Countries offered in Stripe Checkout's shipping address form (ISO 3166-1):
// every country Stripe supports, US first in the target, minus sanctioned
// (RU, BY) and uninhabited territories. Must match the CGV (article 7).
export const SHIPPING_COUNTRIES = [
  "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AR", "AT", "AU",
  "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ",
  "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BW", "BZ", "CA", "CD",
  "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CV", "CW",
  "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH",
  "ER", "ES", "ET", "FI", "FJ", "FK", "FO", "FR", "GA", "GB", "GD", "GE",
  "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GT", "GU",
  "GW", "GY", "HK", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN",
  "IQ", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM",
  "KN", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
  "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MK", "ML",
  "MM", "MN", "MO", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY",
  "MZ", "NA", "NC", "NE", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ",
  "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS",
  "PT", "PY", "QA", "RE", "RO", "RS", "RW", "SA", "SB", "SC", "SD", "SE",
  "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST",
  "SV", "SX", "SZ", "TA", "TC", "TD", "TG", "TH", "TJ", "TK", "TL", "TM",
  "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "US", "UY", "UZ",
  "VA", "VC", "VE", "VG", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA",
  "ZM", "ZW",
] as const;

// Whole units in the target currency. Shared by the display and the
// server-side Stripe amount so both always round the same way.
export function convertFromEur(
  amountEur: number,
  currency: "EUR" | "USD",
  eurToUsd: number
) {
  return currency === "EUR" ? amountEur : Math.round(amountEur * eurToUsd);
}

export function formatPrice(
  amount: number,
  currency: "EUR" | "USD",
  locale: string,
  eurToUsd: number = FALLBACK_EUR_TO_USD
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(convertFromEur(amount, currency, eurToUsd));
}
