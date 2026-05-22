import { NextResponse } from "next/server";
import {
  addStorefrontCartLines,
  createStorefrontCart,
  getStorefrontProductVariantById,
  getStorefrontProductVariantForOptions,
  getStorefrontCart,
  removeStorefrontCartLines,
  updateStorefrontCartDiscountCodes,
  updateStorefrontCartLines,
  type StorefrontCart,
} from "@/lib/shopify-storefront";
import {
  GALAXY_TEE_SLUG,
  GALAXY_TEE_STOREFRONT_HANDLE,
  getGalaxyTeeVariantId,
  isGalaxyTeeSlug,
} from "@/lib/shopify-galaxy-tee";
import {
  PROMO_POSTER_SLUG,
  PROMO_POSTER_STOREFRONT_HANDLE,
  getPromoPosterVariantId,
  isPromoPosterSlug,
} from "@/lib/shopify-poster";

export const dynamic = "force-dynamic";

type AddCartRequest = {
  action: "add";
  cartId?: unknown;
  productSlug?: unknown;
  size?: unknown;
  color?: unknown;
  quantity?: unknown;
};

type AddPairCartRequest = {
  action: "addPair";
  cartId?: unknown;
  size?: unknown;
  color?: unknown;
  quantity?: unknown;
};

type UpdateCartRequest = {
  action: "update";
  cartId?: unknown;
  lineId?: unknown;
  quantity?: unknown;
};

type RemoveCartRequest = {
  action: "remove";
  cartId?: unknown;
  lineId?: unknown;
};

type CartRequestBody =
  | AddCartRequest
  | AddPairCartRequest
  | UpdateCartRequest
  | RemoveCartRequest;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function quantityValue(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function configuredPairDiscountCode() {
  return process.env.SHOPIFY_TEE_POSTER_DISCOUNT_CODE?.trim() ?? "";
}

function cartHasPair(cart: StorefrontCart) {
  const slugs = new Set(
    cart.lines.filter((line) => line.quantity > 0).map((line) => line.productSlug),
  );

  return slugs.has(GALAXY_TEE_SLUG) && slugs.has(PROMO_POSTER_SLUG);
}

async function syncPairDiscountCode(cart: StorefrontCart) {
  const code = configuredPairDiscountCode();

  if (!code) {
    return cart;
  }

  const normalizedCode = code.toUpperCase();
  const preservedCodes = cart.discountCodes
    .map((discountCode) => discountCode.code)
    .filter((discountCode) => discountCode.toUpperCase() !== normalizedCode);
  const nextCodes = cartHasPair(cart) ? [...preservedCodes, code] : preservedCodes;
  const currentCodes = cart.discountCodes.map((discountCode) =>
    discountCode.code.toUpperCase(),
  );
  const nextCodeSet = nextCodes.map((discountCode) => discountCode.toUpperCase());

  if (
    currentCodes.length === nextCodeSet.length &&
    currentCodes.every((currentCode, index) => currentCode === nextCodeSet[index])
  ) {
    return cart;
  }

  return updateStorefrontCartDiscountCodes({
    cartId: cart.id,
    discountCodes: nextCodes,
  });
}

async function resolveMerchandiseId(body: AddCartRequest) {
  const productSlug = stringValue(body.productSlug);
  const size = stringValue(body.size);
  const color = stringValue(body.color);

  if (isGalaxyTeeSlug(productSlug)) {
    const expectedVariantId = getGalaxyTeeVariantId({ color, size });
    const variant = await getStorefrontProductVariantForOptions({
      color,
      expectedVariantId,
      handle: GALAXY_TEE_STOREFRONT_HANDLE,
      size,
    });

    return variant.id;
  }

  if (isPromoPosterSlug(productSlug)) {
    const expectedVariantId = getPromoPosterVariantId();
    const variant = await getStorefrontProductVariantById({
      expectedVariantId,
      handle: PROMO_POSTER_STOREFRONT_HANDLE,
    });

    return variant.id;
  }

  throw new Error(
    `This item is not available to purchase. The live shop currently accepts ${GALAXY_TEE_SLUG} and ${PROMO_POSTER_SLUG}.`,
  );
}

async function resolvePairLines(body: AddPairCartRequest) {
  const quantity = quantityValue(body.quantity);
  const teeVariantId = await resolveMerchandiseId({
    action: "add",
    productSlug: GALAXY_TEE_SLUG,
    size: body.size,
    color: body.color,
    quantity,
  });
  const posterVariantId = await resolveMerchandiseId({
    action: "add",
    productSlug: PROMO_POSTER_SLUG,
    size: "24 x 36",
    color: "Wrong Purple",
    quantity,
  });

  return [
    {
      merchandiseId: teeVariantId,
      quantity,
    },
    {
      merchandiseId: posterVariantId,
      quantity,
    },
  ];
}

export async function GET(request: Request) {
  const cartId = new URL(request.url).searchParams.get("cartId")?.trim();

  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const cart = await getStorefrontCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to load Shopify cart.",
      502,
    );
  }
}

export async function POST(request: Request) {
  let body: CartRequestBody;

  try {
    body = (await request.json()) as CartRequestBody;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  try {
    if (body.action === "add") {
      const cartId = stringValue(body.cartId);
      const merchandiseId = await resolveMerchandiseId(body);
      const line = {
        merchandiseId,
        quantity: quantityValue(body.quantity),
      };
      const cart = cartId
        ? await addStorefrontCartLines({ cartId, lines: [line] })
        : await createStorefrontCart([line]);

      return NextResponse.json({ cart: await syncPairDiscountCode(cart) });
    }

    if (body.action === "addPair") {
      const cartId = stringValue(body.cartId);
      const lines = await resolvePairLines(body);
      const cart = cartId
        ? await addStorefrontCartLines({ cartId, lines })
        : await createStorefrontCart(lines);

      return NextResponse.json({ cart: await syncPairDiscountCode(cart) });
    }

    if (body.action === "update") {
      const cartId = stringValue(body.cartId);
      const lineId = stringValue(body.lineId);

      if (!cartId || !lineId) {
        return jsonError("cartId and lineId are required.", 400);
      }

      const cart = await updateStorefrontCartLines({
        cartId,
        lines: [{ id: lineId, quantity: quantityValue(body.quantity) }],
      });

      return NextResponse.json({ cart: await syncPairDiscountCode(cart) });
    }

    if (body.action === "remove") {
      const cartId = stringValue(body.cartId);
      const lineId = stringValue(body.lineId);

      if (!cartId || !lineId) {
        return jsonError("cartId and lineId are required.", 400);
      }

      const cart = await removeStorefrontCartLines({
        cartId,
        lineIds: [lineId],
      });

      return NextResponse.json({ cart: await syncPairDiscountCode(cart) });
    }

    return jsonError("Unsupported cart action.", 400);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update Shopify cart.";

    if (message.startsWith("This item is not available to purchase.")) {
      return jsonError(message, 400);
    }

    return jsonError(
      message,
      502,
    );
  }
}
