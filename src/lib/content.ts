export type Format = {
  id: string;
  name: string;
  size: string;
  tag: string;
  description: string;
  extra?: string;
  priceTotal?: number;
  priceDeposit?: number;
  featured?: boolean;
  contactOnly?: boolean;
};

export const nav = [
  { label: "La Genèse Live", href: "#genese" },
  { label: "François Poulat", href: "#artiste" },
  { label: "Formats & Acompte", href: "#formats" },
  { label: "Garanties", href: "#garanties" },
  { label: "Galerie Détaillée", href: "#galerie" },
  { label: "FAQ", href: "#faq" },
];

export const heroFeatures = [
  "7 Dimensions Physiques Sur-Mesure",
  "Certificat Physiquement Scellé & Signé",
  "Acompte 50 % Sécurisé via Stripe",
  "Caisse Bois Blindée & Transport Assuré",
];

export const processSteps = [
  {
    number: "01",
    eyebrow: "Conception",
    title: "L'Exigence du Studio",
    description:
      "Une composition Pop Art équilibrée pensée pour ressortir avec éclat sous l'éclairage de stream de Grim.",
  },
  {
    number: "02",
    eyebrow: "Réalisation",
    title: "Le Geste de Poulat",
    description:
      "Superposition de matière, couches d'acrylique et pochoirs minutieux appliqués à la main en atelier.",
  },
  {
    number: "03",
    eyebrow: "Certification",
    title: "Certificat Physique",
    description:
      "Chaque tirage est fourni avec un certificat officiel numéroté et signé à la main par François Poulat.",
  },
];

export const artistStats = [
  { value: "100%", label: "Fait Main Atelier" },
  { value: "Musée", label: "Qualité Toile" },
  { value: "Signé", label: "Certificat InRealArt" },
];

export const formats: Format[] = [
  {
    id: "intime",
    name: "Édition Intime",
    size: "36 × 36 cm",
    tag: "Châssis Bois",
    description:
      "Format idéal pour étagère collector ou bureau d'exposition.",
    priceTotal: 1200,
    priceDeposit: 600,
  },
  {
    id: "standard",
    name: "Format Standard",
    size: "50 × 50 cm",
    tag: "Classique",
    description:
      "Équilibre parfait pour habiller un mur d'intérieur contemporain.",
    extra: "Emballage renforcé inclus",
    priceTotal: 1800,
    priceDeposit: 900,
  },
  {
    id: "studio",
    name: "Format Studio",
    size: "70 × 70 cm",
    tag: "Incontournable",
    description:
      "Presence forte et détails vibrants sans encombrer l'espace.",
    priceTotal: 2600,
    priceDeposit: 1300,
  },
  {
    id: "collector",
    name: "Édition Collector Studio",
    size: "100 × 100 cm",
    tag: "Coup de Cœur",
    description:
      "Exactement la même dimension que l'œuvre trônant derrière le setup de Grim.",
    extra: "Certificat d'authenticité numéroté inclus",
    priceTotal: 3800,
    priceDeposit: 1900,
    featured: true,
  },
  {
    id: "galerie",
    name: "Format Galerie",
    size: "120 × 120 cm",
    tag: "Grand Format",
    description:
      "Immersive, cette dimension sublime les textures relief d'acrylique.",
    priceTotal: 5200,
    priceDeposit: 2600,
  },
  {
    id: "monumentale",
    name: "Édition Monumentale",
    size: "150 × 150 cm",
    tag: "Exposition",
    description:
      "Une présence muséale imposante pour grands espaces & lofts.",
    priceTotal: 7500,
    priceDeposit: 3750,
  },
  {
    id: "sur-mesure",
    name: "Projet Dédié",
    size: "Sur-Mesure",
    tag: "Commande Spéciale",
    description:
      "Dimension personnalisée, encadrement spécifique ou projet privé.",
    extra:
      "InRealArt Private Curation — Étude architecturale & chiffrage personnalisé par nos curateurs sous 24h.",
    contactOnly: true,
  },
];

