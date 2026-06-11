import type { Metadata } from "next";
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
import { ProductGallery } from "@/components/product-gallery";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { SignalSurvey } from "@/components/research/signal-survey";
import { archiveFiles } from "@/data/config/archive-files";
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
        .filter(
          (relatedProduct) =>
            relatedProduct.slug !== product.slug &&
            isPurchasableProduct(relatedProduct),
        )
        .slice(0, 2)
    : [];
  const detailRows = [
    ["File ID", product.archiveCode ?? product.badges[0] ?? product.id],
    ["Type", product.category === "tees" ? "Boxy tee file" : "Print artifact"],
    ["Drop", product.slug.includes("poster") ? "AR-003" : "AR-001"],
    [
      "Availability",
      productStateLabels[product.productState],
    ],
    [
      "Colorways",
      product.colors.map((color) => color.name).join(" / "),
    ],
    [
      "Sizes",
      product.sizes.join(" / "),
    ],
    ["Shipping", "Calculated at checkout"],
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
            <ProductGallery
              category={product.category}
              images={product.images}
              productId={product.id}
              slug={product.slug}
              stateLabel={productStateLabels[product.productState]}
              title={product.title}
            />

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
                <div className="mt-5 grid gap-2 border border-lime-300/25 bg-lime-300/10 p-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-lime-100 sm:grid-cols-2">
                  <span>FILE ID: {product.archiveCode ?? product.id}</span>
                  <span>STATUS: {productStateLabels[product.productState]}</span>
                  <span>DROP: {product.slug.includes("poster") ? "003" : "001"}</span>
                  <span>CLASS: wearable artifact</span>
                </div>
                <ProductDetailActions product={product} />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-2 border-t border-white/10 pt-4 min-[520px]:grid-cols-3">
                {[
                  ["Availability", productStateLabels[product.productState]],
                  ["Checkout", isPurchasable ? "Secure" : "Not for sale"],
                  ["Credit", product.slug.includes("poster") ? "15% with tee" : "15% with poster"],
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
              Product details
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none sm:text-6xl">
              Cut from the drop
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
              {product.slug.includes("poster")
                ? "AR-003 is the wall file from the same damaged Galaxy export: printed large, kept slightly wrong, and paired with AR-001 when the cart recognizes both artifacts."
                : "AR-001 is the first wearable file from Action Replay Studio: built from DS-era cheat code nostalgia, fake console mythology, and late-2000s game store energy."}
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {detailRows.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[8px] border border-black/15 bg-white/70 p-3"
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
              { Icon: ShieldCheck, label: "Secure Shopify checkout" },
              { Icon: LockKeyhole, label: "Support: support@shopactionreplay.com" },
              { Icon: Radio, label: "Tracking provided when fulfilled" },
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

      <section className="border-b border-white/10 bg-black px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(320px,0.45fr)]">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-200">
              trust file / boring on purpose
            </p>
            <div className="mt-4 grid gap-2">
              {[
                ["How does it fit?", "Boxy fit. Check the size guide before ordering and compare against a tee you already like."],
                ["When will it ship?", "Orders ship from the US. Tracking is provided when fulfilled."],
                ["Can I exchange sizes?", "For size issues, contact support@shopactionreplay.com quickly so the order can be handled plainly."],
                ["Is this limited?", "The archive does not repeat files exactly. If a run changes, the change gets named."],
                ["What comes with the order?", "The product ordered plus any active inserts/stickers available for that run."],
              ].map(([question, answer]) => (
                <details key={question} className="border border-white/10 bg-black/45 p-3">
                  <summary className="cursor-pointer font-mono text-xs font-black uppercase tracking-[0.14em] text-white">
                    {question}
                  </summary>
                  <p className="mt-2 font-mono text-xs leading-5 text-zinc-400">
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
                style files
              </p>
              <ul className="mt-4 grid gap-2 font-mono text-xs uppercase leading-5 text-zinc-400">
                {[
                  "baggy jeans",
                  "black cargos",
                  "zip hoodie layer",
                  "skate shoes",
                  "silver jewelry",
                ].map((item) => (
                  <li key={item}>/ {item}</li>
                ))}
              </ul>
            </div>
            <ReplayClubSignup
              compact
              placement={`product_${product.slug}`}
              source="product_page"
              title="NOT READY?"
              copy="join replay club for hidden discounts and future artifact alerts."
            />
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="border-t border-white/10 bg-black px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
              Adjacent piece
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
              Complete the capsule
            </h2>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SignalSurvey
        delayMs={20000}
        options={["shirt", "nostalgia", "logo", "instagram", "just looking"]}
        placement={`product_${product.slug}`}
        question="what made you open this file?"
        questionId={`product_click_reason_${product.slug}`}
      />

      <section className="border-t border-white/10 bg-black px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">
            related archive files
          </p>
          <h2 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
            complete the file
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {archiveFiles.slice(0, 3).map((file) => (
              <Link
                key={file.id}
                href={`/archive/${file.id}`}
                className="border border-white/10 bg-white/[0.03] p-4 transition hover:border-lime-300/50"
              >
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-lime-200">
                  {file.id} / {file.status ?? file.rarity}
                </p>
                <p className="mt-3 text-2xl font-black uppercase leading-none text-white">
                  {file.title}
                </p>
                <p className="mt-3 line-clamp-3 font-mono text-xs leading-5 text-zinc-500">
                  {file.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
