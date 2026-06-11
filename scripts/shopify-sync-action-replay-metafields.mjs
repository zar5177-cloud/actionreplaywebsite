import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const schema = JSON.parse(
  readFileSync(join(root, "src/lib/action-replay-metafields.json"), "utf8"),
);
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

const LIST_DEFINITIONS = `#graphql
  query ExistingActionReplayMetafieldDefinitions(
    $ownerType: MetafieldOwnerType!
    $namespace: String!
  ) {
    metafieldDefinitions(
      first: 50
      ownerType: $ownerType
      namespace: $namespace
    ) {
      nodes {
        id
        namespace
        key
        name
        description
        type {
          name
        }
        access {
          storefront
        }
        validations {
          name
          value
        }
      }
    }
  }
`;

const CREATE_DEFINITION = `#graphql
  mutation CreateActionReplayMetafieldDefinition(
    $definition: MetafieldDefinitionInput!
  ) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        key
        name
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const UPDATE_DEFINITION = `#graphql
  mutation UpdateActionReplayMetafieldDefinition(
    $definition: MetafieldDefinitionUpdateInput!
  ) {
    metafieldDefinitionUpdate(definition: $definition) {
      updatedDefinition {
        id
        key
        name
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

function loadDotenvLocal() {
  const dotenvPath = join(root, ".env.local");
  if (!existsSync(dotenvPath)) return;

  const text = readFileSync(dotenvPath, "utf8");
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

function requiredEnv(key) {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing ${key}.`);
  }

  return value;
}

async function getAdminAccessToken(domain) {
  const directToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (directToken) {
    return directToken;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SHOPIFY_ADMIN_ACCESS_TOKEN or Shopify client credentials.",
    );
  }

  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.access_token) {
    throw new Error(
      `Shopify client-credentials token request failed with HTTP ${response.status}.`,
    );
  }

  return payload.access_token;
}

function definitionInput(field, includeType = true) {
  const input = {
    namespace: schema.namespace,
    key: field.key,
    ownerType: schema.ownerType,
    name: field.name,
    description: field.description,
    access: {
      storefront: schema.access.storefront,
    },
    pin: field.pin,
    validations: field.validations ?? [],
  };

  if (includeType) {
    input.type = field.type;
  }

  return input;
}

async function adminFetch({ endpoint, token, query, variables }) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Shopify Admin API returned HTTP ${response.status}.`);
  }

  if (payload.errors?.length) {
    throw new Error(
      payload.errors.map((error) => error.message).join("; "),
    );
  }

  return payload.data;
}

function formatUserErrors(userErrors) {
  return userErrors
    .map((error) => {
      const path = error.field?.length ? ` (${error.field.join(".")})` : "";
      return `${error.message}${path}`;
    })
    .join("; ");
}

function printPlan() {
  console.log(
    `Action Replay metafield plan: ${schema.ownerType} / ${schema.namespace}`,
  );

  for (const field of schema.fields) {
    console.log(
      [
        `- ${field.key}`,
        field.type,
        `storefront=${schema.access.storefront}`,
        field.validations?.length
          ? `validations=${field.validations.map((item) => item.name).join(",")}`
          : "validations=none",
      ].join(" | "),
    );
  }
}

async function main() {
  loadDotenvLocal();
  printPlan();

  if (dryRun) {
    console.log("Dry run only. No Shopify definitions were created or updated.");
    return;
  }

  const domain = requiredEnv("SHOPIFY_STORE_DOMAIN");
  const apiVersion = requiredEnv("SHOPIFY_ADMIN_API_VERSION");
  const token = await getAdminAccessToken(domain);
  const endpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  const existingData = await adminFetch({
    endpoint,
    token,
    query: LIST_DEFINITIONS,
    variables: {
      ownerType: schema.ownerType,
      namespace: schema.namespace,
    },
  });
  const existingDefinitions = new Map(
    existingData.metafieldDefinitions.nodes.map((definition) => [
      definition.key,
      definition,
    ]),
  );

  for (const field of schema.fields) {
    const existing = existingDefinitions.get(field.key);
    const isUpdate = Boolean(existing);
    const data = await adminFetch({
      endpoint,
      token,
      query: isUpdate ? UPDATE_DEFINITION : CREATE_DEFINITION,
      variables: {
        definition: definitionInput(field, !isUpdate),
      },
    });
    const result = isUpdate
      ? data.metafieldDefinitionUpdate
      : data.metafieldDefinitionCreate;
    const definition = isUpdate
      ? result.updatedDefinition
      : result.createdDefinition;

    if (result.userErrors.length) {
      throw new Error(`${field.key}: ${formatUserErrors(result.userErrors)}`);
    }

    console.log(
      `${isUpdate ? "updated" : "created"} ${definition.key} (${definition.id})`,
    );
  }

  console.log("Action Replay metafield definitions are synced.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
