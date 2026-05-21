import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  LockKeyhole,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ProductDetailActions } from "@/components/product-detail-actions";
import { getCatalogProduct, getCatalogProducts } from "@/lib/catalog";
import {
  isPurchasableProduct,
  productStateLabels,
  publicProductSlugs,
} from "@/lib/brand-data";
import { formatUsdPrice } from "@/lib/money";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getCatalogProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (
    !product ||
    !publicProductSlugs.includes(
      product.slug as (typeof publicProductSlugs)[number],
    )
  ) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 900,
          alt: product.title,
        },
      ],
    },
  };
}

function shouldContainImage(src: string, slug: string, category: string) {
  if (src.includes("editorial")) return false;

  return (
    category === "tees" ||
    slug.includes("poster") ||
    src.includes("/cutouts/") ||
    src.includes("-cutout")
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);

  if (
    !product ||
    !publicProductSlugs.includes(
      product.slug as (typeof publicProductSlugs)[number],
    )
  ) {
    notFound();
  }

  const catalogProducts = await getCatalogProducts();
  const isPurchasable = isPurchasableProduct(product);
  const relatedProducts = isPurchasable
    ? catalogProducts
        .filter((relatedProduct) => relatedProduct.slug !== product.slug)
        .slice(0, 2)
    : [];
  const heroImage = product.images[0];
  const proofRows = [
    [
      "PRODUCT STATE",
      productStateLabels[product.productState],
    ],
    [
      "VARIANTS",
      isPurchasable
        ? `${product.shopifyVariants?.length ?? product.sizes.length} MAPPED`
        : "NOT EXPOSED",
    ],
    [
      "CHECKOUT",
      isPurchasable ? "SHOPIFY CART MIRROR" : "BLOCKED",
    ],
    ["LOCAL UNLOCK", "VISUAL ONLY"],
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-black px-4 py-6 sm:px-6 lg:px-8">
        <div className="scanline absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px]">
          <Link
            href="/shop"
            className="inline-flex h-10 items-center gap-2 border border-white/15 px-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-300 transition hover:border-blue-300 hover:text-blue-200"
          >
            <ArrowLeft size={15} />
            Shop
          </Link>

          <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.75fr)] lg:gap-5">
            <div className="grid gap-3">
              <div className="relative min-h-[320px] overflow-hidden border border-blue-400/35 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.28),rgba(0,0,0,0.92)_62%)] sm:min-h-[620px]">
                <Image
                  src={heroImage}
                  alt={`${product.title} product artwork`}
                  fill
                  loading="eager"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={
                    shouldContainImage(heroImage, product.slug, product.category)
                      ? "object-contain p-2 sm:p-8"
                      : "object-cover object-center"
                  }
                />
                <div className="absolute left-3 top-3 border border-lime-300/70 bg-black/80 px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-200 sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
                  STATUS: {productStateLabels[product.productState]}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
              </div>

              {product.images.length > 1 ? (
                <div className="grid gap-2 min-[520px]:grid-cols-4">
                  {product.images.map((image, index) => (
                    <div
                      key={image}
                      className="relative h-32 overflow-hidden border border-white/12 bg-zinc-950"
                    >
                      <Image
                        src={image}
                        alt={`${product.title} gallery image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className={
                          shouldContainImage(image, product.slug, product.category)
                            ? "object-contain p-2"
                            : "object-cover"
                        }
                      />
                      <span className="absolute left-2 top-2 bg-black/75 px-2 py-1 font-mono text-[10px] uppercase text-zinc-200">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col justify-between border border-white/15 bg-black/80 p-4 sm:p-5">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-blue-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-blue-300 sm:mt-6 sm:tracking-[0.24em]">
                  {product.category} / {product.japaneseTitle}
                </p>
                <h1 className="mt-3 max-w-full break-words text-3xl font-black italic uppercase leading-[0.9] text-white sm:text-6xl sm:leading-[0.86] xl:text-7xl 2xl:text-8xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-xl border-l-2 border-blue-400 pl-4 font-mono text-xs leading-5 text-zinc-300 sm:mt-5 sm:text-sm sm:leading-6">
                  {product.description}
                </p>
                <p className="mt-4 font-mono text-3xl text-white sm:mt-6">
                  {formatUsdPrice(product.price)}
                </p>
                <ProductDetailActions product={product} />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-2 border-t border-white/10 pt-4 min-[520px]:grid-cols-3">
                {[
                  ["STATUS", productStateLabels[product.productState]],
                  ["CHECKOUT", isPurchasable ? "SHOPIFY" : "NOT EXPOSED"],
                  ["ARCHIVE", product.archiveCode ?? product.slug],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 border border-white/10 p-3">
                    <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      {label}
                    </p>
                    <p className="mt-1 break-words font-mono text-xs uppercase text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#f4f1ff] px-4 py-8 text-black sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <div className="border border-black/15 bg-white/80 p-5 shadow-[0_24px_80px_rgba(12,9,45,0.16)] backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-violet-700">
              Product proof
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none sm:text-6xl">
              Mirror record
            </h2>
            <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-700">
              The visible unlock layer is still only interface residue. Real
              purchase access exists only when the Shopify variant table is
              mapped to this file.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {proofRows.map(([label, value]) => (
                <div
                  key={label}
                  className="border border-black/15 bg-white/70 p-3"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-sm font-black uppercase text-black">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-start gap-2">
            {[
              { Icon: ShieldCheck, label: "Variant IDs locked" },
              { Icon: LockKeyhole, label: "Local unlock visual only" },
              { Icon: Radio, label: "Shopify checkout route" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-violet-500/25 bg-white/80 p-4 font-mono text-xs font-black uppercase text-violet-950"
              >
                <Icon size={18} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="border-t border-white/10 bg-black px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
              Adjacent file
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
              Do not clean this up yet
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
