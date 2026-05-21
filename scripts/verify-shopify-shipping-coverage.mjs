import { existsSync, readFileSync } from "node:fs";

const STOREFRONT_API_VERSION = "2026-04";

const REQUIRED_ENV = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN",
  "SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S",
  "SHOPIFY_PROMO_POSTER_VARIANT_24X36",
  "SHOPIFY_TEE_POSTER_DISCOUNT_CODE",
];

const COUNTRIES = [
  {
    code: "US",
    name: "United States",
    province: "Massachusetts",
    address1: "10 Milk Street",
    city: "Boston",
    zip: "02108",
    phone: "6175550199",
  },
  {
    code: "CA",
    name: "Canada",
    province: "Ontario",
    address1: "220 Yonge Street",
    city: "Toronto",
    zip: "M5B 2H1",
    phone: "4165550199",
  },
  {
    code: "NL",
    name: "Netherlands",
    address1: "Dam 1",
    city: "Amsterdam",
    zip: "1012 JS",
    phone: "0612345678",
  },
  {
    code: "GB",
    name: "United Kingdom",
    address1: "10 Downing Street",
    city: "London",
    zip: "SW1A 2AA",
    phone: "07123456789",
  },
  {
    code: "AU",
    name: "Australia",
    province: "New South Wales",
    address1: "200 George Street",
    city: "Sydney",
    zip: "2000",
    phone: "0412345678",
  },
  {
    code: "IE",
    name: "Ireland",
    address1: "College Green",
    city: "Dublin 2",
    zip: "D02 PN40",
    phone: "0871234567",
  },
  {
    code: "HK",
    name: "Hong Kong",
    province: "Hong Kong Island",
    address1: "1 Harbour Road",
    city: "Wan Chai",
    zip: "",
    phone: "51234567",
  },
];

const CART_CREATE_WITH_DELIVERY = `#graphql
  mutation CartCreateWithDelivery($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
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
        discountCodes {
          code
          applicable
        }
        deliveryGroups(first: 10) {
          nodes {
            id
            deliveryOptions {
              handle
              title
              description
              estimatedCost {
                amount
                currencyCode
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
`;

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
    if (!process.env[key]) process.env[key] = value;
  }
}

function fail(message, details = {}) {
  console.error(JSON.stringify({ ready: false, error: message, ...details }, null, 2));
  process.exit(1);
}

function money(moneyV2) {
  return moneyV2 ? `${moneyV2.amount} ${moneyV2.currencyCode}` : null;
}

function buildDeliveryAddress(country) {
  const deliveryAddress = {
    firstName: "Test",
    lastName: "Buyer",
    address1: country.address1,
    city: country.city,
    country: country.name,
    zip: country.zip,
    phone: country.phone,
  };

  if (country.province) {
    deliveryAddress.province = country.province;
  }

  return deliveryAddress;
}

function buildCartCases() {
  const teeLine = {
    merchandiseId: process.env.SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S,
    quantity: 1,
  };
  const posterLine = {
    merchandiseId: process.env.SHOPIFY_PROMO_POSTER_VARIANT_24X36,
    quantity: 1,
  };

  return [
    { key: "tee", lines: [teeLine], discountCodes: [] },
    { key: "poster", lines: [posterLine], discountCodes: [] },
    {
      key: "tee+poster",
      lines: [teeLine, posterLine],
      discountCodes: [process.env.SHOPIFY_TEE_POSTER_DISCOUNT_CODE],
    },
  ];
}

async function storefrontGraphql(query, variables) {
  const response = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token":
          process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors) {
    return {
      ok: false,
      status: response.status,
      errors: payload.errors ?? payload,
    };
  }

  return { ok: true, payload };
}

async function verifyCase(country, cartCase) {
  const input = {
    lines: cartCase.lines,
    buyerIdentity: {
      countryCode: country.code,
      deliveryAddressPreferences: [
        { deliveryAddress: buildDeliveryAddress(country) },
      ],
    },
  };

  if (cartCase.discountCodes.length) {
    input.discountCodes = cartCase.discountCodes;
  }

  const result = await storefrontGraphql(CART_CREATE_WITH_DELIVERY, { input });
  if (!result.ok) {
    return {
      country: country.code,
      cart: cartCase.key,
      ready: false,
      error: result.errors,
    };
  }

  const cartCreate = result.payload.data?.cartCreate;
  if (cartCreate?.userErrors?.length) {
    return {
      country: country.code,
      cart: cartCase.key,
      ready: false,
      error: cartCreate.userErrors,
    };
  }

  const cart = cartCreate?.cart;
  const deliveryOptions =
    cart?.deliveryGroups?.nodes?.flatMap((group) => group.deliveryOptions) ?? [];
  const normalizedDeliveryOptions = deliveryOptions.map((option) => ({
    title: option.title,
    amount: money(option.estimatedCost),
  }));
  const pairDiscount =
    cartCase.key === "tee+poster"
      ? cart?.discountCodes?.some(
          (discountCode) =>
            discountCode.code?.toUpperCase() ===
              process.env.SHOPIFY_TEE_POSTER_DISCOUNT_CODE.toUpperCase() &&
            discountCode.applicable === true,
        ) === true
      : true;

  return {
    country: country.code,
    cart: cartCase.key,
    ready: deliveryOptions.length > 0 && pairDiscount,
    checkoutHost: cart?.checkoutUrl ? new URL(cart.checkoutUrl).host : null,
    totalQuantity: cart?.totalQuantity ?? null,
    subtotal: money(cart?.cost?.subtotalAmount),
    totalBeforeShipping: money(cart?.cost?.totalAmount),
    deliveryOptions: normalizedDeliveryOptions,
    discountCodes: cart?.discountCodes ?? [],
  };
}

loadDotenvLocal();

const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
if (missingEnv.length) {
  fail("Missing Shopify shipping verification env vars.", { missingEnv });
}

const cartCases = buildCartCases();
const results = [];

for (const country of COUNTRIES) {
  for (const cartCase of cartCases) {
    results.push(await verifyCase(country, cartCase));
  }
}

const failures = results.filter((result) => !result.ready);
const summary = {
  ready: failures.length === 0,
  checkedCountries: COUNTRIES.map((country) => country.code),
  checkedCarts: cartCases.map((cartCase) => cartCase.key),
  failures: failures.map((failure) => ({
    country: failure.country,
    cart: failure.cart,
    deliveryOptions: failure.deliveryOptions ?? [],
    error: failure.error ?? null,
    discountCodes: failure.discountCodes ?? [],
  })),
  results,
};

console.log(JSON.stringify(summary, null, 2));

if (failures.length) {
  process.exit(1);
}
