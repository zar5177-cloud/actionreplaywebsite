import { existsSync, readFileSync } from "node:fs";

const REQUIRED_ENV = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_CLIENT_ID",
  "SHOPIFY_CLIENT_SECRET",
];

const REQUIRED_SCOPES = [
  "read_products",
  "write_products",
  "read_inventory",
  "write_inventory",
  "read_orders",
  "write_orders",
  "read_draft_orders",
  "write_draft_orders",
  "read_customers",
  "read_discounts",
  "write_discounts",
  "read_publications",
  "write_publications",
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
    if (!process.env[key]) process.env[key] = value;
  }
}

function fail(message, details = {}) {
  console.error(JSON.stringify({ ready: false, error: message, ...details }, null, 2));
  process.exit(1);
}

loadDotenvLocal();

const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
if (missingEnv.length) {
  fail("Missing Shopify Admin OAuth env vars.", { missingEnv });
}

const tokenResponse = await fetch(
  `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_CLIENT_ID,
      client_secret: process.env.SHOPIFY_CLIENT_SECRET,
    }),
  },
);

const tokenPayload = await tokenResponse.json().catch(() => ({}));
if (!tokenResponse.ok || !tokenPayload.access_token) {
  fail("Shopify client-credentials token request failed.", {
    status: tokenResponse.status,
    shopifyError: tokenPayload.error_description ?? tokenPayload.error ?? null,
  });
}

const scopeResponse = await fetch(
  `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/oauth/access_scopes.json`,
  {
    headers: {
      "X-Shopify-Access-Token": tokenPayload.access_token,
    },
  },
);

const scopePayload = await scopeResponse.json().catch(() => ({}));
if (!scopeResponse.ok) {
  fail("Shopify access scope lookup failed.", {
    status: scopeResponse.status,
    shopifyError: scopePayload.errors ?? scopePayload.error ?? null,
  });
}

const grantedScopes = (scopePayload.access_scopes ?? [])
  .map((scope) => scope.handle)
  .filter(Boolean)
  .sort();
const missingScopes = REQUIRED_SCOPES.filter(
  (scope) => !grantedScopes.includes(scope),
);

const summary = {
  ready: missingScopes.length === 0,
  grantedScopes,
  missingScopes,
  next:
    missingScopes.length === 0
      ? "Admin API app has the required Action Replay operating scopes."
      : "Update the Shopify app scopes, reinstall or approve the updated app, then rerun npm run shopify:scopes.",
};

console.log(JSON.stringify(summary, null, 2));

if (missingScopes.length) process.exit(1);
