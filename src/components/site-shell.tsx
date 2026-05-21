"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LockKeyhole,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  X,
} from "lucide-react";
import { assetById } from "@/lib/assets-manifest";
import { deadNavigationItems, publicMemoryFragments } from "@/data/residue";
import {
  DeadNavReference,
  FileStamp,
  InternalComment,
} from "@/components/residue/residue-fragments";
import type { Product } from "@/lib/brand-data";
import { formatUsdPrice } from "@/lib/money";
import { CartProvider, useCart } from "./cart-context";

type SiteShellProps = {
  children: React.ReactNode;
  searchProducts: Product[];
};

const navLinks = [
  { label: "Home", href: "/", accent: "BOOT" },
  { label: "Shop", href: "/shop", accent: "AR-001" },
  { label: "Archive", href: "/archive", accent: "FILE" },
  { label: "Hidden Event", href: "/hidden-event", accent: "EVT" },
  { label: "Forum", href: "/forum", accent: "BBS" },
] as const;

function BrandMark() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Action Replay home">
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden border border-white/25 bg-black p-2 shadow-[0_0_24px_rgba(56,189,248,0.24)]">
        <Image
          src={assetById["action-replay-ar-mark-white"].src}
          alt={assetById["action-replay-ar-mark-white"].alt}
          fill
          sizes="44px"
          className="object-contain p-2"
        />
      </span>
      <span className="hidden min-w-0 leading-none sm:block">
        <span className="block text-lg font-black italic uppercase text-white">
          Action
        </span>
        <span className="block text-lg font-black italic uppercase text-sky-200 group-hover:text-fuchsia-200">
          Replay
        </span>
      </span>
    </Link>
  );
}

function Header({ searchProducts }: { searchProducts: Product[] }) {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] min-w-0 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <BrandMark />
          <div className="hidden items-center gap-2 border-l border-white/15 pl-5 font-mono text-xs uppercase tracking-[0.16em] text-lime-200 md:flex">
            <ShieldCheck size={18} />
            AR-001 checkout mirror
          </div>
        </div>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 font-mono text-sm uppercase transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                <span className="ml-2 text-[10px] text-sky-200">{link.accent}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="grid size-10 place-items-center border border-white/15 text-white transition hover:border-sky-300 hover:text-sky-200"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid size-10 place-items-center border border-blue-400 text-white transition hover:bg-blue-600"
          >
            <ShoppingCart size={19} />
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center bg-blue-600 font-mono text-[10px] text-white">
              {count}
            </span>
          </button>
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center border border-white/15 text-white transition hover:border-sky-300 xl:hidden"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-white/10 bg-black px-4 py-3 xl:hidden" aria-label="Mobile navigation">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border border-white/10 px-3 py-3 font-mono text-sm uppercase text-white"
              >
                {link.label}
                <span className="ml-2 text-sky-300">{link.accent}</span>
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        products={searchProducts}
      />
    </header>
  );
}

