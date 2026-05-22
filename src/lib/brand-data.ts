import { assetById } from "./assets-manifest";

export type NavLink = {
  label: string;
  href: string;
  accent?: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  size?: string;
  color?: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export type ProductState =
  | "live"
  | "locked"
  | "coming_soon"
  | "sold_out"
  | "hidden";

export type Product = {
  id: string;
  slug: string;
  title: string;
  japaneseTitle: string;
  category: "tees" | "hoodies" | "accessories" | "collectibles";
  price: number;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  badges: string[];
  availability: "new" | "limited" | "archive";
  productState: ProductState;
  description: string;
  archiveCode?: string;
  stateNote?: string;
  source?: "local" | "shopify";
  shopifyProductId?: string;
  shopifyHandle?: string;
  shopifyVariants?: ProductVariant[];
};

export type Collection = {
  id: string;
  title: string;
  label: string;
  href: string;
  image: string;
  accent: string;
  summary: string;
};

export type Drop = {
  id: string;
  title: string;
  launchDate: string;
  status: "loading" | "live" | "archived";
  heroAsset: string;
  ctaLabel: string;
  ctaHref: string;
  copy: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  copy: string;
};

export const liveProductSlugs = [
  "action-replay-galaxy-tee",
  "ar-003-corrupted-promo-poster",
] as const;

export const visibleProductSlugs = [
  "action-replay-galaxy-tee",
  "ar-002-memory-card-tee",
  "ar-003-corrupted-promo-poster",
] as const;

export const hiddenProductSlugs = [] as const;

export const publicProductSlugs = [
  ...visibleProductSlugs,
  ...hiddenProductSlugs,
] as const;

export const productStateLabels: Record<ProductState, string> = {
  live: "Available now",
  locked: "Archive only",
  coming_soon: "Coming soon",
  sold_out: "Sold out",
  hidden: "Private listing",
};

export function isPurchasableProduct(product: Product) {
  return product.productState === "live";
}

export function productActionLabel(product: Product) {
  if (product.productState === "live") return "Add to bag";
  if (product.productState === "sold_out") return "Sold out";
  if (product.productState === "coming_soon") return "Coming soon";
  if (product.productState === "hidden") return "Private listing";
  return "Archive only";
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", accent: "AR-001" },
];

export const products: Product[] = [
  {
    id: "p-001",
    slug: "action-replay-galaxy-tee",
    title: "AR-001 \"GALAXY\" TEE",
    japaneseTitle: "ギャラクシー Tシャツ",
    category: "tees",
    price: 48,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Retro Black", hex: "#050505" },
      { name: "White", hex: "#f6f4ef" },
    ],
    images: [
      assetById["galaxy-tee-editorial-blue"].src,
      assetById["galaxy-tee-product"].src,
      assetById["galaxy-tee-editorial-floor"].src,
      assetById["galaxy-tee-editorial-shoulder"].src,
    ],
    badges: ["AR-001", "Galaxy", "New drop"],
    availability: "new",
    productState: "live",
    description:
      "Enzyme-washed cotton tee with the Galaxy graphic, sleeve mark, and soft broken-in weight. Available in Retro Black and White.",
    archiveCode: "AR001-GALAXY",
    stateNote: "pairs with the promo poster for 15% off",
    shopifyProductId: "gid://shopify/Product/9456112664832",
    shopifyHandle: "enzyme-washed-t-shirt",
    shopifyVariants: [],
  },
  {
    id: "p-002",
    slug: "ar-002-memory-card-tee",
    title: "AR-002 \"MEMORY CARD\" TEE",
    japaneseTitle: "メモリーカード Tシャツ",
    category: "tees",
    price: 52,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Slot Black", hex: "#050505" },
      { name: "Save Grey", hex: "#777d8b" },
    ],
    images: [
      assetById["ar-cutout-tee"].src,
      assetById["ar-cutout-member-card"].src,
      assetById["galaxy-poster-product-black"].src,
    ],
    badges: ["AR-002", "M-Card Rev E", "Archive sample"],
    availability: "archive",
    productState: "locked",
    description:
      "A reserved Memory Card tee study from the same capsule. Kept visible as an archive piece, not currently for sale.",
    archiveCode: "AR002-MCARD-REV-E",
    stateNote: "sample not released",
    shopifyVariants: [],
  },
  {
    id: "p-003",
    slug: "ar-003-corrupted-promo-poster",
    title: "AR-003 \"CORRUPTED PROMO\" POSTER",
    japaneseTitle: "破損プロモ ポスター",
    category: "accessories",
    price: 42,
    sizes: ["24 x 36"],
    colors: [
      { name: "Wrong Purple", hex: "#8B5CF6" },
    ],
    images: [
      assetById["action-replay-2026-promo-poster"].src,
      assetById["galaxy-poster-product-black"].src,
      assetById["galaxy-poster-light"].src,
      assetById["galaxy-poster-chrome"].src,
    ],
    badges: ["AR-003", "24 x 36", "Pair credit"],
    availability: "archive",
    productState: "live",
    description:
      "Oversized 24 x 36 promo poster printed from the darker Galaxy export: chrome panels, purple artifact, barcode residue.",
    archiveCode: "AR003-PRINT-WPURPLE",
    stateNote: "pairs with AR-001 for 15% off",
    shopifyProductId: "gid://shopify/Product/9456189145344",
    shopifyHandle: "action-replay-2026-promo-poster",
    shopifyVariants: [],
  },
];

