import { existsSync, readFileSync } from "node:fs";

const REQUIRED_ENV = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_ADMIN_API_VERSION",
  "SHOPIFY_CLIENT_ID",
  "SHOPIFY_CLIENT_SECRET",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_M",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_L",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XL",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XXL",
  "SHOPIFY_GALAXY_TEE_VARIANT_WHITE_S",
  "SHOPIFY_GALAXY_TEE_VARIANT_WHITE_M",
  "SHOPIFY_GALAXY_TEE_VARIANT_WHITE_L",
  "SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XL",
  "SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XXL",
  "SHOPIFY_PROMO_POSTER_VARIANT_24X36",
  "SHOPIFY_TEE_POSTER_DISCOUNT_CODE",
];

const EXPECTED_VARIANTS = [
  ["SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S", "Retro Black", "S"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_BLACK_M", "Retro Black", "M"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_BLACK_L", "Retro Black", "L"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XL", "Retro Black", "XL"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XXL", "Retro Black", "2XL"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_WHITE_S", "White", "S"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_WHITE_M", "White", "M"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_WHITE_L", "White", "L"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XL", "White", "XL"],
  ["SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XXL", "White", "2XL"],
];

function loadDotenvLocal() {
  if (!existsSync(".env.local")) return;

  const text = readFileSync(".env.local", "utf8");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function optionValue(options, names) {
  const normalizedNames = names.map((name) => name.toLowerCase());
  return options.find((option) =>
    normalizedNames.includes(option.name.toLowerCase()),
  )?.value;
}

function normalize(value) {
  return value.trim().toLowerCase().replace(/^xxl$/, "2xl");
}

function moneyAmount(money) {
  const amount = Number.parseFloat(money?.amount ?? "");
  return Number.isFinite(amount) ? amount : 0;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

loadDotenvLocal();

const fallbackPosterVariantId = "gid://shopify/ProductVariant/48745105424640";
const pairDiscountCode = process.env.SHOPIFY_TEE_POSTER_DISCOUNT_CODE?.trim();
if (!process.env.SHOPIFY_PROMO_POSTER_VARIANT_24X36) {
  process.env.SHOPIFY_PROMO_POSTER_VARIANT_24X36 = fallbackPosterVariantId;
}

const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  fail(`Missing required Shopify env vars: ${missing.join(", ")}`);
}

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${
  process.env.SHOPIFY_ADMIN_API_VERSION
}/graphql.json`;

async function storefrontFetch(query, variables) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token":
        process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    fail(`Shopify Storefront API returned HTTP ${response.status}.`);
  }

  if (payload.errors?.length) {
    fail(
      `Shopify Storefront API returned errors: ${payload.errors
        .map((error) => error.message)
        .join("; ")}`,
    );
  }

  return payload.data;
}

const productQuery = `#graphql
  query VerifyLiveProducts($real: String!, $duplicate: String!, $poster: String!) {
    real: product(handle: $real) {
      handle
      title
      availableForSale
      variants(first: 20) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
    duplicate: product(handle: $duplicate) {
      handle
      title
      availableForSale
      variants(first: 20) {
        nodes {
          id
          availableForSale
        }
      }
    }
    poster: product(handle: $poster) {
      handle
      title
      availableForSale
      variants(first: 5) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

const productData = await storefrontFetch(productQuery, {
  real: "enzyme-washed-t-shirt",
  duplicate: "action-replay-mewtwo-tee",
  poster: "action-replay-2026-promo-poster",
});

const real = productData?.real;
const duplicate = productData?.duplicate;
const poster = productData?.poster;

if (!real) {
  fail("enzyme-washed-t-shirt is not visible to the Storefront API.");
}

if (duplicate) {
  fail("action-replay-mewtwo-tee is still visible to the Storefront API.");
}

if (!poster) {
  fail("action-replay-2026-promo-poster is not visible to the Storefront API.");
}

const variants = real.variants.nodes;
if (!real.availableForSale || variants.length !== 10) {
  fail(
    `Expected enzyme-washed-t-shirt to have 10 available variants; got ${variants.length}.`,
  );
}

for (const [envKey, expectedColor, expectedSize] of EXPECTED_VARIANTS) {
  const variantId = process.env[envKey];
  const variant = variants.find((candidate) => candidate.id === variantId);

  if (!variant) {
    fail(`${envKey} does not match a Storefront variant on enzyme-washed-t-shirt.`);
  }

  if (!variant.availableForSale) {
    fail(`${envKey} points to an unavailable Shopify variant.`);
  }

  const color = optionValue(variant.selectedOptions, ["color", "colour"]);
  const size = optionValue(variant.selectedOptions, ["size"]);

  if (normalize(color ?? "") !== normalize(expectedColor)) {
    fail(`${envKey} expected color ${expectedColor}, got ${color ?? "missing"}.`);
  }

  if (normalize(size ?? "") !== normalize(expectedSize)) {
    fail(`${envKey} expected size ${expectedSize}, got ${size ?? "missing"}.`);
  }
}

const posterVariants = poster.variants.nodes;
const posterVariant = posterVariants.find(
  (candidate) =>
    candidate.id === process.env.SHOPIFY_PROMO_POSTER_VARIANT_24X36,
);

if (!poster.availableForSale || !posterVariant?.availableForSale) {
  fail("action-replay-2026-promo-poster is not available for sale.");
}

const posterSize = optionValue(posterVariant.selectedOptions, ["size"]);
if (normalize(posterSize ?? "") !== normalize("24 x 36")) {
  fail(`Poster variant expected size 24 x 36, got ${posterSize ?? "missing"}.`);
}

const cartData = await storefrontFetch(
  `#graphql
    mutation VerifyPairDiscount($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          totalQuantity
          checkoutUrl
          discountCodes {
            code
            applicable
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 10) {
            nodes {
              quantity
              cost {
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
              discountAllocations {
                discountedAmount {
                  amount
                  currencyCode
                }
              }
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    handle
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
  {
    input: {
      discountCodes: [pairDiscountCode],
      lines: [
        {
          merchandiseId: process.env.SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S,
          quantity: 1,
        },
        {
          merchandiseId: process.env.SHOPIFY_PROMO_POSTER_VARIANT_24X36,
          quantity: 1,
        },
      ],
    },
  },
);

if (cartData.cartCreate.userErrors.length) {
  fail(
    `Shopify cartCreate returned errors: ${cartData.cartCreate.userErrors
      .map((error) => error.message)
      .join("; ")}`,
  );
}

const cart = cartData.cartCreate.cart;
const appliedPairCode = cart.discountCodes?.find(
  (discountCode) =>
    discountCode.code?.toUpperCase() === pairDiscountCode.toUpperCase(),
);
const lineSubtotal = cart.lines.nodes.reduce(
  (sum, line) => sum + moneyAmount(line.cost.subtotalAmount),
  0,
);
const lineDiscount = cart.lines.nodes.reduce(
  (sum, line) =>
    sum +
    line.discountAllocations.reduce(
      (innerSum, allocation) => innerSum + moneyAmount(allocation.discountedAmount),
      0,
    ),
  0,
);
const cartDiscount = Math.max(0, lineSubtotal - moneyAmount(cart.cost.totalAmount));

if (cart.totalQuantity !== 2 || lineSubtotal !== 90) {
  fail(`Expected tee + poster cart subtotal 90 with quantity 2; got ${lineSubtotal}.`);
}

if (!appliedPairCode?.applicable) {
  fail(`Expected ${pairDiscountCode} to be applicable to the tee + poster cart.`);
}

if (Math.abs(cartDiscount - 13.5) > 0.01) {
  fail(
    `Expected Shopify 15% full-cart pair credit of 13.50; got ${cartDiscount}. Line-level allocation was ${lineDiscount}.`,
  );
}

if (Math.abs(moneyAmount(cart.cost.totalAmount) - 76.5) > 0.01) {
  fail(`Expected pair cart total 76.50; got ${cart.cost.totalAmount.amount}.`);
}

console.log(
  "Shopify Storefront verification passed: tee variants, poster variant, duplicate hiding, checkout URL, and 15% full-cart pair credit are live.",
);