export const guarantees = [
  {
    icon: "certificate",
    title: "Certificat Numéroté",
    description:
      "Document officiel scellé physiquement et signé à la main par François Poulat certifiant l'authenticité de l'œuvre.",
  },
  {
    icon: "crate",
    title: "Caisse Bois Blindée",
    description:
      "Expédition sécurisée sous caisse en bois renforcée, conçue spécifiquement pour absorber les chocs durant le transit.",
  },
  {
    icon: "shield",
    title: "Assurance Transport 100%",
    description:
      "Votre livraison est couverte à 100% de sa valeur avec suivi en temps réel et remise contre signature obligatoire.",
  },
  {
    icon: "wallet",
    title: "Acompte 50 %",
    description:
      "Réglez seulement 50 % pour lancer la fabrication. Le solde de 50 % n'est prélevé qu'une fois l'œuvre prête à être envoyée.",
  },
];

export const galleryDetails = [
  {
    id: "matieres",
    title: "Texturing & Matière",
    caption: "Couches d'acrylique appliquées au couteau",
    image: "/images/carousel/PokePoulat1.webp",
  },
  {
    id: "pigments",
    title: "Vibration des Pigments",
    caption: "Contraste vif optimisé pour écran & studio",
    image: "/images/carousel/PokePoulat2.webp",
  },
  {
    id: "chassis",
    title: "Châssis Sur-Mesure",
    caption: "Bois résineux renforcé haute stabilité",
    image: "/images/carousel/PokePoulat3.webp",
  },
  {
    id: "signature",
    title: "Signature Poulat",
    caption: "Signée au dos avec certificat d'authenticité",
    image: "/images/carousel/PokePoulat4.webp",
  },
  {
    id: "finition",
    title: "Finition & Vernis",
    caption: "Protection UV, rendu profond et durable",
    image: "/images/carousel/PokePoulat5.webp",
  },
];

export const faqItems = [
  {
    question: "Comment fonctionne le paiement par acompte de 50 % ?",
    answer:
      "Lors de votre réservation, vous ne réglez que 50 % de la valeur totale de votre tirage via notre checkout sécurisé. Ce premier versement bloque immédiatement votre place dans le carnet de production. Le solde restant de 50 % ne vous sera demandé qu'une fois la pièce finalisée, inspectée et prête pour l'expédition.",
  },
  {
    question: "Quels sont les délais de fabrication et de livraison ?",
    answer:
      "Chaque œuvre étant minutieusement préparée et vernie sur châssis, comptez entre 2 à 3 semaines de fabrication. L'expédition prend ensuite 48 à 72h via transporteur spécialisé en œuvres d'art avec numéro de suivi prioritaire.",
  },
  {
    question: "Comment est emballée l'œuvre d'art ?",
    answer:
      "Toutes nos éditions d'art physiques sont emballées sous film protecteur anti-humidité, calées dans de la mousse haute densité, puis verrouillées dans une caisse renforcée en bois blindé spécifiquement adaptée aux dimensions sélectionnées.",
  },
  {
    question:
      "L'œuvre est-elle accompagnée d'un certificat d'authenticité ?",
    answer:
      "Oui, absolument. Chaque tirage physique délivré par l'Agence InRealArt inclut son Certificat d'Authenticité Physique, scellé, numéroté et signé manuscritement par l'artiste François Poulat.",
  },
];

export const footerLinks = {
  agency: [
    { label: "Site Officiel", href: "https://inrealart.com" },
    { label: "Genèse Pokepoulat", href: "#genese" },
    { label: "François Poulat", href: "#artiste" },
    { label: "Formats & Acompte", href: "#formats" },
  ],
  legal: [
    { label: "Mentions Légales", href: "#" },
    { label: "Politique de Confidentialité", href: "#" },
    { label: "CGV & Garanties", href: "#" },
  ],
};

export function formatPrice(amount: number, currency: "EUR" | "USD") {
  const value = currency === "EUR" ? amount : Math.round(amount * 1.08);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
