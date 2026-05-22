import type { Metadata } from "next";
import { FloatingDropShowcase } from "@/components/floating-drop-showcase";
import { ShopExperience } from "@/components/shop-experience";
import { collections } from "@/lib/brand-data";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop the Action Replay Galaxy tee and promo poster capsule.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const products = await getCatalogProducts();

  return (
    <>
      <section className="shop-hero relative overflow-hidden border-b border-white/10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1600px] min-w-0 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.45fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
              Action Replay capsule
            </p>
            <h1 className="mt-3 break-words text-5xl font-black italic uppercase leading-[0.82] text-white sm:text-8xl lg:text-[9rem] 2xl:text-[11rem]">
              Galaxy drop
            </h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-zinc-300 lg:pb-3">
            The washed Galaxy tee and oversized promo poster are available now.
            Add both to the bag and the 15% pair credit applies automatically
            before shipping and tax.
          </p>
        </div>
      </section>

      <FloatingDropShowcase products={products} />

      <ShopExperience
        collections={collections}
        initialCategory={category}
        products={products}
      />

    </>
  );
}
