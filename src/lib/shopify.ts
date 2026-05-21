import type { Product, ProductVariant } from "@/lib/brand-data";
import {
  GALAXY_TEE_SHOPIFY_PRODUCT_ID,
  GALAXY_TEE_SLUG,
  GALAXY_TEE_STOREFRONT_HANDLE,
  IGNORED_GALAXY_TEE_HANDLE,
} from "@/lib/shopify-galaxy-tee";

const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    productType
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: {
          name: string;
          value: string;
        }[];
        price: ShopifyMoney;
      };
    }[];
  };
};

export type ShopifyCartLineInput = {
  merchandiseId: string;
  quantity: number;
};

type LiveProductKind = "galaxy-tee";

const LIVE_PRODUCT_SLUGS: Record<LiveProductKind, string> = {
  "galaxy-tee": GALAXY_TEE_SLUG,
};

const LIVE_PRODUCT_IDS: Record<LiveProductKind, string> = {
  "galaxy-tee": GALAXY_TEE_SHOPIFY_PRODUCT_ID,
};

const FALLBACK_PRODUCT_IMAGES: Record<LiveProductKind, string[]> = {
  "galaxy-tee": [
    "/assets/generated/current-drop/galaxy-tee-editorial-blue.jpg",
  ],
};

function liveProductKind(node: ShopifyProductNode): LiveProductKind | null {
  if (node.handle === GALAXY_TEE_STOREFRONT_HANDLE) {
    return "galaxy-tee";
  }

  if (node.handle === IGNORED_GALAXY_TEE_HANDLE) {
    return null;
  }

  if (node.id === LIVE_PRODUCT_IDS["galaxy-tee"]) {
    return "galaxy-tee";
  }

  const tags = node.tags.map((tag) => tag.toLowerCase());
  const text = `${node.handle} ${node.title} ${node.productType} ${tags.join(" ")}`.toLowerCase();

  if (text.includes("orbit")) {
    return null;
  }

  const isGalaxyTee =
    (tags.includes("galaxy-logo") ||
      tags.includes("galaxy") ||
      text.includes("galaxy")) &&
    (tags.includes("tee") || tags.includes("shirt") || text.includes("t-shirt"));

  if (isGalaxyTee) {
    return node.handle === GALAXY_TEE_STOREFRONT_HANDLE
      ? "galaxy-tee"
      : null;
  }

  return null;
}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const storefrontToken =
    process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN?.trim();
  const apiVersion =
    process.env.SHOPIFY_ADMIN_API_VERSION?.trim() ||
    process.env.SHOPIFY_API_VERSION?.trim() ||
    "2026-04";

  if (!domain || !storefrontToken) {
    return null;
  }

  return {
    apiVersion,
    domain,
    endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
    storefrontToken,
  };
}

