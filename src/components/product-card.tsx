"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  isPurchasableProduct,
  productActionLabel,
  productStateLabels,
  type Product,
} from "@/lib/brand-data";
import { formatUsdPrice } from "@/lib/money";
import { useCart } from "./cart-context";

function normalizedOption(value?: string) {
  return value?.trim().toLowerCase().replace(/^2xl$/, "xxl") ?? "";
}

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem, isMutating } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const image = product.images[imageIndex] ?? product.images[0];
  const isCutout = image.includes("/cutouts/") || image.includes("-cutout");
  const isEditorial = image.includes("editorial");
  const shouldContainImage =
    !isEditorial &&
    (product.category === "tees" || product.slug.includes("poster") || isCutout);
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
    <article className="group relative min-w-0 overflow-hidden rounded-[8px] border border-white/12 bg-[#06060a] text-white shadow-[0_26px_90px_rgba(0,0,0,0.28)] transition duration-300 hover:border-violet-200/60 hover:shadow-[0_0_60px_rgba(139,92,246,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),transparent_28%,rgba(116,91,255,0.10)_64%,transparent)] opacity-50" />
      <div className="absolute left-3 top-3 z-10 rounded-full border border-white/20 bg-black/70 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-violet-100 backdrop-blur">
        {productStateLabels[product.productState]}
      </div>
      <button
        type="button"
        aria-label={`Cycle product image for ${product.title}`}
        onClick={() => setImageIndex((imageIndex + 1) % product.images.length)}
        className="relative block h-80 w-full overflow-hidden bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.22),rgba(9,9,14,0.94)_62%)] text-left sm:h-[26rem]"
      >
        <Image
          src={image}
          alt={`${product.title} product artwork`}
          fill
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`transition duration-500 group-hover:scale-[1.025] ${
            shouldContainImage
              ? "object-contain p-4 sm:p-6"
              : "object-cover object-center"
          }`}
        />
        <div className="scanline absolute inset-0 opacity-45" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        {product.images.length > 1 ? (
          <div className="absolute bottom-3 right-3 z-10 flex gap-1">
            {product.images.map((src, index) => (
              <span
                key={src}
                className={`h-1.5 w-6 border border-white/20 ${
                  index === imageIndex ? "bg-lime-300" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        ) : null}
      </button>

      <div className="relative space-y-4 p-4">
        <div>
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={`/shop/${product.slug}`}
                className="block break-words text-xl font-black uppercase leading-none tracking-wide transition hover:text-blue-200"
              >
                {product.title}
              </Link>
              <p className="mt-1 break-words font-mono text-xs uppercase tracking-[0.14em] text-blue-200/80">
                {product.productState === "live" ? "Current drop" : "Archive sample"}
              </p>
            </div>
            <p className="shrink-0 font-mono text-lg text-white">
              {formatUsdPrice(product.price)}
            </p>
          </div>
          <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-300">
            {product.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="max-w-full break-words border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="grid gap-3">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Size
            </p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-8 min-w-8 border px-2 font-mono text-xs transition ${
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
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Color
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  aria-label={color.name}
                  className={`size-6 border ${
                    selectedColor.name === color.name
                      ? "border-white ring-2 ring-blue-400"
                      : "border-white/25"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void addItem(product, selectedSize, selectedColor)}
          disabled={!canAddToCart || isMutating}
          className="flex h-11 w-full items-center justify-center gap-2 border border-violet-300 bg-white px-3 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-violet-300 hover:text-black disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
        >
          <ShoppingCart size={16} />
          {isMutating ? "Adding..." : productActionLabel(product)}
        </button>
      </div>
    </article>
  );
}
