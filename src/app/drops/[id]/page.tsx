import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { drops } from "@/data/drops";

type DropPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return drops.map((drop) => ({ id: drop.id }));
}

export async function generateMetadata({ params }: DropPageProps): Promise<Metadata> {
  const { id } = await params;
  const drop = drops.find((item) => item.id === id);

  return {
    title: drop ? drop.name : "Drop file missing",
    description: drop
      ? `${drop.name} status: ${drop.status}`
      : "Action Replay drop file missing.",
  };
}

export default async function DropPage({ params }: DropPageProps) {
  const { id } = await params;
  const drop = drops.find((item) => item.id === id);

  if (!drop) {
    notFound();
  }

  return (
    <section className="px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-5xl border border-white/10 bg-black/70 p-5">
        <Link href="/drops" className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-lime-200">
          /drops
        </Link>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
          {drop.id} / {drop.status}
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
          {drop.name}
        </h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ["products", drop.products],
            ["campaigns", drop.campaignIds],
            ["codes", drop.codes],
            ["archive files", drop.archiveFileIds],
            ["creative", drop.creativeAssets],
          ].map(([label, values]) => (
            <div key={label as string} className="border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-600">
                {label as string}
              </p>
              <ul className="mt-3 grid gap-1 font-mono text-xs uppercase leading-5 text-zinc-300">
                {(values as string[]).map((value) => (
                  <li key={value}>/ {value}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
