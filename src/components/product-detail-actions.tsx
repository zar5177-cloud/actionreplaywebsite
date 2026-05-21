"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import {
  isPurchasableProduct,
  productActionLabel,
  productStateLabels,
  type Product,
} from "@/lib/brand-data";
import { useCart } from "./cart-context";

function normalizedOption(value?: string) {
  return value?.trim().toLowerCase().replace(/^2xl$/, "xxl") ?? "";
}

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem, errorMessage, isMutating } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const selectedVariant = product.shopifyVariants?.find(
    (variant) =>
      normalizedOption(variant.size) === normalizedOption(selectedSize) &&
      (!variant.color ||
        normalizedOption(variant.color) === normalizedOption(selectedColor.name)),
  );
  const isPurchasable = isPurchasableProduct(product);
  const canAddToCart =
    isPurchasable &&
    Boolean(selectedVariant) &&
    selectedVariant?.availableForSale !== false;

  return (
    <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Size
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`h-10 min-w-10 border px-3 font-mono text-xs transition ${
                selectedSize === size
                  ? "border-blue-300 bg-blue-600 text-white"
                  : "border-white/15 bg-zinc-950 text-zinc-300 hover:border-blue-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Color
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => setSelectedColor(color)}
              aria-label={color.name}
              aria-pressed={selectedColor.name === color.name}
              className={`size-8 border ${
                selectedColor.name === color.name
                  ? "border-white ring-2 ring-blue-400"
                  : "border-white/25"
              }`}
              style={{ backgroundColor: color.hex }}
            >
              <span className="sr-only">{color.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 font-mono text-xs uppercase text-zinc-500">
          {selectedColor.name}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void addItem(product, selectedSize, selectedColor)}
        disabled={!canAddToCart || isMutating}
        className="flex h-14 w-full items-center justify-center gap-2 border border-violet-300 bg-white px-4 font-mono text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_34px_rgba(255,255,255,0.16)] transition hover:bg-violet-400 hover:text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
      >
        <ShoppingCart size={17} />
        {isMutating
          ? "Restoring..."
          : canAddToCart
            ? productActionLabel(product)
          : productActionLabel(product)}
      </button>
      <p className="border border-white/10 bg-black/50 p-3 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-zinc-500">
        {product.archiveCode ?? product.slug} /{" "}
        {productStateLabels[product.productState]}
        {product.stateNote ? ` / ${product.stateNote}` : ""}
      </p>
      {errorMessage ? (
        <p className="font-mono text-xs leading-5 text-fuchsia-200">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
