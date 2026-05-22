import { Resolver, resolve4, resolveCname } from "node:dns/promises";
import { request } from "node:https";
import { setTimeout as sleep } from "node:timers/promises";

const APEX = "shopactionreplay.com";
const WWW = "www.shopactionreplay.com";
const VERCEL_A_RECORD = "76.76.21.21";
const SHOP_PATH = `https://${APEX}/shop`;
const WATCH = process.argv.includes("--watch");
const INTERVAL_MS = Number(process.env.DOMAIN_CHECK_INTERVAL_MS ?? 30_000);
const TIMEOUT_MS = Number(process.env.DOMAIN_CHECK_TIMEOUT_MS ?? 30 * 60_000);
const DNS_RESOLVERS = [
  { name: "cloudflare", servers: ["1.1.1.1"] },
  { name: "google", servers: ["8.8.8.8"] },
  { name: "quad9", servers: ["9.9.9.9"] },
];

function unique(values) {
  return Array.from(new Set(values)).sort();
}

async function getARecords(hostname, resolver = { resolve4 }) {
  try {
    return unique(await resolver.resolve4(hostname));
  } catch {
    return [];
  }
}

async function getCnameRecords(hostname, resolver = { resolveCname }) {
  try {
    return unique(await resolver.resolveCname(hostname));
  } catch {
    return [];
  }
}

function hasOnlyVercelA(records) {
  return records.length === 1 && records[0] === VERCEL_A_RECORD;
}

function createResolver(servers) {
  const resolver = new Resolver();
  resolver.setServers(servers);
  return resolver;
}

async function checkDnsResolver({ name, servers }) {
  const resolver = createResolver(servers);
  const [apexA, apexCname, wwwA, wwwCname] = await Promise.all([
    getARecords(APEX, resolver),
    getCnameRecords(APEX, resolver),
    getARecords(WWW, resolver),
    getCnameRecords(WWW, resolver),
  ]);

  return {
    name,
    servers,
    apexA,
    apexCname,
    wwwA,
    wwwCname,
    ready: hasOnlyVercelA(apexA) && hasOnlyVercelA(wwwA),
  };
}

async function checkSystemDns() {
  const [apexA, apexCname, wwwA, wwwCname] = await Promise.all([
    getARecords(APEX),
    getCnameRecords(APEX),
    getARecords(WWW),
    getCnameRecords(WWW),
  ]);

  return {
    apexA,
    apexCname,
    wwwA,
    wwwCname,
    ready: hasOnlyVercelA(apexA) && hasOnlyVercelA(wwwA),
  };
}

function httpsGetViaVercel(url) {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/json",
        },
        lookup(_hostname, options, callback) {
          if (options?.all) {
            callback(null, [{ address: VERCEL_A_RECORD, family: 4 }]);
            return;
          }

          callback(null, VERCEL_A_RECORD, 4);
        },
        timeout: 15_000,
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          resolve({
            ok: response.statusCode >= 200 && response.statusCode < 300,
            status: response.statusCode,
            headers: response.headers,
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("Timed out waiting for Vercel HTTPS.")));
    req.end();
  });
}

async function fetchShopSignal() {
  try {
    const response = await httpsGetViaVercel(SHOP_PATH);
    const text = response.text;
    const server = String(response.headers.server ?? "");

    return {
      ok: response.ok,
      status: response.status,
      server,
      hasVercelHeader: server.toLowerCase().includes("vercel") || Boolean(response.headers["x-vercel-id"]),
      title: text.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] ?? "",
      hasStorefront:
        text.includes("Secure checkout / worldwide shipping") &&
        text.includes("Galaxy drop") &&
        text.includes("crt-overlay") &&
        text.includes("AR-001") &&
        text.includes("AR-003"),
      hasNetlifyUsageExceeded: text.includes("usage_exceeded"),
      forcedIp: VERCEL_A_RECORD,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      server: "",
      hasVercelHeader: false,
      title: "",
      hasStorefront: false,
      hasNetlifyUsageExceeded: false,
      forcedIp: VERCEL_A_RECORD,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function checkOnce() {
  const [resolverResults, systemDns, shop] = await Promise.all([
    Promise.all(DNS_RESOLVERS.map(checkDnsResolver)),
    checkSystemDns(),
    fetchShopSignal(),
  ]);

  const apexA = unique(resolverResults.flatMap((result) => result.apexA));
  const apexCname = unique(resolverResults.flatMap((result) => result.apexCname));
  const wwwA = unique(resolverResults.flatMap((result) => result.wwwA));
  const wwwCname = unique(resolverResults.flatMap((result) => result.wwwCname));
  const apexReady = resolverResults.every((result) => hasOnlyVercelA(result.apexA));
  const wwwReady = resolverResults.every((result) => hasOnlyVercelA(result.wwwA));
  const siteReady = shop.ok && shop.hasStorefront && shop.hasVercelHeader;
  const ready = apexReady && wwwReady && siteReady;
  const systemResolverStale = ready && !systemDns.ready;

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
          resolverResults,
          systemDns,
          systemResolverStale,
          shop,
        },
      },
      null,
      2,
    ),
  );

  if (!ready) {
    const dnsReady = apexReady && wwwReady;
    const lines = [""];

    if (!dnsReady) {
      lines.push(
        "IONOS DNS still needs these live records:",
        `A     @      ${VERCEL_A_RECORD}`,
        `A     www    ${VERCEL_A_RECORD}`,
        "",
        "Remove or replace the Netlify records:",
        "A     @      75.2.60.5",
        "CNAME www    shopactionreplay.netlify.app",
      );
    } else {
      lines.push(
        "External DNS is correct, but Vercel HTTPS is not serving the expected storefront yet.",
        "Re-run Vercel domain verification and certificate issuance, then check again.",
      );
    }

    console.log(lines.join("\n"));
  } else if (systemResolverStale) {
    console.log(
      [
        "",
        "Live domain is ready on external DNS and Vercel HTTPS.",
        "The local system resolver is still stale, but this no longer blocks production readiness.",
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
