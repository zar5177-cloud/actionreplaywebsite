import { expect, type Page, test } from "@playwright/test";

function collectConsoleProblems(page: Page) {
  const problems: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      problems.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    problems.push(error.message);
  });

  return problems;
}

async function expectNoConsoleProblems(problems: string[]) {
  expect(problems.filter(Boolean)).toEqual([]);
}

test.describe("Action Replay storefront release gate", () => {
  test("shop page keeps the full storefront shell", async ({ page }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop");

    await expect(page).toHaveTitle(/Shop.*Action Replay/);
    await expect(page.locator(".crt-overlay")).toHaveCount(1);
    await expect(page.getByText("SHOPIFY LIVE")).toBeVisible();
    await expect(page.getByRole("button", { name: "Open cart" })).toBeVisible();
    await expect(page.getByText(/AR-001/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Retro Black" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "White" }).first()).toBeVisible();
    await expect(page.getByText(/AR-003 "CORRUPTED PROMO" POSTER/i).first()).toBeVisible();
    await expect(page.getByText("PRINT FILE NOT VERIFIED").first()).toBeVisible();

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("bare Next.js scaffold");

    await expectNoConsoleProblems(consoleProblems);
  });

  test("Galaxy Tee page exposes both colorways and all sizes", async ({ page }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/action-replay-galaxy-tee");

    await expect(page.getByRole("heading", { name: /AR-001 "GALAXY" TEE/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retro Black" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "White" }).first()).toBeVisible();

    for (const size of ["S", "M", "L", "XL", "XXL"]) {
      await expect(page.getByRole("button", { name: size }).first()).toBeVisible();
    }

    await expect(page.getByRole("button", { name: /RESTORE COPY|Add to Cart/i }).first()).toBeEnabled();
    await expectNoConsoleProblems(consoleProblems);
  });

  test("duplicate Galaxy Tee URL cannot become a separate live product", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/action-replay-mewtwo-tee");

    await expect(page).toHaveURL(/\/shop\/action-replay-galaxy-tee$/);
    await expect(page.getByRole("heading", { name: /AR-001 "GALAXY" TEE/i })).toBeVisible();
    await expectNoConsoleProblems(consoleProblems);
  });

  test("corrupted promo poster is visible but not purchasable", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/ar-003-corrupted-promo-poster");

    await expect(
      page.getByRole("heading", { name: /AR-003 "CORRUPTED PROMO" POSTER/i }),
    ).toBeVisible();
    await expect(page.getByText("PRINT FILE NOT VERIFIED").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /PRINT FILE NOT VERIFIED/i }).first(),
    ).toBeDisabled();
    await expectNoConsoleProblems(consoleProblems);
  });

  test("cart API creates a Shopify cart with native checkout URL", async ({
    request,
  }) => {
    const response = await request.post("/api/shopify/cart", {
      data: {
        action: "add",
        productSlug: "action-replay-galaxy-tee",
        size: "S",
        color: "Retro Black",
        quantity: 1,
      },
    });

    expect(response.status()).toBe(200);

    const payload = (await response.json()) as {
      cart?: {
        checkoutUrl?: string;
        lines?: {
          productSlug: string;
          selectedOptions: { name: string; value: string }[];
        }[];
      };
      error?: string;
    };

    expect(payload.error).toBeUndefined();
    expect(payload.cart?.checkoutUrl).toBeTruthy();
    expect(new URL(payload.cart?.checkoutUrl ?? "").host).toBe(
      "store.shopactionreplay.com",
    );
    expect(payload.cart?.lines?.[0]?.productSlug).toBe(
      "action-replay-galaxy-tee",
    );
  });

  test("cart drawer opens after adding Galaxy Tee", async ({ page }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/action-replay-galaxy-tee");
    await page.getByRole("button", { name: /RESTORE COPY|Add to Cart/i }).first().click();

    const drawer = page.locator("aside").first();
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByRole("button", { name: /OPEN CHECKOUT MIRROR|Checkout/i }),
    ).toBeVisible();
    await expect(page.getByText(/AR-001|GALAXY/i).first()).toBeVisible();
    await expectNoConsoleProblems(consoleProblems);
  });
});
