import type { ProductColor, ProductVariant } from "@/lib/brand-data";

export const PROMO_POSTER_SLUG = "ar-003-corrupted-promo-poster";
export const PROMO_POSTER_STOREFRONT_HANDLE = "action-replay-2026-promo-poster";
export const PROMO_POSTER_SHOPIFY_PRODUCT_ID =
  "gid://shopify/Product/9456189145344";
export const PROMO_POSTER_VARIANT_ENV_KEY =
  "SHOPIFY_PROMO_POSTER_VARIANT_24X36";
export const PROMO_POSTER_SIZE = "24 x 36";
export const PROMO_POSTER_COLOR: ProductColor = {
  name: "Wrong Purple",
  hex: "#8B5CF6",
};

const FALLBACK_PROMO_POSTER_VARIANT_ID =
  "gid://shopify/ProductVariant/48745105424640";

export function getPromoPosterVariantId() {
  return (
    process.env[PROMO_POSTER_VARIANT_ENV_KEY]?.trim() ??
    FALLBACK_PROMO_POSTER_VARIANT_ID
  );
}

export function getPromoPosterShopifyVariants({
  includeIds = false,
}: {
  includeIds?: boolean;
} = {}): ProductVariant[] {
  const id = getPromoPosterVariantId();

  if (!id && includeIds) {
    return [];
  }

  return [
    {
      id: includeIds && id ? id : `server-resolved:POSTER:${PROMO_POSTER_SIZE}`,
      title: PROMO_POSTER_SIZE,
      availableForSale: true,
      size: PROMO_POSTER_SIZE,
      color: PROMO_POSTER_COLOR.name,
      selectedOptions: [{ name: "Size", value: PROMO_POSTER_SIZE }],
    },
  ];
}

export function getPromoPosterColors() {
  return [PROMO_POSTER_COLOR];
}

export function isPromoPosterSlug(slug: string) {
  return slug === PROMO_POSTER_SLUG;
}
