import type { ProductColor, ProductVariant } from "@/lib/brand-data";

export const GALAXY_TEE_SLUG = "action-replay-galaxy-tee";
export const GALAXY_TEE_STOREFRONT_HANDLE = "orbit-logo-washed-tee";
export const IGNORED_GALAXY_TEE_HANDLE = "action-replay-mewtwo-tee";

export const GALAXY_TEE_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export const GALAXY_TEE_COLORWAYS = [
  {
    name: "Retro Black",
    hex: "#050505",
    envToken: "BLACK",
    aliases: ["black", "retro black", "retro-black"],
  },
  {
    name: "White",
    hex: "#f6f4ef",
    envToken: "WHITE",
    aliases: ["white"],
  },
] as const;

type GalaxyTeeSize = (typeof GALAXY_TEE_SIZES)[number];
type GalaxyTeeColor = (typeof GALAXY_TEE_COLORWAYS)[number];

export const GALAXY_TEE_SHOPIFY_PRODUCT_ID =
  "gid://shopify/Product/9455777906944";

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSize(size: string): GalaxyTeeSize {
  const normalized = normalizeOption(size).toUpperCase();

  if (normalized === "2XL") {
    return "XXL";
  }

  if (GALAXY_TEE_SIZES.includes(normalized as GalaxyTeeSize)) {
    return normalized as GalaxyTeeSize;
  }

  throw new Error(`Unsupported Galaxy Tee size: ${size}`);
}

function normalizeColor(color: string): GalaxyTeeColor {
  const normalized = normalizeOption(color).replace("-", " ");
  const colorway = GALAXY_TEE_COLORWAYS.find((candidate) =>
    candidate.aliases.some((alias) => normalizeOption(alias) === normalized),
  );

  if (!colorway) {
    throw new Error(`Unsupported Galaxy Tee colorway: ${color}`);
  }

  return colorway;
}

function variantEnvKey(color: GalaxyTeeColor, size: GalaxyTeeSize) {
  return `SHOPIFY_GALAXY_TEE_VARIANT_${color.envToken}_${size}`;
}

export function getGalaxyTeeColors(): ProductColor[] {
  return GALAXY_TEE_COLORWAYS.map((colorway) => ({
    name: colorway.name,
    hex: colorway.hex,
  }));
}

export function getGalaxyTeeVariantId({
  color,
  size,
}: {
  color: string;
  size: string;
}) {
  const normalizedColor = normalizeColor(color);
  const normalizedSize = normalizeSize(size);
  const envKey = variantEnvKey(normalizedColor, normalizedSize);
  const variantId = process.env[envKey]?.trim();

  if (!variantId) {
    throw new Error(`Missing ${envKey} in server environment.`);
  }

  return variantId;
}

export function getGalaxyTeeShopifyVariants({
  includeIds = false,
}: {
  includeIds?: boolean;
} = {}): ProductVariant[] {
  return GALAXY_TEE_COLORWAYS.flatMap((colorway) =>
    GALAXY_TEE_SIZES.flatMap((size) => {
      const id = process.env[variantEnvKey(colorway, size)]?.trim();

      if (!id && includeIds) {
        return [];
      }

      return {
        id: includeIds && id ? id : `server-resolved:${colorway.envToken}:${size}`,
        title: `${colorway.name} / ${size}`,
        availableForSale: true,
        size,
        color: colorway.name,
        selectedOptions: [
          { name: "Color", value: colorway.name },
          { name: "Size", value: size },
        ],
      };
    }),
  );
}

export function isGalaxyTeeSlug(slug: string) {
  return slug === GALAXY_TEE_SLUG;
}
