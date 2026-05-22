import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  isPurchasableProduct,
  productStateLabels,
  products as fallbackProducts,
  type Product,
} from "@/lib/brand-data";
import { assetById } from "@/lib/assets-manifest";
import { formatUsdPrice } from "@/lib/money";
import { ProductDetailActions } from "./product-detail-actions";

function productImageClass(product: Product) {
  const image = product.images[0] ?? "";
  const isEditorial = image.includes("editorial");

  if (product.slug.includes("poster")) {
    return "object-contain p-3 sm:p-5";
  }

  return isEditorial ? "object-cover object-center" : "object-contain p-4 sm:p-8";
}

export function FloatingDropShowcase({
  products = fallbackProducts,
}: {
  products?: Product[];
}) {
  const liveProducts = products.filter(isPurchasableProduct);

  if (!liveProducts.length) {
    return null;
  }

  return (
    <section
      id="ar-001"
      className="relative overflow-hidden border-y border-white/10 bg-[#f5f3ff] px-4 py-8 text-black sm:px-6 lg:px-8 lg:py-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(126,55,255,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(215,232,255,0.72))]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(2,3,6,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(2,3,6,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative mx-auto max-w-[1680px]">
        <div className="mb-5 grid gap-4 border-b border-black/15 pb-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-violet-700">
              Current capsule
            </p>
            <h2 className="mt-2 max-w-5xl text-5xl font-black uppercase leading-[0.82] text-black sm:text-7xl lg:text-8xl">
              Galaxy pieces
            </h2>
          </div>
          <div className="border border-violet-500/40 bg-white/75 p-4 shadow-[0_18px_50px_rgba(55,37,120,0.12)] backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-violet-700" size={22} />
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-black">
                  Pair credit active
                </p>
                <p className="mt-2 font-mono text-xs uppercase leading-5 text-zinc-600">
                  Add the tee and poster together and 15% comes off the pair
                  before shipping and tax.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {liveProducts.map((product) => (
            <article
              key={product.id}
              className="grid min-w-0 overflow-hidden border border-black/15 bg-white/75 shadow-[0_22px_70px_rgba(20,20,35,0.16)] backdrop-blur md:grid-cols-[minmax(0,0.95fr)_minmax(300px,0.78fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(310px,0.78fr)]"
            >
              <Link
                href={`/shop/${product.slug}`}
                className="group relative min-h-[380px] overflow-hidden bg-black sm:min-h-[520px]"
              >
                <Image
                  src={product.images[0]}
                  alt={`${product.title} product image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`${productImageClass(product)} transition duration-700 group-hover:scale-[1.035]`}
                />
                <div className="scanline absolute inset-0 opacity-60" />
                <div className="absolute left-3 top-3 border border-white/25 bg-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
                  {productStateLabels[product.productState]}
                </div>
                <div className="absolute bottom-3 right-3 border border-lime-300/70 bg-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-100">
                  {formatUsdPrice(product.price)}
                </div>
              </Link>

              <div className="flex min-w-0 flex-col justify-between p-4 sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-1.5">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="border border-black/15 bg-black px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-violet-700">
                    {product.japaneseTitle}
                  </p>
                  <h3 className="mt-3 text-3xl font-black uppercase leading-[0.92] text-black sm:text-4xl">
                    {product.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-mono text-sm leading-6 text-zinc-700">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5">
                  <ProductDetailActions product={product} />

                  <Link
                    href={`/shop/${product.slug}`}
                    className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 border border-black/20 px-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-black transition hover:border-violet-500 hover:bg-violet-200"
                  >
                    View piece
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 border border-black/15 bg-black p-4 text-white md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-lime-300" size={22} />
            <p className="font-mono text-xs uppercase leading-5 tracking-[0.16em] text-zinc-300">
              The Galaxy tee and promo poster are available now. The archive
              still keeps its older samples, but the shop only surfaces pieces
              that can be purchased today.
            </p>
          </div>
          <Image
            src={assetById["action-replay-ar-mark-white"].src}
            alt=""
            width={54}
            height={54}
            className="hidden h-12 w-12 object-contain opacity-80 md:block"
          />
        </div>
      </div>
    </section>
  );
}
