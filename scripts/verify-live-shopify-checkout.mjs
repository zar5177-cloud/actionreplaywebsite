import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const baseUrl = process.env.CHECKOUT_BASE_URL ?? "https://shopactionreplay.com";
const screenshotPath =
  process.env.CHECKOUT_SCREENSHOT_PATH ??
  "test-results/live-shopify-checkout-pair.png";

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function postCart(data) {
  const response = await fetch(`${baseUrl}/api/shopify/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const payload = await response.json();

  if (!response.ok || payload.error || !payload.cart) {
    fail(
      `Cart API failed with HTTP ${response.status}: ${
        payload.error ?? JSON.stringify(payload)
      }`,
    );
  }

  return payload.cart;
}

function moneyAmount(money) {
  const parsed = Number.parseFloat(money?.amount ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

const teeCart = await postCart({
  action: "add",
  productSlug: "action-replay-galaxy-tee",
  size: "S",
  color: "Retro Black",
  quantity: 1,
});

const pairCart = await postCart({
  action: "add",
  cartId: teeCart.id,
  productSlug: "ar-003-corrupted-promo-poster",
  size: "24 x 36",
  color: "Wrong Purple",
  quantity: 1,
});

const lineSlugs = pairCart.lines
  .map((line) => line.productSlug)
  .sort()
  .join(",");

if (pairCart.totalQuantity !== 2) {
  fail(`Expected Shopify cart quantity 2, got ${pairCart.totalQuantity}.`);
}

if (
  lineSlugs !==
  "action-replay-galaxy-tee,ar-003-corrupted-promo-poster"
) {
  fail(`Expected tee + poster line slugs, got ${lineSlugs}.`);
}

if (moneyAmount(pairCart.undiscountedSubtotal) !== 90) {
  fail(`Expected pair subtotal 90.00, got ${pairCart.undiscountedSubtotal?.amount}.`);
}

if (Math.abs(moneyAmount(pairCart.discountTotal) - 7.2) > 0.01) {
  fail(`Expected pair credit 7.20, got ${pairCart.discountTotal?.amount}.`);
}

if (Math.abs(moneyAmount(pairCart.total) - 82.8) > 0.01) {
  fail(`Expected pair total 82.80, got ${pairCart.total?.amount}.`);
}

const checkoutUrl = new URL(pairCart.checkoutUrl);
if (checkoutUrl.host !== "store.shopactionreplay.com") {
  fail(`Expected Shopify checkout host store.shopactionreplay.com, got ${checkoutUrl.host}.`);
}

mkdirSync("test-results", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(pairCart.checkoutUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.waitForTimeout(5_000);

  const title = await page.title();
  const bodyText = (await page.locator("body").innerText({ timeout: 15_000 }))
    .replace(/\s+/g, " ")
    .trim();
  const markers = [
    [/GALAXY|AR-001|Tee|TEE/i, "Galaxy tee"],
    [/Poster|POSTER|Promo|PROMO/i, "promo poster"],
    [/7\.20|\$7\.20/, "$7.20 pair credit"],
    [/82\.80|\$82\.80/, "$82.80 total"],
    [/Contact|Email|Delivery|Shipping|Pay now|Continue/i, "checkout form"],
  ];
  const missing = markers
    .filter(([pattern]) => !pattern.test(bodyText))
    .map(([, label]) => label);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (!/Checkout - Action Replay/i.test(title)) {
    fail(`Expected Shopify checkout title, got ${title}.`);
  }

  if (missing.length) {
    fail(`Shopify checkout is missing: ${missing.join(", ")}.`);
  }

  console.log(
    JSON.stringify(
      {
        ready: true,
        baseUrl,
        checkoutUrl: page.url(),
        totalQuantity: pairCart.totalQuantity,
        subtotal: pairCart.undiscountedSubtotal,
        discountTotal: pairCart.discountTotal,
        total: pairCart.total,
        screenshotPath,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
