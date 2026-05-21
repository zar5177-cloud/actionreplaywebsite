import {
  GALAXY_TEE_SLUG,
  GALAXY_TEE_STOREFRONT_HANDLE,
} from "@/lib/shopify-galaxy-tee";

const CART_FRAGMENT = `#graphql
  fragment CartFields on Cart {
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
    lines(first: 50) {
      edges {
        node {
          id
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
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyUserError = {
  field: string[] | null;
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

type ShopifySelectedOption = {
  name: string;
  value: string;
};

type ShopifyProductVariantSummary = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
};

type ShopifyCartNode = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        cost: {
          subtotalAmount: ShopifyMoney;
          totalAmount: ShopifyMoney;
        };
        merchandise: {
          id: string;
          title: string;
          availableForSale: boolean;
          selectedOptions: ShopifySelectedOption[];
          image: {
            url: string;
            altText: string | null;
          } | null;
          price: ShopifyMoney;
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage: {
              url: string;
              altText: string | null;
            } | null;
          };
        };
      };
    }[];
  };
};

export type StorefrontCartLineInput = {
  merchandiseId: string;
  quantity: number;
};

export type StorefrontCartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  merchandiseTitle: string;
  availableForSale: boolean;
  productId: string;
  productTitle: string;
  productHandle: string;
  productSlug: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  imageUrl: string | null;
  imageAlt: string | null;
  price: ShopifyMoney;
  subtotal: ShopifyMoney;
};

export type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: ShopifyMoney;
  total: ShopifyMoney;
  lines: StorefrontCartLine[];
};

function getStorefrontConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION?.trim();
  const storefrontToken =
    process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN?.trim();

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN.");
  }

  if (!storefrontToken) {
    throw new Error("Missing SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN.");
  }

  if (!apiVersion) {
    throw new Error("Missing SHOPIFY_ADMIN_API_VERSION.");
  }

  return {
    endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
    storefrontToken,
  };
}

async function storefrontFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}) {
  const config = getStorefrontConfig();
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": config.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const payload = (await response.json()) as ShopifyResponse<T>;

  if (!response.ok) {
    throw new Error(
      `Shopify Storefront request failed with HTTP ${response.status}.`,
    );
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  if (!payload.data) {
    throw new Error("Shopify Storefront returned no data.");
  }

  return payload.data;
}

function normalizeOption(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeSize(value: string) {
  const normalized = normalizeOption(value);

  return normalized === "2xl" ? "xxl" : normalized;
}

function selectedOptionValue(
  options: ShopifySelectedOption[],
  names: string[],
) {
  const normalizedNames = names.map(normalizeOption);

  return (
    options.find((option) =>
      normalizedNames.includes(normalizeOption(option.name)),
    )?.value ?? ""
  );
}

function productSlugFromHandle(handle: string) {
  if (handle === GALAXY_TEE_STOREFRONT_HANDLE) {
    return GALAXY_TEE_SLUG;
  }

  return handle;
}

function mapCart(cart: ShopifyCartNode | null): StorefrontCart | null {
  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    total: cart.cost.totalAmount,
    lines: cart.lines.edges.map(({ node }) => {
      const merchandiseImage = node.merchandise.image;
      const productImage = node.merchandise.product.featuredImage;

      return {
        id: node.id,
        quantity: node.quantity,
        merchandiseId: node.merchandise.id,
        merchandiseTitle: node.merchandise.title,
        availableForSale: node.merchandise.availableForSale,
        productId: node.merchandise.product.id,
        productTitle: node.merchandise.product.title,
        productHandle: node.merchandise.product.handle,
        productSlug: productSlugFromHandle(node.merchandise.product.handle),
        selectedOptions: node.merchandise.selectedOptions,
        imageUrl: merchandiseImage?.url ?? productImage?.url ?? null,
        imageAlt: merchandiseImage?.altText ?? productImage?.altText ?? null,
        price: node.merchandise.price,
        subtotal: node.cost.subtotalAmount,
      };
    }),
  };
}

export async function getStorefrontProductVariantForOptions({
  color,
  expectedVariantId,
  handle,
  size,
}: {
  color: string;
  expectedVariantId?: string;
  handle: string;
  size: string;
}) {
  const data = await storefrontFetch<{
    product: {
      handle: string;
      title: string;
      variants: {
        nodes: ShopifyProductVariantSummary[];
      };
    } | null;
  }>({
    query: `#graphql
      query StorefrontProductVariantForOptions($handle: String!) {
        product(handle: $handle) {
          handle
          title
          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    `,
    variables: { handle },
  });

  if (!data.product) {
    throw new Error(`Shopify product handle ${handle} is not visible to Storefront.`);
  }

  const variant =
    (expectedVariantId
      ? data.product.variants.nodes.find(
          (candidate) => candidate.id === expectedVariantId,
        )
      : null) ??
    data.product.variants.nodes.find((candidate) => {
      const candidateColor = selectedOptionValue(candidate.selectedOptions, [
        "color",
        "colour",
      ]);
      const candidateSize = selectedOptionValue(candidate.selectedOptions, ["size"]);

      return (
        normalizeOption(candidateColor) === normalizeOption(color) &&
        normalizeSize(candidateSize) === normalizeSize(size)
      );
    });

  if (!variant) {
    throw new Error(
      `No ${data.product.handle} variant exists for ${color} / ${size}.`,
    );
  }

  if (expectedVariantId && variant.id !== expectedVariantId) {
    throw new Error(
      `Configured Galaxy Tee variant does not match ${data.product.handle} ${color} / ${size}.`,
    );
  }

  if (!variant.availableForSale) {
    throw new Error(`${data.product.handle} ${color} / ${size} is not available.`);
  }

  return variant;
}

function assertNoUserErrors(errors: ShopifyUserError[]) {
  if (errors.length) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }
}

export async function getStorefrontCart(cartId: string) {
  const data = await storefrontFetch<{
    cart: ShopifyCartNode | null;
  }>({
    query: `#graphql
      ${CART_FRAGMENT}
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
    `,
    variables: { cartId },
  });

  return mapCart(data.cart);
}

export async function createStorefrontCart(lines: StorefrontCartLineInput[]) {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyUserError[];
    };
  }>({
    query: `#graphql
      ${CART_FRAGMENT}
      mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      input: { lines },
    },
  });

  assertNoUserErrors(data.cartCreate.userErrors);

  const cart = mapCart(data.cartCreate.cart);
  if (!cart) {
    throw new Error("Shopify did not return a cart.");
  }

  return cart;
}

