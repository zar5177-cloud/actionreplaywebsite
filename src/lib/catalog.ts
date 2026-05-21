import {
  publicProductSlugs,
  visibleProductSlugs,
  products as localProducts,
} from "@/lib/brand-data";
import {
  getShopifyProductByHandle,
  getShopifyProducts,
} from "@/lib/shopify";
import {
  GALAXY_TEE_SIZES,
  GALAXY_TEE_SLUG,
  GALAXY_TEE_STOREFRONT_HANDLE,
  getGalaxyTeeColors,
  getGalaxyTeeShopifyVariants,
} from "@/lib/shopify-galaxy-tee";
import type { Product } from "@/lib/brand-data";

function withEnvShopifyVariants(product: Product) {
  if (product.slug !== GALAXY_TEE_SLUG) {
    return product;
  }

  const variants = getGalaxyTeeShopifyVariants();

  if (!variants.length) {
    return {
      ...product,
      sizes: [...GALAXY_TEE_SIZES],
      colors: getGalaxyTeeColors(),
    };
  }

  return {
    ...product,
    source: "shopify" as const,
    sizes: [...GALAXY_TEE_SIZES],
    colors: getGalaxyTeeColors(),
    shopifyProductId: product.shopifyProductId,
    shopifyHandle: GALAXY_TEE_STOREFRONT_HANDLE,
    shopifyVariants: variants,
  };
}

function withLocalPresentation(product: Product) {
  const localProduct = localProducts.find(
    (candidate) => candidate.slug === product.slug,
  );

  if (!localProduct) {
    return product;
  }

  return {
    ...product,
    title: localProduct.title,
    japaneseTitle: localProduct.japaneseTitle,
    category: localProduct.category,
    price: localProduct.price,
    sizes: localProduct.sizes,
    colors: localProduct.colors,
    images: localProduct.images,
    badges: localProduct.badges,
    availability:
      product.source === "shopify" ? product.availability : localProduct.availability,
    productState:
      product.source === "shopify" ? product.productState : localProduct.productState,
    description: localProduct.description,
    archiveCode: localProduct.archiveCode,
    stateNote: localProduct.stateNote,
    shopifyProductId: product.shopifyProductId ?? localProduct.shopifyProductId,
    shopifyHandle: localProduct.shopifyHandle ?? product.shopifyHandle,
    shopifyVariants:
      product.shopifyVariants?.length
        ? product.shopifyVariants
        : localProduct.shopifyVariants,
  };
}

export async function getCatalogProducts({
  includeHidden = false,
}: {
  includeHidden?: boolean;
} = {}) {
  const shopifyProducts = await getShopifyProducts();

  const productsBySlug = new Map(
    localProducts.map((product) => [
      product.slug,
      withEnvShopifyVariants(product),
    ]),
  );

  shopifyProducts.forEach((product) => {
    productsBySlug.set(
      product.slug,
      withEnvShopifyVariants(withLocalPresentation(product)),
    );
  });

  const slugs = includeHidden ? publicProductSlugs : visibleProductSlugs;

  return slugs
    .map((slug) => productsBySlug.get(slug))
    .filter((product): product is (typeof localProducts)[number] =>
      Boolean(product),
    );
}

export async function getCatalogProduct(slug: string) {
  const shopifyProduct = await getShopifyProductByHandle(slug);

  if (shopifyProduct) {
    return withEnvShopifyVariants(withLocalPresentation(shopifyProduct));
  }

  const localProduct = localProducts.find((product) => product.slug === slug);

  return localProduct ? withEnvShopifyVariants(localProduct) : null;
}
