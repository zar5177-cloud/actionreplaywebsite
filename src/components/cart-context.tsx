"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isPurchasableProduct,
  type Product,
  type ProductColor,
} from "@/lib/brand-data";
import { attributionToFormFields } from "@/lib/analytics/utm";

const CART_STORAGE_KEY = "action-replay-shopify-cart-id";

type Money = {
  amount: string;
  currencyCode: string;
};

type ApiCartLine = {
  id: string;
  quantity: number;
  merchandiseId: string;
  merchandiseTitle: string;
  availableForSale: boolean;
  productTitle: string;
  productSlug: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  imageUrl: string | null;
  imageAlt: string | null;
  price: Money;
  subtotal: Money;
  total: Money;
  discountTotal: Money;
};

type ApiCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  discountCodes: {
    code: string;
    applicable: boolean;
  }[];
  undiscountedSubtotal: Money;
  discountTotal: Money;
  subtotal: Money;
  total: Money;
  lines: ApiCartLine[];
};

export type CartItem = {
  key: string;
  lineId: string;
  productSlug: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: ProductColor;
  quantity: number;
  lineTotal: number;
  lineDiscount: number;
};

type CartContextValue = {
  cart: ApiCart | null;
  items: CartItem[];
  count: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  discountCodes: ApiCart["discountCodes"];
  checkoutUrl: string | null;
  isCartOpen: boolean;
  isMutating: boolean;
  errorMessage: string;
  addItem: (product: Product, size: string, color: ProductColor) => Promise<void>;
  addPair: (size: string, color: ProductColor) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  clearError: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function moneyAmount(money?: Money) {
  if (!money) return 0;
  const parsed = Number.parseFloat(money.amount);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizedOption(value: string) {
  return value.trim().toLowerCase();
}

function optionValue(
  options: ApiCartLine["selectedOptions"],
  names: string[],
) {
  const normalizedNames = names.map(normalizedOption);

  return (
    options.find((option) =>
      normalizedNames.includes(normalizedOption(option.name)),
    )?.value ?? ""
  );
}

function colorHex(colorName: string) {
  const normalized = normalizedOption(colorName);

  if (normalized.includes("black")) return "#050505";
  if (normalized.includes("white")) return "#f6f4ef";
  if (normalized.includes("purple")) return "#8b5cf6";

  return "#777777";
}

function mapCartItems(cart: ApiCart | null): CartItem[] {
  return (
    cart?.lines.map((line) => {
      const size =
        optionValue(line.selectedOptions, ["size"]) || line.merchandiseTitle;
      const color =
        optionValue(line.selectedOptions, ["color", "colour"]) || "Unknown";

      return {
        key: line.id,
        lineId: line.id,
        productSlug: line.productSlug,
        title: line.productTitle,
        price: moneyAmount(line.price),
        image:
          line.imageUrl ??
          "/assets/generated/current-drop/galaxy-tee-editorial-blue.jpg",
        size,
        color: {
          name: color,
          hex: colorHex(color),
        },
        quantity: line.quantity,
        lineTotal: moneyAmount(line.total),
        lineDiscount: moneyAmount(line.discountTotal),
      };
    }) ?? []
  );
}

async function requestCart(body: Record<string, unknown>) {
  const response = await fetch("/api/shopify/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const payload = (await response.json()) as {
    cart?: ApiCart | null;
    error?: string;
  };

  if (!response.ok || !payload.cart) {
    throw new Error(payload.error ?? "Unable to update Shopify cart.");
  }

  return payload.cart;
}

function persistCartId(cart: ApiCart | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (cart?.id) {
    window.localStorage.setItem(CART_STORAGE_KEY, cart.id);
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

function readPersistedCartId() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.localStorage.getItem(CART_STORAGE_KEY) ?? undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMutating, setMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const cartId = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!cartId) {
      return;
    }

    const savedCartId = cartId;
    let isMounted = true;

    async function loadCart() {
      try {
        const response = await fetch(
          `/api/shopify/cart?cartId=${encodeURIComponent(savedCartId)}`,
          { cache: "no-store" },
        );
        const payload = (await response.json()) as {
          cart?: ApiCart | null;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load Shopify cart.");
        }

        if (isMounted) {
          setCart(payload.cart ?? null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load Shopify cart.",
          );
          window.localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (cart?.id) {
      window.localStorage.setItem(CART_STORAGE_KEY, cart.id);
    }
  }, [cart?.id]);

  const items = useMemo(() => mapCartItems(cart), [cart]);
  const count = cart?.totalQuantity ?? 0;
  const subtotal = moneyAmount(cart?.undiscountedSubtotal ?? cart?.subtotal);
  const discountTotal = moneyAmount(cart?.discountTotal);
  const total = moneyAmount(cart?.total);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items,
      count,
      subtotal,
      discountTotal,
      total,
      discountCodes: cart?.discountCodes ?? [],
      checkoutUrl: cart?.checkoutUrl ?? null,
      isCartOpen,
      isMutating,
      errorMessage,
      async addItem(product, size, color) {
        if (!isPurchasableProduct(product)) {
          setErrorMessage("This item is not available to purchase right now.");
          setCartOpen(true);
          return;
        }

        setMutating(true);
        setErrorMessage("");

        try {
          const updatedCart = await requestCart({
            action: "add",
            attribution: attributionToFormFields(),
            cartId: cart?.id ?? readPersistedCartId(),
            productSlug: product.slug,
            size,
            color: color.name,
            quantity: 1,
          });
          persistCartId(updatedCart);
          setCart(updatedCart);
          setCartOpen(true);
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to add item.",
          );
          setCartOpen(true);
        } finally {
          setMutating(false);
        }
      },
      async addPair(size, color) {
        setMutating(true);
        setErrorMessage("");

        try {
          const updatedCart = await requestCart({
            action: "addPair",
            attribution: attributionToFormFields(),
            cartId: cart?.id ?? readPersistedCartId(),
            size,
            color: color.name,
            quantity: 1,
          });
          persistCartId(updatedCart);
          setCart(updatedCart);
          setCartOpen(true);
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to restore the pair.",
          );
          setCartOpen(true);
        } finally {
          setMutating(false);
        }
      },
      async updateQuantity(lineId, quantity) {
        if (!cart?.id) {
          return;
        }

        if (quantity <= 0) {
          setMutating(true);
          setErrorMessage("");

          try {
            const updatedCart = await requestCart({
              action: "remove",
              cartId: cart.id,
              lineId,
            });
            persistCartId(updatedCart);
            setCart(updatedCart);
          } catch (error) {
            setErrorMessage(
              error instanceof Error ? error.message : "Unable to remove item.",
            );
          } finally {
            setMutating(false);
          }
          return;
        }

        setMutating(true);
        setErrorMessage("");

        try {
          const updatedCart = await requestCart({
            action: "update",
            cartId: cart.id,
            lineId,
            quantity,
          });
          persistCartId(updatedCart);
          setCart(updatedCart);
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to update quantity.",
          );
        } finally {
          setMutating(false);
        }
      },
      async removeItem(lineId) {
        if (!cart?.id) {
          return;
        }

        setMutating(true);
        setErrorMessage("");

        try {
          const updatedCart = await requestCart({
            action: "remove",
            cartId: cart.id,
            lineId,
          });
          persistCartId(updatedCart);
          setCart(updatedCart);
        } catch (error) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to remove item.",
          );
        } finally {
          setMutating(false);
        }
      },
      openCart() {
        setCartOpen(true);
      },
      closeCart() {
        setCartOpen(false);
      },
      clearError() {
        setErrorMessage("");
      },
    }),
    [
      cart,
      count,
      discountTotal,
      errorMessage,
      isCartOpen,
      isMutating,
      items,
      subtotal,
      total,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
