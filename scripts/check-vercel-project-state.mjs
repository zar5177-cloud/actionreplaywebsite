import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

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

const REQUIRED_TARGETS = ["production", "preview"];
const REQUIRED_DOMAINS = [
  "shopactionreplay.com",
  "www.shopactionreplay.com",
  "actionreplaywebsite.vercel.app",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function getVercelToken() {
  if (process.env.VERCEL_TOKEN) {
    return process.env.VERCEL_TOKEN;
  }

  const candidates = [
    join(homedir(), "Library/Application Support/com.vercel.cli/auth.json"),
    join(homedir(), ".vercel/auth.json"),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const token = readJson(path).token;
    if (token) return token;
  }

  fail("Missing Vercel auth. Run `vercel login` or set VERCEL_TOKEN.");
}

async function vercelFetch({ path, token, teamId }) {
  const url = new URL(`https://api.vercel.com${path}`);
  url.searchParams.set("teamId", teamId);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    fail(
      `Vercel API GET ${path} failed: ${
        payload.error?.message ?? response.statusText
      }`,
    );
  }

  return payload;
}

function targetHasRequiredEnv(env, key, target) {
  return env.some(
    (entry) => entry.key === key && Array.isArray(entry.target) && entry.target.includes(target),
  );
}

function addIf(condition, errors, message) {
  if (!condition) errors.push(message);
}

const projectConfig = readJson(".vercel/project.json");
const token = getVercelToken();

const [project, domainResponse] = await Promise.all([
  vercelFetch({
    path: `/v9/projects/${projectConfig.projectId}`,
    teamId: projectConfig.orgId,
    token,
  }),
  vercelFetch({
    path: `/v10/projects/${projectConfig.projectId}/domains`,
    teamId: projectConfig.orgId,
    token,
  }),
]);

const domains = domainResponse.domains ?? [];
const errors = [];
const warnings = [];

addIf(project.framework === "nextjs", errors, "Vercel framework is not Next.js.");
addIf(
  project.buildCommand === "npm run build",
  errors,
  "Vercel build command is not `npm run build`.",
);
addIf(
  project.installCommand === "npm ci",
  errors,
  "Vercel install command is not `npm ci`.",
);
addIf(project.nodeVersion === "22.x", errors, "Vercel Node.js version is not 22.x.");
addIf(
  project.outputDirectory === null,
  errors,
  "Vercel output directory should be the Next.js default.",
);
if (!project.link && !project.gitRepository) {
  warnings.push(
    "Vercel Git Integration is not connected; GitHub Actions Vercel CLI deploys are the release path.",
  );
}

for (const target of REQUIRED_TARGETS) {
  for (const key of REQUIRED_ENV) {
    addIf(
      targetHasRequiredEnv(project.env ?? [], key, target),
      errors,
      `Missing Vercel ${target} env var: ${key}.`,
    );
  }
}

for (const name of REQUIRED_DOMAINS) {
  const domain = domains.find((entry) => entry.name === name);
  addIf(Boolean(domain), errors, `Missing Vercel project domain: ${name}.`);
  addIf(
    !domain || domain.verified === true,
    errors,
    `Vercel project domain is not verified: ${name}.`,
  );
}

const summary = {
  ready: errors.length === 0,
  project: {
    name: project.name,
    framework: project.framework,
    buildCommand: project.buildCommand,
    installCommand: project.installCommand,
    nodeVersion: project.nodeVersion,
    outputDirectory: project.outputDirectory,
    gitConnected: Boolean(project.link || project.gitRepository),
    envCount: project.env?.length ?? 0,
  },
  domains: domains.map((domain) => ({
    name: domain.name,
    verified: domain.verified,
    redirect: domain.redirect ?? null,
  })),
  errors,
  warnings,
};

console.log(JSON.stringify(summary, null, 2));

if (errors.length) {
  process.exit(1);
}
