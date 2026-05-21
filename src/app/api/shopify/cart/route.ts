import { NextResponse } from "next/server";
import {
  addStorefrontCartLines,
  createStorefrontCart,
  getStorefrontProductVariantForOptions,
  getStorefrontCart,
  removeStorefrontCartLines,
  updateStorefrontCartLines,
} from "@/lib/shopify-storefront";
import {
  GALAXY_TEE_SLUG,
  GALAXY_TEE_STOREFRONT_HANDLE,
  getGalaxyTeeVariantId,
  isGalaxyTeeSlug,
} from "@/lib/shopify-galaxy-tee";

export const dynamic = "force-dynamic";

type AddCartRequest = {
  action: "add";
  cartId?: unknown;
  productSlug?: unknown;
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

type CartRequestBody = AddCartRequest | UpdateCartRequest | RemoveCartRequest;

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

  throw new Error(
    `FILE LOCKED. Checkout mirror only accepts ${GALAXY_TEE_SLUG}. Received ${productSlug || "unknown"}.`,
  );
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

      return NextResponse.json({ cart });
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

      return NextResponse.json({ cart });
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

      return NextResponse.json({ cart });
    }

    return jsonError("Unsupported cart action.", 400);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update Shopify cart.";

    if (message.startsWith("FILE LOCKED.")) {
      return jsonError(message, 400);
    }

    return jsonError(
      message,
      502,
    );
  }
}
