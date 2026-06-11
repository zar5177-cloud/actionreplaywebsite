"use client";

import { useEffect, useState } from "react";
import { Ruler, ShoppingCart, X } from "lucide-react";
import {
  isPurchasableProduct,
  productActionLabel,
  productStateLabels,
  type Product,
} from "@/lib/brand-data";
import { trackEvent } from "@/lib/analytics/events";
import { trackSizeGuideOpen } from "@/lib/analytics/microConversions";
import { GALAXY_TEE_SLUG } from "@/lib/shopify-galaxy-tee";
import { useCart } from "./cart-context";

function normalizedOption(value?: string) {
  return value?.trim().toLowerCase().replace(/^2xl$/, "xxl") ?? "";
}

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem, addPair, errorMessage, isMutating } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
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
  const canAddPair = product.slug === GALAXY_TEE_SLUG && canAddToCart;

  useEffect(() => {
    trackEvent({
      name: "view_item",
      product_id: product.id,
      product_title: product.title,
    });
  }, [product.id, product.title]);

  function openSizeGuide() {
    setSizeGuideOpen(true);
    trackSizeGuideOpen(product.id);
  }

  async function addSelectedItem() {
    trackEvent({
      name: "add_to_cart",
      product_id: product.id,
      variant_id:
        selectedVariant?.id ??
        `${product.slug}:${selectedSize}:${selectedColor.name}`,
      value: product.price,
    });
    await addItem(product, selectedSize, selectedColor);
  }

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
        <button
          type="button"
          onClick={openSizeGuide}
          className="mt-3 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-sky-200 underline underline-offset-4"
        >
          <Ruler size={14} />
          size guide
        </button>
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
        onClick={() => void addSelectedItem()}
        disabled={!canAddToCart || isMutating}
        className="flex h-14 w-full items-center justify-center gap-2 border border-violet-300 bg-white px-4 font-mono text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_34px_rgba(255,255,255,0.16)] transition hover:bg-violet-400 hover:text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
      >
        <ShoppingCart size={17} />
        {isMutating
          ? "Adding..."
          : canAddToCart
            ? productActionLabel(product)
          : productActionLabel(product)}
      </button>
      {product.slug === GALAXY_TEE_SLUG ? (
        <button
          type="button"
          onClick={() => void addPair(selectedSize, selectedColor)}
          disabled={!canAddPair || isMutating}
          className="flex min-h-12 w-full items-center justify-center gap-2 border border-lime-300/80 bg-lime-300 px-4 py-3 font-mono text-xs font-black uppercase leading-5 tracking-[0.14em] text-black shadow-[0_0_28px_rgba(190,242,100,0.18)] transition hover:bg-white disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
        >
          <ShoppingCart size={16} />
          {isMutating ? "Adding pair..." : "Add tee + poster / save 15%"}
        </button>
      ) : null}
      {product.slug === GALAXY_TEE_SLUG ? (
        <p className="-mt-1 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-lime-200/80">
          Pair credit appears automatically when the tee and poster are in the
          same bag.
        </p>
      ) : null}
      <p className="border border-white/10 bg-black/50 p-3 font-mono text-[11px] uppercase leading-5 tracking-[0.12em] text-zinc-400">
        {productStateLabels[product.productState]}
        {product.stateNote ? ` / ${product.stateNote}` : ""}
      </p>
      {errorMessage ? (
        <p className="font-mono text-xs leading-5 text-fuchsia-200">
          {errorMessage}
        </p>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-lime-300/30 bg-black/92 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => void addSelectedItem()}
          disabled={!canAddToCart || isMutating}
          className="flex min-h-12 w-full items-center justify-center gap-2 border border-lime-300 bg-lime-300 px-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
        >
          <ShoppingCart size={16} />
          {isMutating ? "queueing..." : "extract file"}
        </button>
      </div>

      {isSizeGuideOpen ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setSizeGuideOpen(false)}
            className="absolute inset-0"
          />
          <div className="relative w-full max-w-lg border border-sky-300/40 bg-[#03040a] p-5 text-white shadow-[0_0_80px_rgba(56,189,248,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-200">
                  size file / approximate
                </p>
                <h2 id="size-guide-title" className="mt-2 text-3xl font-black uppercase">
                  boxy fit guide
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close size guide"
                onClick={() => setSizeGuideOpen(false)}
                className="grid size-9 place-items-center border border-white/15"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 grid gap-2 font-mono text-xs uppercase text-zinc-300">
              {[
                ["S", "body 26.5 / chest 18.5"],
                ["M", "body 28 / chest 20.5"],
                ["L", "body 29.5 / chest 22"],
                ["XL", "body 31 / chest 24"],
                ["XXL", "body 32 / chest 26"],
              ].map(([size, measure]) => (
                <div key={size} className="grid grid-cols-[4rem_1fr] border border-white/10 bg-white/[0.03] p-3">
                  <span className="text-lime-200">{size}</span>
                  <span>{measure}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-[0.68rem] uppercase leading-5 text-zinc-500">
              check your favorite tee before ordering. size issue? email support
              before the file gets too far into extraction.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