export async function addStorefrontCartLines({
  cartId,
  lines,
}: {
  cartId: string;
  lines: StorefrontCartLineInput[];
}) {
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyUserError[];
    };
  }>({
    query: `#graphql
      ${CART_FRAGMENT}
      mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { cartId, lines },
  });

  assertNoUserErrors(data.cartLinesAdd.userErrors);

  const cart = mapCart(data.cartLinesAdd.cart);
  if (!cart) {
    throw new Error("Shopify did not return an updated cart.");
  }

  return cart;
}

export async function updateStorefrontCartLines({
  cartId,
  lines,
}: {
  cartId: string;
  lines: {
    id: string;
    quantity: number;
  }[];
}) {
  const data = await storefrontFetch<{
    cartLinesUpdate: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyUserError[];
    };
  }>({
    query: `#graphql
      ${CART_FRAGMENT}
      mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { cartId, lines },
  });

  assertNoUserErrors(data.cartLinesUpdate.userErrors);

  const cart = mapCart(data.cartLinesUpdate.cart);
  if (!cart) {
    throw new Error("Shopify did not return an updated cart.");
  }

  return cart;
}

export async function removeStorefrontCartLines({
  cartId,
  lineIds,
}: {
  cartId: string;
  lineIds: string[];
}) {
  const data = await storefrontFetch<{
    cartLinesRemove: {
      cart: ShopifyCartNode | null;
      userErrors: ShopifyUserError[];
    };
  }>({
    query: `#graphql
      ${CART_FRAGMENT}
      mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: { cartId, lineIds },
  });

  assertNoUserErrors(data.cartLinesRemove.userErrors);

  const cart = mapCart(data.cartLinesRemove.cart);
  if (!cart) {
    throw new Error("Shopify did not return an updated cart.");
  }

  return cart;
}