export function hasShopifyStorefrontConfig() {
  return Boolean(getShopifyConfig());
}

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}) {
  const config = getShopifyConfig();

  if (!config) {
    return null;
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": config.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60, tags: ["shopify"] },
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with HTTP ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data ?? null;
}

function optionValue(
  options: ProductVariant["selectedOptions"],
  names: string[],
) {
  const normalizedNames = names.map((name) => name.toLowerCase());
  return options.find((option) =>
    normalizedNames.includes(option.name.toLowerCase()),
  )?.value;
}

function uniqueValues(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

function colorHex(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("black")) return "#050505";
  if (normalized.includes("white")) return "#f4f4f0";
  if (normalized.includes("gray") || normalized.includes("grey")) return "#737780";
  if (normalized.includes("brown")) return "#5a4030";
  if (normalized.includes("blue")) return "#496378";
  if (normalized.includes("green")) return "#56624c";
  if (normalized.includes("red")) return "#ad4a4a";
  if (normalized.includes("pink")) return "#bc6d7a";
  if (normalized.includes("cream") || normalized.includes("beige")) return "#eee2c6";
  if (normalized.includes("khaki")) return "#8b816f";

  return "#777777";
}

function productBadges(node: ShopifyProductNode, category: Product["category"]) {
  const badges = node.tags
    .map((tag) => {
      const normalized = tag.toLowerCase();
      const dropMatch = normalized.match(/^drop-(\d+)$/);
      if (dropMatch) return `DROP ${dropMatch[1].padStart(3, "0")}`;
      if (normalized === "galaxy" || normalized === "galaxy-logo") return "GALAXY";
      if (normalized === "legendary") return "LEGENDARY";
      if (normalized === "poster" || normalized === "posters") return "POSTER";
      if (normalized === "heavyweight-cotton") return "HEAVYWEIGHT";
      if (normalized === "contrast-stitch") return "CONTRAST";
      return "";
    })
    .filter(Boolean);

  if (node.availableForSale) {
    badges.unshift("LIVE");
  }

  if (category === "tees" && !badges.includes("250 GSM")) {
    badges.push("250 GSM");
  }

  return Array.from(new Set(badges)).slice(0, 4);
}

function productDescription(
  liveKind: LiveProductKind,
  title: string,
  description: string,
) {
  if (liveKind === "galaxy-tee") {
    return "Recovered product access mirror for the AR-001 Galaxy tee. Black and white copies are both mapped to the live Shopify variant table.";
  }

  const cleaned = description
    .replace(/gid:\/\/shopify\/Product\/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const stopWords = [" Size Chart ", " Care ", " Fabric ", " Details "];
  const stopIndex = stopWords.reduce((current, marker) => {
    const index = cleaned.indexOf(marker);
    if (index === -1) return current;
    return current === -1 ? index : Math.min(current, index);
  }, -1);
  const summary = stopIndex === -1 ? cleaned : cleaned.slice(0, stopIndex);

  return (
    summary ||
    `${title} from the current Action Replay drop, loaded from Shopify.`
  );
}

function normalizedLiveTitle() {
  return "AR-001 \"GALAXY\" TEE";
}

function normalizedJapaneseTitle() {
  return "ギャラクシー Tシャツ";
}

function mapShopifyProduct(node: ShopifyProductNode): Product | null {
  const liveKind = liveProductKind(node);

  if (!liveKind) {
    return null;
  }

  const title = normalizedLiveTitle();
  const category = "tees";
  const variants = node.variants.edges.map(({ node: variant }) => {
    const size = optionValue(variant.selectedOptions, ["size"]);
    const color = optionValue(variant.selectedOptions, ["color", "colour"]);

    return {
      id: variant.id,
      title: variant.title,
      availableForSale: variant.availableForSale,
      size,
      color,
      selectedOptions: variant.selectedOptions,
    };
  });
  const sizes = uniqueValues(variants.map((variant) => variant.size));
  const colors = uniqueValues(variants.map((variant) => variant.color)).map(
    (name) => ({
      name,
      hex: colorHex(name),
    }),
  );
  const images = node.images.edges.map(({ node: image }) => image.url);

  return {
    id: node.id,
    slug: LIVE_PRODUCT_SLUGS[liveKind],
    title,
    japaneseTitle: normalizedJapaneseTitle(),
    category,
    price: 48,
    sizes: sizes.length ? sizes : ["S", "M", "L", "XL", "XXL"],
    colors: colors.length
      ? colors
      : [{ name: "White", hex: "#f4f4f0" }],
    images: images.length ? images : FALLBACK_PRODUCT_IMAGES[liveKind],
    badges: productBadges(node, category),
    availability: node.availableForSale ? "new" : "archive",
    productState: node.availableForSale ? "live" : "sold_out",
    description: productDescription(liveKind, title, node.description),
    archiveCode: "AR001-GALAXY",
    stateNote: "loaded from Shopify collection mirror",
    source: "shopify",
    shopifyProductId: node.id,
    shopifyHandle: node.handle,
    shopifyVariants: variants,
  };
}

export async function getShopifyProducts() {
  try {
    const data = await shopifyFetch<{
      products: {
        edges: {
          node: ShopifyProductNode;
        }[];
      };
    }>({
      query: `#graphql
        ${PRODUCT_FRAGMENT}
        query ShopifyProducts {
          products(first: 50, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      `,
    });

    return (
      data?.products.edges
        .map(({ node }) => mapShopifyProduct(node))
        .filter((product): product is Product => Boolean(product)) ?? []
    );
  } catch (error) {
    console.warn(
      "[shopify] Falling back to local catalog:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return [];
  }
}

export async function getShopifyProductByHandle(handle: string) {
  if (handle === IGNORED_GALAXY_TEE_HANDLE) {
    return null;
  }

  if (handle.toLowerCase().includes("orbit")) {
    return null;
  }

  try {
    const lookupHandle =
      handle === GALAXY_TEE_SLUG ? GALAXY_TEE_STOREFRONT_HANDLE : handle;
    const products = await getShopifyProducts();
    const liveProduct = products.find(
      (product) =>
        product.slug === handle || product.shopifyHandle === lookupHandle,
    );

    if (liveProduct) {
      return liveProduct;
    }

    const data = await shopifyFetch<{
      product: ShopifyProductNode | null;
    }>({
      query: `#graphql
        ${PRODUCT_FRAGMENT}
        query ShopifyProductByHandle($handle: String!) {
          product(handle: $handle) {
            ...ProductFields
          }
        }
      `,
      variables: { handle: lookupHandle },
    });

    return data?.product ? mapShopifyProduct(data.product) : null;
  } catch (error) {
    console.warn(
      "[shopify] Product lookup failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
}

export async function createShopifyCart(
  lines: ShopifyCartLineInput[],
  discountCodes: string[] = [],
) {
  const input: {
    lines: ShopifyCartLineInput[];
    discountCodes?: string[];
  } = {
    lines: lines.map((line) => ({
      merchandiseId: line.merchandiseId,
      quantity: line.quantity,
    })),
  };

  if (discountCodes.length) {
    input.discountCodes = discountCodes;
  }

  const data = await shopifyFetch<{
    cartCreate: {
      cart: {
        checkoutUrl: string;
      } | null;
      userErrors: {
        field: string[] | null;
        message: string;
      }[];
    };
  }>({
    query: `#graphql
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input,
    },
  });

  const errors = data?.cartCreate.userErrors ?? [];
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }

  const checkoutUrl = data?.cartCreate.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Shopify did not return a checkout URL.");
  }

  return checkoutUrl;
}