export const collections: Collection[] = [
  {
    id: "tees",
    title: "Tees",
    label: "Tシャツ",
    href: "/shop?category=tees",
    image: assetById["galaxy-tee-editorial-blue"].src,
    accent: "#8B5CF6",
    summary: "The Galaxy tee is live in Retro Black and White.",
  },
  {
    id: "accessories",
    title: "Print Files",
    label: "ポスター",
    href: "/shop?category=accessories",
    image: assetById["action-replay-2026-promo-poster"].src,
    accent: "#D9E2F2",
    summary: "The oversized Galaxy promo poster is live now.",
  },
];

export const currentDrop: Drop = {
  id: "action-replay-001",
  title: "GALAXY DROP OPEN",
  launchDate: "2026-05-20T00:00:00-04:00",
  status: "live",
  heroAsset: assetById["galaxy-poster-product-black"].src,
  ctaLabel: "SHOP AR-001",
  ctaHref: "/shop/action-replay-galaxy-tee",
  copy: "AR-001 \"GALAXY\" and the AR-003 promo poster are live. Add both to the bag and the 15% pair credit applies automatically.",
};
export const archiveDrops: Drop[] = [
  currentDrop,
  {
    id: "spring26",
    title: "Spring Override",
    launchDate: "2026-04-26T00:00:00-04:00",
    status: "archived",
    heroAsset: assetById["city-blue-poster"].src,
    ctaLabel: "View Archive",
    ctaHref: "/archive",
    copy: "Chrome cartridge artifacts, blue city graphics, and barcode cards from the first replay capsule.",
  },
  {
    id: "green-boot",
    title: "Boot Screen",
    launchDate: "2026-03-14T00:00:00-04:00",
    status: "archived",
    heroAsset: assetById["green-poster"].src,
    ctaLabel: "View Archive",
    ctaHref: "/archive",
    copy: "Green boot screen energy with console lore, face overlays, and sticker tags.",
  },
];

export const timeline: TimelineItem[] = [
  {
    year: "2000",
    title: "Code Found",
    copy: "The streets learn the language: unlock, override, repeat.",
  },
  {
    year: "2004",
    title: "Replay Goes Live",
    copy: "Action Replay becomes a symbol, a shortcut, and a name passed around.",
  },
  {
    year: "2010",
    title: "New Game",
    copy: "The archive moves from cartridges to culture.",
  },
  {
    year: "2016",
    title: "Worldwide",
    copy: "The name moves through forums, drops, and late-night links.",
  },
  {
    year: "2020",
    title: "Next Gen",
    copy: "Same energy. Higher resolution. No pause screen.",
  },
  {
    year: "2026",
    title: "Replay Forever",
    copy: "The brand expands into apparel, objects, characters, and release rituals.",
  },
];

export const dropStats = [
  { label: "Drop", value: "AR001-GALAXY" },
  { label: "Status", value: "AVAILABLE" },
  { label: "Release", value: "LIMITED" },
  { label: "Checkout", value: "SECURE" },
];

export const locations = [
  { city: "Los Angeles", coordinates: "34.0522° N / 118.2437° W", status: "System unlocked" },
  { city: "New York", coordinates: "40.7128° N / 74.0060° W", status: "Archive active" },
  { city: "Tokyo", coordinates: "35.6762° N / 139.6503° E", status: "Galaxy active" },
  { city: "London", coordinates: "51.5072° N / 0.1276° W", status: "Replay ready" },
  { city: "Seoul", coordinates: "37.5665° N / 126.9780° E", status: "Live file active" },
  { city: "Paris", coordinates: "48.8566° N / 2.3522° E", status: "Pop-up watch" },
];
