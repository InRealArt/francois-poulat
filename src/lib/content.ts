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
  { number: "01" },
  { number: "02" },
  { number: "03" },
] as const;

export const artistStats = [
  { id: "handmade" },
  { id: "canvas" },
  { id: "certificate" },
] as const;

export const formats: Format[] = [
  { id: "intime", size: "36 × 36 cm", priceTotal: 1200, priceDeposit: 600 },
  {
    id: "standard",
    size: "50 × 50 cm",
    priceTotal: 1800,
    priceDeposit: 900,
  },
  { id: "studio", size: "70 × 70 cm", priceTotal: 2600, priceDeposit: 1300 },
  {
    id: "collector",
    size: "100 × 100 cm",
    priceTotal: 3800,
    priceDeposit: 1900,
    featured: true,
  },
  {
    id: "galerie",
    size: "120 × 120 cm",
    priceTotal: 5200,
    priceDeposit: 2600,
  },
  {
    id: "monumentale",
    size: "150 × 150 cm",
    priceTotal: 7500,
    priceDeposit: 3750,
  },
  { id: "sur-mesure", size: "Sur-Mesure", contactOnly: true },
];

export const guarantees = [
  { id: "certificate", icon: "certificate" },
  { id: "crate", icon: "crate" },
  { id: "shield", icon: "shield" },
  { id: "wallet", icon: "wallet" },
] as const;

export const galleryDetails = [
  { id: "matieres", image: "/images/carousel/PokePoulat1.webp" },
  { id: "pigments", image: "/images/carousel/PokePoulat2.webp" },
  { id: "chassis", image: "/images/carousel/PokePoulat3.webp" },
  { id: "signature", image: "/images/carousel/PokePoulat4.webp" },
  { id: "finition", image: "/images/carousel/PokePoulat5.webp" },
] as const;

export const faqItems = [
  { id: "payment" },
  { id: "delivery" },
  { id: "packaging" },
  { id: "certificate" },
] as const;

export const footerLinks = {
  agency: [
    { id: "site", href: "https://inrealart.com" },
    { id: "genese", href: "#genese" },
    { id: "artist", href: "#artiste" },
    { id: "formats", href: "#formats" },
  ],
  legal: [
    { id: "mentions", href: "#" },
    { id: "privacy", href: "#" },
    { id: "cgv", href: "#" },
  ],
} as const;

export function formatPrice(
  amount: number,
  currency: "EUR" | "USD",
  locale: string
) {
  const value = currency === "EUR" ? amount : Math.round(amount * 1.08);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
