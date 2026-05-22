import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  isPurchasableProduct,
  products as fallbackProducts,
  type Product,
} from "@/lib/brand-data";

export function LiveShopGrid({
  products = fallbackProducts,
}: {
  products?: Product[];
}) {
  const liveProducts = products.filter(isPurchasableProduct);

  return (
    <section className="border-y border-white/10 bg-black px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-violet-200">
              Shop the capsule
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none sm:text-6xl">
              Available now
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex h-11 w-full items-center justify-center gap-2 border border-white bg-white px-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:border-violet-300 hover:bg-violet-400 md:w-auto"
          >
            View all products
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {liveProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>

        <div className="mt-4 grid gap-3 border border-violet-300/35 bg-[#050507] p-4 font-mono text-xs uppercase tracking-[0.16em] text-zinc-200 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
          <div>
            <p className="text-violet-200">Pair credit preserved</p>
            <p className="mt-2 text-zinc-400">
              Add the Galaxy tee and promo poster together for 15% off.
            </p>
            <p className="mt-2 text-zinc-500">
              Checkout, taxes, and shipping are handled securely after the bag.
            </p>
          </div>
          <p className="text-white">AVAILABLE NOW</p>
        </div>
      </div>
    </section>
  );
}
