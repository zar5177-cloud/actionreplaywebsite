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

const TARGETS = ["production", "preview"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readDotenv(path) {
  if (!existsSync(path)) {
    fail(`Missing ${path}. Pull or create it before syncing Vercel env vars.`);
  }

  const values = new Map();
  const text = readFileSync(path, "utf8");

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    values.set(key, value);
  }

  return values;
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

async function vercelFetch({ method = "GET", path, token, teamId, body }) {
  const url = new URL(`https://api.vercel.com${path}`);
  url.searchParams.set("teamId", teamId);

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json();

  if (!response.ok) {
    fail(
      `Vercel API ${method} ${path} failed: ${
        payload.error?.message ?? response.statusText
      }`,
    );
  }

  return payload;
}

async function patchProject({ projectId, teamId, token }) {
  const project = await vercelFetch({
    method: "PATCH",
    path: `/v9/projects/${projectId}`,
    teamId,
    token,
    body: {
      framework: "nextjs",
      buildCommand: "npm run build",
      installCommand: "npm ci",
      outputDirectory: null,
      rootDirectory: null,
      nodeVersion: "22.x",
      gitForkProtection: true,
      publicSource: false,
    },
  });

  console.log(
    `Vercel project configured: ${project.name} (${project.nodeVersion}, ${project.installCommand}, ${project.buildCommand})`,
  );
}

async function upsertEnv({ projectId, teamId, token, key, value, target }) {
  const path = `/v10/projects/${projectId}/env?upsert=true`;
  const payload = await vercelFetch({
    method: "POST",
    path,
    teamId,
    token,
    body: {
      key,
      value,
      type: "sensitive",
      target: [target],
    },
  });

  if (payload.failed?.length) {
    fail(`Vercel env sync failed for ${key} (${target}).`);
  }

  console.log(`Vercel env synced: ${key} -> ${target}`);
}

async function reportGitLink({ projectId, teamId, token }) {
  const project = await vercelFetch({
    path: `/v9/projects/${projectId}`,
    teamId,
    token,
  });

  if (project.link || project.gitRepository) {
    console.log("Vercel Git integration is connected.");
    return;
  }

  console.log(
    [
      "Vercel Git integration is not connected yet.",
      "Open https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/git",
      "Connect GitHub repo zar5177-cloud/actionreplaywebsite, then create a PR preview.",
    ].join("\n"),
  );
}

const projectConfig = readJson(".vercel/project.json");
const env = readDotenv(".env.local");
const token = getVercelToken();

const missing = REQUIRED_ENV.filter((key) => !env.get(key));
if (missing.length) {
  fail(`Missing required .env.local values: ${missing.join(", ")}`);
}

await patchProject({
  projectId: projectConfig.projectId,
  teamId: projectConfig.orgId,
  token,
});

for (const target of TARGETS) {
  for (const key of REQUIRED_ENV) {
    await upsertEnv({
      projectId: projectConfig.projectId,
      teamId: projectConfig.orgId,
      token,
      key,
      value: env.get(key),
      target,
    });
  }
}

await reportGitLink({
  projectId: projectConfig.projectId,
  teamId: projectConfig.orgId,
  token,
});
