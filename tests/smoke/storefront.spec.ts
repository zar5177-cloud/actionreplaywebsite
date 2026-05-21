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
    await expect(page.getByText("PAIR CREDIT").first()).toBeVisible();

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

  test("corrupted promo poster is visible and purchasable", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/ar-003-corrupted-promo-poster");

    await expect(
      page.getByRole("heading", { name: /AR-003 "CORRUPTED PROMO" POSTER/i }),
    ).toBeVisible();
    await expect(page.getByText("PAIR CREDIT").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /RESTORE COPY|Add to Cart/i }).first(),
    ).toBeEnabled();
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

  test("cart API accepts tee plus poster and receives Shopify 15 percent pair credit", async ({
    request,
  }) => {
    const teeResponse = await request.post("/api/shopify/cart", {
      data: {
        action: "add",
        productSlug: "action-replay-galaxy-tee",
        size: "S",
        color: "Retro Black",
        quantity: 1,
      },
    });

    expect(teeResponse.status()).toBe(200);
    const teePayload = (await teeResponse.json()) as {
      cart?: {
        id: string;
      };
      error?: string;
    };
    expect(teePayload.error).toBeUndefined();
    expect(teePayload.cart?.id).toBeTruthy();

    const posterResponse = await request.post("/api/shopify/cart", {
      data: {
        action: "add",
        cartId: teePayload.cart?.id,
        productSlug: "ar-003-corrupted-promo-poster",
        size: "24 x 36",
        color: "Wrong Purple",
        quantity: 1,
      },
    });

    expect(posterResponse.status()).toBe(200);

    const posterPayload = (await posterResponse.json()) as {
      cart?: {
        checkoutUrl?: string;
        totalQuantity?: number;
        undiscountedSubtotal?: { amount: string };
        discountTotal?: { amount: string };
        total?: { amount: string };
        lines?: {
          productSlug: string;
        }[];
      };
      error?: string;
    };

    expect(posterPayload.error).toBeUndefined();
    expect(new URL(posterPayload.cart?.checkoutUrl ?? "").host).toBe(
      "store.shopactionreplay.com",
    );
    expect(posterPayload.cart?.totalQuantity).toBe(2);
    expect(posterPayload.cart?.lines?.map((line) => line.productSlug).sort()).toEqual([
      "action-replay-galaxy-tee",
      "ar-003-corrupted-promo-poster",
    ]);
    expect(Number(posterPayload.cart?.undiscountedSubtotal?.amount)).toBe(90);
    expect(Number(posterPayload.cart?.discountTotal?.amount)).toBeCloseTo(7.2, 2);
    expect(Number(posterPayload.cart?.total?.amount)).toBeCloseTo(82.8, 2);
  });

  test("cart API restores tee plus poster in one server-side mutation", async ({
    request,
  }) => {
    const response = await request.post("/api/shopify/cart", {
      data: {
        action: "addPair",
        size: "M",
        color: "White",
        quantity: 1,
      },
    });

    expect(response.status()).toBe(200);

    const payload = (await response.json()) as {
      cart?: {
        checkoutUrl?: string;
        totalQuantity?: number;
        undiscountedSubtotal?: { amount: string };
        discountTotal?: { amount: string };
        total?: { amount: string };
        lines?: {
          productSlug: string;
        }[];
      };
      error?: string;
    };

    expect(payload.error).toBeUndefined();
    expect(new URL(payload.cart?.checkoutUrl ?? "").host).toBe(
      "store.shopactionreplay.com",
    );
    expect(payload.cart?.totalQuantity).toBe(2);
    expect(payload.cart?.lines?.map((line) => line.productSlug).sort()).toEqual([
      "action-replay-galaxy-tee",
      "ar-003-corrupted-promo-poster",
    ]);
    expect(Number(payload.cart?.undiscountedSubtotal?.amount)).toBe(90);
    expect(Number(payload.cart?.discountTotal?.amount)).toBeCloseTo(7.2, 2);
    expect(Number(payload.cart?.total?.amount)).toBeCloseTo(82.8, 2);
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

  test("cart drawer shows Shopify pair credit after adding poster and tee", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/ar-003-corrupted-promo-poster");
    await page.getByRole("button", { name: /RESTORE COPY|Add to Cart/i }).first().click();
    await page.getByRole("button", { name: "Close cart", exact: true }).click();
    await page.goto("/shop/action-replay-galaxy-tee");
    await page.getByRole("button", { name: /RESTORE COPY|Add to Cart/i }).first().click();

    const drawer = page.locator("aside").first();
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Pair credit / 15%")).toBeVisible();
    await expect(drawer.getByText("-$7.20").last()).toBeVisible();
    await expect(drawer.getByText("$82.80")).toBeVisible();
    await expectNoConsoleProblems(consoleProblems);
  });

  test("one-click pair restore adds selected tee and poster to the drawer", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.goto("/shop/action-replay-galaxy-tee");
    await page.getByRole("button", { name: "White" }).first().click();
    await page
      .getByRole("button", { name: /RESTORE TEE \+ POSTER \/ 15%/i })
      .click();

    const drawer = page.locator("aside").first();
    await expect(drawer).toBeVisible();
    await expect(
      drawer.locator("p").filter({ hasText: /AR-001.*GALAXY.*TEE/i }).first(),
    ).toBeVisible();
    await expect(
      drawer
        .locator("p")
        .filter({ hasText: /Action Replay 2026 Promo Poster|AR-003.*PROMO.*POSTER/i })
        .first(),
    ).toBeVisible();
    await expect(drawer.getByText("Pair credit / 15%")).toBeVisible();
    await expect(drawer.getByText("-$7.20").last()).toBeVisible();
    await expect(drawer.getByText("$82.80")).toBeVisible();
    await expectNoConsoleProblems(consoleProblems);
  });

  test("mobile one-click pair restore keeps checkout usable", async ({
    page,
  }) => {
    const consoleProblems = collectConsoleProblems(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/shop/action-replay-galaxy-tee");
    await page.getByRole("button", { name: "XL" }).first().click();
    await page.getByRole("button", { name: "White" }).first().click();
    await page
      .getByRole("button", { name: /RESTORE TEE \+ POSTER \/ 15%/i })
      .click();

    const drawer = page.locator("aside").first();
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveCSS("width", "390px");
    await expect(drawer.getByText("Pair credit / 15%")).toBeVisible();
    await expect(drawer.getByText("-$7.20").last()).toBeVisible();
    await expect(drawer.getByText("$82.80")).toBeVisible();
    await expect(
      drawer.getByRole("button", { name: /OPEN CHECKOUT MIRROR/i }),
    ).toBeVisible();
    await expect(
      drawer.getByRole("button", { name: /OPEN CHECKOUT MIRROR/i }),
    ).toBeEnabled();
    await expectNoConsoleProblems(consoleProblems);
  });
});
