type ShopifyGraphQLError = {
  message: string;
};

type CustomerUserError = {
  code: string | null;
  field: string[] | null;
  message: string;
};

type ShopifyResponse<T> = {
  data?: T;
  errors?: ShopifyGraphQLError[];
};

type CustomerCreateData = {
  customerCreate: {
    customer: {
      id: string;
      email: string;
      acceptsMarketing: boolean;
    } | null;
    customerUserErrors: CustomerUserError[];
  };
};

export type NewsletterSubscribeResult = {
  acceptsMarketing?: boolean;
  customerId?: string;
  duplicate: boolean;
  provider: "shopify";
};

const DUPLICATE_SUCCESS_CODES = new Set(["CUSTOMER_DISABLED", "TAKEN"]);

export function newsletterDiscountCode() {
  return process.env.NEWSLETTER_DISCOUNT_CODE?.trim() || "REPLAY10";
}

function getStorefrontNewsletterConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const apiVersion =
    process.env.SHOPIFY_NEWSLETTER_STOREFRONT_API_VERSION?.trim() || "2024-01";
  const privateToken =
    process.env.SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN?.trim();

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN.");
  }

  if (!privateToken) {
    throw new Error("Missing SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN.");
  }

  return {
    endpoint: `https://${domain}/api/${apiVersion}/graphql.json`,
    token: privateToken,
  };
}

function randomPassword() {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `AR-${uuid.replaceAll("-", "").slice(0, 24)}!10`;
}

function isDuplicateSuccess(errors: CustomerUserError[]) {
  return errors.some((error) => {
    const code = error.code?.toUpperCase() ?? "";
    const message = error.message.toLowerCase();

    return (
      DUPLICATE_SUCCESS_CODES.has(code) ||
      message.includes("already") ||
      message.includes("taken") ||
      message.includes("disabled")
    );
  });
}

export async function subscribeEmailToShopifyMarketing(email: string) {
  const config = getStorefrontNewsletterConfig();
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": config.token,
    },
    body: JSON.stringify({
      query: `#graphql
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              id
              email
              acceptsMarketing
            }
            customerUserErrors {
              code
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          acceptsMarketing: true,
          email,
          password: randomPassword(),
        },
      },
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as ShopifyResponse<CustomerCreateData>;

  if (!response.ok) {
    throw new Error(`Shopify Storefront request failed with HTTP ${response.status}.`);
  }

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  const result = payload.data?.customerCreate;
  if (!result) {
    throw new Error("Shopify Storefront returned no customerCreate payload.");
  }

  if (result.customerUserErrors.length) {
    if (isDuplicateSuccess(result.customerUserErrors)) {
      return {
        duplicate: true,
        provider: "shopify",
      } satisfies NewsletterSubscribeResult;
    }

    throw new Error(
      result.customerUserErrors.map((error) => error.message).join("; "),
    );
  }

  return {
    acceptsMarketing: result.customer?.acceptsMarketing,
    customerId: result.customer?.id,
    duplicate: false,
    provider: "shopify",
  } satisfies NewsletterSubscribeResult;
}
