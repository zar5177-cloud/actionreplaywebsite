import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignLandingTracker } from "@/components/campaign-landing-tracker";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { landingPages } from "@/data/landing-pages";
import { getCatalogProduct } from "@/lib/catalog";
import { formatUsdPrice } from "@/lib/money";

type CampaignLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return landingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: CampaignLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = landingPages.find((item) => item.slug === slug);

  if (!page) return { title: "Campaign file missing" };

  return {
    title: page.headline,
    description: page.subhead,
  };
}

export default async function CampaignLandingPage({
  params,
}: CampaignLandingPageProps) {
  const { slug } = await params;
  const page = landingPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  const product = page.productHandle
    ? await getCatalogProduct(page.productHandle)
    : null;
  const destination =
    page.destination ?? (product ? `/shop/${product.slug}` : "/archive");

  return (
    <section className="px-4 py-10 sm:px-6">
      <CampaignLandingTracker campaign={page.campaign} slug={page.slug} />
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_24rem]">
        <article className="border border-sky-300/30 bg-black/72 p-5 sm:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200">
            /r/{page.slug} / {page.campaign}
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
            {page.headline}
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm uppercase leading-6 text-zinc-300">
            {page.subhead}
          </p>
          {product ? (
            <div className="mt-6 grid gap-2 border border-white/10 bg-white/[0.03] p-4 font-mono text-xs uppercase tracking-[0.12em] text-zinc-300 sm:grid-cols-3">
              <span>{product.title}</span>
              <span>{formatUsdPrice(product.price)}</span>
              <span>{product.productState}</span>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={destination} className="ui-button ui-button-hot">
              {page.theme === "cheat" ? "enter code" : "open file"}
            </Link>
            <Link href="/archive" className="ui-button">
              archive
            </Link>
          </div>
        </article>
        <ReplayClubSignup
          placement={`campaign_${page.slug}`}
          source="campaign_landing"
          title="SAVE THIS SIGNAL"
          copy="join replay club so the next file does not depend on the algorithm finding you twice."
        />
      </div>
    </section>
  );
}
