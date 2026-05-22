import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ShoppingBag } from "lucide-react";
import { FloatingDropShowcase } from "@/components/floating-drop-showcase";
import { HeroSection } from "@/components/hero-section";
import { archiveFiles } from "@/data/config/archive-files";
import { brandSlogans } from "@/data/config/brand";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ACTION REPLAY",
  description:
    "Shop the Action Replay Galaxy capsule and explore the recovered archive.",
};

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <>
      <HeroSection products={products} />

      <section className="hero-system relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.55fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
              current capsule / limited issue
            </p>
            <h2 className="chrome-title mt-4 text-5xl font-black uppercase leading-[0.82] sm:text-7xl lg:text-[7rem]">
              Galaxy issue
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-xl">
              The tee and poster share the same purple artifact, the same bad
              export, the same late-night catalog page. Wear one. Keep the other
              on the wall.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="ui-button ui-button-hot">
                <ShoppingBag size={17} aria-hidden="true" />
                shop the drop
              </Link>
              <Link href="/archive" className="ui-button">
                <Archive size={17} aria-hidden="true" />
                archive
              </Link>
            </div>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-black/55 p-5 shadow-[0_26px_80px_rgba(0,0,0,0.25)] backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
              Pair credit
            </p>
            <p className="mt-3 text-3xl font-black uppercase leading-none text-white">
              Tee + poster saves 15%
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              The discount applies in the bag when both live pieces are added.
              Shipping and tax calculate securely at checkout.
            </p>
          </div>
        </div>
      </section>

      <FloatingDropShowcase products={products} />

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="section-kicker">archive residue</div>
            <h2 className="section-title">older pieces still hum</h2>
          </div>
          <p className="text-sm leading-6 text-zinc-400">
            A few recovered fragments stay visible around the shop. They should
            feel found, not explained.
          </p>
        </div>
        <div className="mx-auto mt-5 grid max-w-7xl gap-3 md:grid-cols-2 lg:grid-cols-5">
          {archiveFiles.slice(0, 5).map((file) => (
            <Link
              key={file.id}
              href="/archive"
              className="rounded-[8px] border border-white/10 bg-black/45 p-3 transition hover:border-sky-300/50 hover:bg-sky-950/20"
            >
              <p className="mt-2 min-h-12 text-lg font-black uppercase leading-none text-white">
                {file.title}
              </p>
              <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lime-200">
                {file.rarity}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-7xl border-y border-white/10 py-5">
          <div className="flex flex-wrap gap-2">
            {brandSlogans.map((slogan) => (
              <span
                key={slogan}
                className="border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs lowercase text-zinc-400"
              >
                {slogan}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
