import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceDirs = ["src"];
const staticDirs = [".next/static"];

const sourceBlocks = [
  {
    pattern: /NEXT_PUBLIC_SHOPIFY_/,
    reason: "Shopify storefront/admin env vars must not be public client env vars.",
  },
  {
    pattern: /X-Shopify-Storefront-Access-Token/,
    reason: "Server-side Storefront calls must use Shopify-Storefront-Private-Token.",
  },
  {
    pattern: /shopifyDirectCheckoutUrl/,
    reason: "Checkout handoff must come from Shopify cart checkoutUrl, not client-built cart URLs.",
  },
  {
    pattern: /gid:\/\/shopify\/ProductVariant\/487449\d+/,
    reason: "Galaxy Tee cart variant IDs must come from environment variables.",
  },
];

const bundleSecretBlocks = [
  /shpss_[A-Za-z0-9]+/,
  /shpat_[A-Za-z0-9]+/,
  /shpca_[A-Za-z0-9]+/,
  /SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN/,
  /SHOPIFY_ADMIN_ACCESS_TOKEN/,
  /SHOPIFY_CLIENT_SECRET/,
];

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }

    files.push(path);
  }

  return files;
}

const failures = [];

for (const dir of sourceDirs) {
  for (const file of walk(join(root, dir))) {
    if (!/\.(ts|tsx|js|jsx|mjs|css)$/.test(file)) continue;

    const text = readFileSync(file, "utf8");
    for (const block of sourceBlocks) {
      if (block.pattern.test(text)) {
        failures.push(`${relative(root, file)}: ${block.reason}`);
      }
    }
  }
}

for (const dir of staticDirs) {
  for (const file of walk(join(root, dir))) {
    const text = readFileSync(file, "utf8");
    for (const pattern of bundleSecretBlocks) {
      if (pattern.test(text)) {
        failures.push(`${relative(root, file)}: client artifact contains a Shopify secret marker.`);
      }
    }
  }
}

if (failures.length) {
  console.error("Shopify env safety check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Shopify env safety check passed.");
