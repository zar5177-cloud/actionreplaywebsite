import { resolve4, resolveCname } from "node:dns/promises";
import { setTimeout as sleep } from "node:timers/promises";

const APEX = "shopactionreplay.com";
const WWW = "www.shopactionreplay.com";
const VERCEL_A_RECORD = "76.76.21.21";
const SHOP_PATH = `https://${APEX}/shop`;
const WATCH = process.argv.includes("--watch");
const INTERVAL_MS = Number(process.env.DOMAIN_CHECK_INTERVAL_MS ?? 30_000);
const TIMEOUT_MS = Number(process.env.DOMAIN_CHECK_TIMEOUT_MS ?? 30 * 60_000);

function unique(values) {
  return Array.from(new Set(values)).sort();
}

async function getARecords(hostname) {
  try {
    return unique(await resolve4(hostname));
  } catch {
    return [];
  }
}

async function getCnameRecords(hostname) {
  try {
    return unique(await resolveCname(hostname));
  } catch {
    return [];
  }
}

function hasOnlyVercelA(records) {
  return records.length === 1 && records[0] === VERCEL_A_RECORD;
}

async function fetchShopSignal() {
  try {
    const response = await fetch(SHOP_PATH, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/json",
      },
    });
    const text = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      title: text.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] ?? "",
      hasStorefront:
        text.includes("SHOPIFY LIVE") &&
        text.includes("crt-overlay") &&
        text.includes("AR-001"),
      hasNetlifyUsageExceeded: text.includes("usage_exceeded"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      title: "",
      hasStorefront: false,
      hasNetlifyUsageExceeded: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkOnce() {
  const [apexA, apexCname, wwwA, wwwCname, shop] = await Promise.all([
    getARecords(APEX),
    getCnameRecords(APEX),
    getARecords(WWW),
    getCnameRecords(WWW),
    fetchShopSignal(),
  ]);

  const apexReady = hasOnlyVercelA(apexA);
  const wwwReady = hasOnlyVercelA(wwwA);
  const siteReady = shop.ok && shop.hasStorefront;
  const ready = apexReady && wwwReady && siteReady;

  console.log(
    JSON.stringify(
      {
        ready,
        expected: {
          apexA: VERCEL_A_RECORD,
          wwwA: VERCEL_A_RECORD,
        },
        actual: {
          apexA,
          apexCname,
          wwwA,
          wwwCname,
          shop,
        },
      },
      null,
      2,
    ),
  );

  if (!ready) {
    console.log(
      [
        "",
        "IONOS DNS still needs these live records:",
        `A     @      ${VERCEL_A_RECORD}`,
        `A     www    ${VERCEL_A_RECORD}`,
        "",
        "Remove or replace the Netlify records:",
        "A     @      75.2.60.5",
        "CNAME www    shopactionreplay.netlify.app",
      ].join("\n"),
    );
  }

  return ready;
}

if (!WATCH) {
  const ready = await checkOnce();
  process.exit(ready ? 0 : 1);
}

const startedAt = Date.now();

while (Date.now() - startedAt < TIMEOUT_MS) {
  const ready = await checkOnce();
  if (ready) {
    process.exit(0);
  }

  console.log(
    `Waiting ${Math.round(INTERVAL_MS / 1000)}s for DNS propagation...\n`,
  );
  await sleep(INTERVAL_MS);
}

console.error("Timed out waiting for shopactionreplay.com DNS cutover.");
process.exit(1);