function SearchOverlay({
  isOpen,
  onClose,
  products,
}: {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) =>
      [
        product.title,
        product.japaneseTitle,
        product.description,
        product.category,
        ...product.badges,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/82 p-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close search overlay"
        onClick={onClose}
        className="absolute inset-0"
      />
      <div className="relative mx-auto mt-16 w-full max-w-3xl min-w-0 border border-blue-400/60 bg-black p-4 shadow-[0_0_80px_rgba(0,80,255,0.35)]">
        <div className="flex min-w-0 items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
              Search product mirror
            </p>
            <h2 className="mt-1 text-3xl font-black uppercase text-white">
              AR-001 + locked files
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center border border-white/15 text-white hover:border-blue-300"
          >
            <X size={19} />
          </button>
        </div>

        <label className="mt-4 flex h-12 items-center gap-3 border border-white/15 bg-zinc-950 px-3 focus-within:border-blue-300">
          <Search size={18} className="text-blue-300" />
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search AR-001"
            className="h-full min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </label>

        <div className="mt-4 grid gap-2">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="grid min-w-0 gap-3 border border-white/10 bg-white/[0.03] p-3 transition hover:border-blue-300/70 sm:grid-cols-[5rem_1fr_auto] sm:items-center"
            >
              <span className="relative h-24 overflow-hidden border border-white/10 bg-zinc-950 sm:h-20">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </span>
              <span className="min-w-0">
                <span className="block break-words font-mono text-sm uppercase text-white">
                  {product.title}
                </span>
                <span className="mt-1 block font-mono text-xs uppercase text-zinc-500">
                  {product.badges.join(" / ")}
                </span>
              </span>
              <span className="font-mono text-sm text-blue-200">
                {formatUsdPrice(product.price)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CartDrawer() {
  const {
    closeCart,
    checkoutUrl,
    discountCodes,
    discountTotal,
    errorMessage,
    isCartOpen,
    isMutating,
    items,
    removeItem,
    subtotal,
    total,
    updateQuantity,
  } = useCart();
  const applicableCodes = discountCodes.filter((code) => code.applicable);

  function checkout() {
    if (!checkoutUrl) {
      return;
    }

    window.location.href = checkoutUrl;
  }

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close cart overlay"
        onClick={closeCart}
        className="absolute inset-0"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-blue-400/40 bg-[#03040a] text-white shadow-[0_0_80px_rgba(37,99,235,0.24)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
              Checkout mirror
            </p>
            <h2 className="mt-1 text-3xl font-black uppercase">Live files</h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="grid size-10 place-items-center border border-white/15 hover:border-blue-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {items.length ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-[5rem_1fr] gap-3 border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="relative h-24 overflow-hidden border border-white/10 bg-black">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-mono text-sm uppercase text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase text-zinc-500">
                      {item.size} / {item.color.name}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase text-zinc-300">
                      {formatUsdPrice(item.lineTotal)}
                      {item.lineDiscount > 0 ? (
                        <span className="ml-2 text-lime-200">
                          -{formatUsdPrice(item.lineDiscount)}
                        </span>
                      ) : null}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center border border-white/15">
                        <button
                          type="button"
                          aria-label={`Decrease quantity for ${item.title}`}
                          onClick={() =>
                            void updateQuantity(item.lineId, item.quantity - 1)
                          }
                          disabled={isMutating}
                          className="grid size-8 place-items-center hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="grid size-8 place-items-center border-x border-white/15 font-mono text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity for ${item.title}`}
                          onClick={() =>
                            void updateQuantity(item.lineId, item.quantity + 1)
                          }
                          disabled={isMutating}
                          className="grid size-8 place-items-center hover:bg-white/10 disabled:cursor-not-allowed disabled:text-zinc-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeItem(item.lineId)}
                        disabled={isMutating}
                        className="font-mono text-xs uppercase text-zinc-500 hover:text-fuchsia-200 disabled:cursor-not-allowed disabled:text-zinc-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-80 place-items-center border border-dashed border-white/20 p-6 text-center">
              <div>
                <LockKeyhole className="mx-auto text-zinc-500" size={30} />
                <p className="mt-3 font-mono text-sm uppercase text-zinc-400">
                  Mirror empty
                </p>
                <Link href="/shop" onClick={closeCart} className="ui-button mt-5">
                  Shop live files
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 grid gap-2 border border-white/10 bg-black p-3 font-mono text-xs uppercase tracking-[0.14em] text-zinc-300">
            <div className="flex items-center gap-2 text-lime-200">
              <ShieldCheck size={16} />
              AR-001 + AR-003 Shopify cart mirror
            </div>
            <p className="text-zinc-500">
              Galaxy tee and corrupted promo poster route through Shopify. Put
              both in the drawer and the 15% pair credit appears from Shopify,
              not the browser.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono text-sm uppercase text-zinc-300">
            <span>Subtotal</span>
            <span className="text-white">{formatUsdPrice(subtotal)}</span>
          </div>
          {discountTotal > 0 ? (
            <div className="mt-2 flex items-center justify-between gap-4 font-mono text-sm uppercase text-lime-200">
              <span>Pair credit / 15%</span>
              <span>-{formatUsdPrice(discountTotal)}</span>
            </div>
          ) : null}
          {applicableCodes.length ? (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-blue-200">
              Code accepted: {applicableCodes.map((code) => code.code).join(", ")}
            </p>
          ) : null}
          <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/10 pt-3 font-mono text-sm uppercase text-zinc-300">
            <span>Estimated total</span>
            <span className="text-white">{formatUsdPrice(total || subtotal)}</span>
          </div>
          {errorMessage ? (
            <p className="mt-3 font-mono text-xs leading-5 text-fuchsia-200">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="button"
            onClick={checkout}
            disabled={!items.length || isMutating || !checkoutUrl}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 border border-lime-300 bg-lime-300 px-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:bg-white disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/10 disabled:text-zinc-500"
          >
            <ShoppingCart size={16} />
            {isMutating ? "Restoring..." : "OPEN CHECKOUT MIRROR"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export function SiteShell({ children, searchProducts }: SiteShellProps) {
  return (
    <CartProvider>
      <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
        <div className="crt-overlay" aria-hidden="true" />
        <Header searchProducts={searchProducts} />
        <main className="relative z-10 flex-1">{children}</main>
        <footer className="relative z-10 border-t border-white/10 bg-black/70 px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
                Action Replay / AR-001 live
              </p>
              <p className="mt-2 max-w-2xl font-mono text-xs leading-6 text-zinc-500">
                Hidden archive layers are additive. The Galaxy tee and corrupted
                promo print mirror are live; memory-card files remain preserved
                without purchase access.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {publicMemoryFragments.map((fragment) =>
                  fragment.href ? (
                    <a key={fragment.label} href={fragment.href}>
                      <FileStamp label={fragment.label} value={fragment.value} />
                    </a>
                  ) : (
                    <FileStamp
                      key={fragment.label}
                      label={fragment.label}
                      value={fragment.value}
                    />
                  ),
                )}
              </div>
              <InternalComment user="mira_local" className="mt-3">
                don&apos;t remove this one again.
              </InternalComment>
            </div>
            <div className="flex flex-wrap gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-zinc-500">
              <span className="border border-white/10 px-2 py-1">改造コード</span>
              <span className="border border-white/10 px-2 py-1">SHOPIFY LIVE</span>
              <span className="border border-white/10 px-2 py-1">AR-001 ONLY</span>
            </div>
          </div>
          <div className="mx-auto mt-5 grid max-w-[1600px] gap-2 md:grid-cols-3">
            {deadNavigationItems.map((item) => (
              <DeadNavReference
                key={item.href}
                href={item.href}
                label={item.label}
                state={item.state}
                note={item.note}
              />
            ))}
          </div>
        </footer>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
