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

function fail(message) {
  console.error(message);
  process.exit(1);
}

loadDotenvLocal();

const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  fail(`Missing required Shopify env vars: ${missing.join(", ")}`);
}

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${
  process.env.SHOPIFY_ADMIN_API_VERSION
}/graphql.json`;

const query = `#graphql
  query VerifyGalaxyTee($real: String!, $duplicate: String!) {
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
  }
`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token":
      process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN,
  },
  body: JSON.stringify({
    query,
    variables: {
      real: "enzyme-washed-t-shirt",
      duplicate: "action-replay-mewtwo-tee",
    },
  }),
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

const real = payload.data?.real;
const duplicate = payload.data?.duplicate;

if (!real) {
  fail("enzyme-washed-t-shirt is not visible to the Storefront API.");
}

if (duplicate) {
  fail("action-replay-mewtwo-tee is still visible to the Storefront API.");
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

console.log(
  "Shopify Storefront verification passed: enzyme-washed-t-shirt has 10 mapped variants and duplicate is hidden.",
);
