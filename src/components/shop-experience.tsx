"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import {
  isPurchasableProduct,
  type Collection,
  type Product,
} from "@/lib/brand-data";
import { ProductCard } from "./product-card";

type CategoryFilter = Product["category"] | "all";
type SortKey = "featured" | "price-low" | "price-high" | "name";

const sortOptions: { label: string; value: SortKey }[] = [
  { label: "Featured", value: "featured" },
  { label: "$ Low", value: "price-low" },
  { label: "$ High", value: "price-high" },
  { label: "A-Z", value: "name" },
];

export function ShopExperience({
  collections,
  initialCategory,
  products,
}: {
  collections: Collection[];
  initialCategory?: string;
  products: Product[];
}) {
  const shopProducts = useMemo(
    () => products.filter(isPurchasableProduct),
    [products],
  );
  const highestPrice = Math.max(
    0,
    ...shopProducts.map((product) => product.price),
  );
  const safeInitialCategory = collections.some(
    (collection) => collection.id === initialCategory,
  )
    ? (initialCategory as Product["category"])
    : "all";
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<CategoryFilter>(safeInitialCategory);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [sort, setSort] = useState<SortKey>("featured");

  const colorOptions = useMemo(() => {
    const colors = new Map<string, { name: string; hex: string }>();
    shopProducts.forEach((product) => {
      product.colors.forEach((color) => colors.set(color.hex, color));
    });
    return Array.from(colors.values());
  }, [shopProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return shopProducts
      .filter((product) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [
            product.title,
            product.japaneseTitle,
            product.description,
            product.category,
            product.availability,
            product.productState,
            product.archiveCode,
            product.stateNote,
            ...product.badges,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesCategory =
          category === "all" || product.category === category;
        const matchesColor =
          selectedColor === "all" ||
          product.colors.some((color) => color.hex === selectedColor);
        const matchesPrice = product.price <= maxPrice;

        return matchesQuery && matchesCategory && matchesColor && matchesPrice;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "name") return a.title.localeCompare(b.title);
        return shopProducts.indexOf(a) - shopProducts.indexOf(b);
      });
  }, [category, maxPrice, query, selectedColor, shopProducts, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSelectedColor("all");
    setMaxPrice(highestPrice);
    setSort("featured");
  };

  return (
    <section className="mx-auto grid max-w-[1600px] gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)] lg:px-8">
      <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-[8px] border border-blue-500/40 bg-black/85 p-4 shadow-[0_26px_80px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-sm uppercase text-white">Shop filter</h2>
            <SlidersHorizontal size={18} className="text-blue-300" />
          </div>

          <label className="mt-4 flex h-11 items-center gap-2 border border-white/15 bg-zinc-950 px-3 text-white focus-within:border-blue-300">
            <Search size={17} className="text-blue-300" />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search drop"
              className="h-full min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </label>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={() => setCategory("all")}
              aria-pressed={category === "all"}
              className={`flex min-w-0 items-center justify-between gap-3 border px-3 py-2 font-mono text-xs uppercase transition ${
                category === "all"
                  ? "border-blue-300 bg-blue-600 text-white"
                  : "border-white/10 text-zinc-300 hover:border-blue-300 hover:text-blue-200"
              }`}
            >
              <span className="min-w-0 truncate">All categories</span>
              <span className="shrink-0">{shopProducts.length}</span>
            </button>
            {collections.map((collection) => {
              const isActive = category === collection.id;
              const count = shopProducts.filter(
                (product) => product.category === collection.id,
              ).length;
              return (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => setCategory(collection.id as Product["category"])}
                  aria-pressed={isActive}
                  className={`flex min-w-0 items-center justify-between gap-3 border px-3 py-2 font-mono text-xs uppercase transition ${
                    isActive
                      ? "border-blue-300 bg-blue-600 text-white"
                      : "border-white/10 text-zinc-300 hover:border-blue-300 hover:text-blue-200"
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {collection.title}
                    <span className="ml-2" style={{ color: collection.accent }}>
                      {collection.label}
                    </span>
                  </span>
                  <span className="shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[8px] border border-white/15 bg-zinc-950/85 p-4">
          <h3 className="font-mono text-sm uppercase text-white">Filters</h3>
          <div className="mt-4 space-y-5">
            <div>
              <p className="font-mono text-xs uppercase text-zinc-500">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedColor("all")}
                  aria-label="All colors"
                  aria-pressed={selectedColor === "all"}
                  className={`grid size-7 place-items-center border font-mono text-[10px] ${
                    selectedColor === "all"
                      ? "border-white bg-white text-black"
                      : "border-white/25 text-white"
                  }`}
                >
                  *
                </button>
                {colorOptions.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    aria-label={color.name}
                    aria-pressed={selectedColor === color.hex}
                    className={`size-7 border ${
                      selectedColor === color.hex
                        ? "border-white ring-2 ring-blue-400"
                        : "border-white/25"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between gap-3 font-mono text-xs uppercase text-zinc-500">
                <span>Max price</span>
                <span>${maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={highestPrice}
                step={1}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="mt-3 w-full accent-blue-500"
              />
              <div className="mt-2 flex justify-between font-mono text-xs text-zinc-400">
                <span>$0</span>
                <span>${highestPrice}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="flex h-10 w-full items-center justify-center gap-2 border border-white/15 font-mono text-xs uppercase text-zinc-300 transition hover:border-pink-300 hover:text-pink-200"
            >
              <X size={15} />
              Reset filters
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-white/15 pb-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
              Current shop / {filteredProducts.length} pieces
            </p>
            <h2 className="mt-2 max-w-4xl text-4xl font-black uppercase leading-none text-white sm:text-6xl">
              Available now
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              The Galaxy tee and promo poster are live. Add both for the 15%
              pair credit, then finish through secure checkout.
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex h-9 shrink-0 items-center gap-2 border border-white/15 px-3 font-mono text-xs uppercase text-zinc-400">
              <ArrowDownUp size={14} />
              Sort
            </span>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSort(option.value)}
                aria-pressed={sort === option.value}
                className={`h-9 border px-3 font-mono text-xs uppercase transition ${
                  sort === option.value
                    ? "border-blue-300 bg-blue-600 text-white"
                    : "border-white/15 text-zinc-300 hover:border-blue-300 hover:text-blue-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center border border-dashed border-white/20 bg-black p-8 text-center">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-blue-300">
                No match
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase text-white">
                No product found
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex h-10 items-center justify-center border border-blue-400 px-4 font-mono text-xs uppercase text-blue-200 hover:bg-blue-600 hover:text-white"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
