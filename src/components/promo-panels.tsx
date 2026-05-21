import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Globe2, LockKeyhole, Radio } from "lucide-react";
import { currentDrop } from "@/lib/brand-data";
import { assetById } from "@/lib/assets-manifest";

export function DropPanel() {
  return (
    <section className="mx-auto grid max-w-[1600px] min-w-0 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1.1fr)] lg:px-8">
      <div className="relative min-h-[520px] overflow-hidden border border-white/15 bg-black">
        <Image
          src={currentDrop.heroAsset}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-left opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
            001 live now
          </p>
          <h2 className="mt-2 max-w-xl text-5xl font-black uppercase leading-none text-white">
            Galaxy tee. Locked card.
          </h2>
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        <div className="border border-blue-400/60 bg-black p-5">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
                Live file
              </p>
              <h2 className="mt-2 break-words text-4xl font-black uppercase leading-none text-white">
                {currentDrop.title}
              </h2>
            </div>
            <Radio className="shrink-0 text-lime-300" size={34} />
          </div>
          <p className="my-5 max-w-2xl font-mono text-sm leading-6 text-zinc-300">
            {currentDrop.copy}
          </p>
          <div className="grid gap-2 text-center min-[420px]:grid-cols-3">
            {["STATUS: UNLOCKED", "AR-001 ACTIVE", "AR-003 PRINT LIVE"].map((label) => (
              <div
                key={label}
                className="min-w-0 border border-blue-500/60 bg-black/70 px-2 py-3 shadow-[0_0_28px_rgba(0,80,255,0.25)] sm:p-3"
              >
                <div className="font-mono text-xs font-black uppercase tracking-[0.14em] text-blue-100">
                  {label}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/shop"
            className="mt-5 inline-flex max-w-full items-center gap-2 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-blue-600 hover:text-white sm:h-11 sm:tracking-[0.16em]"
          >
            Shop live files <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
            {[
            ["Mirror active", "AR-001 + AR-003 checkout", LockKeyhole],
            ["Worldwide shipping", "Every order leaves through Shopify", Globe2],
            ["Live release", "Pair credit mapped", BadgeCheck],
          ].map(([title, copy, Icon]) => (
            <div key={String(title)} className="border border-white/15 bg-zinc-950 p-4">
              <Icon className="text-blue-300" size={24} />
              <p className="mt-4 font-mono text-sm uppercase text-white">
                {String(title)}
              </p>
              <p className="mt-2 font-mono text-xs leading-5 text-zinc-500">
                {String(copy)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VisualWall() {
  const assets = [
    assetById["galaxy-tee-product"].src,
    assetById["action-replay-2026-promo-poster"].src,
    assetById["galaxy-tee-model-01"].src,
    assetById["galaxy-tee-model-02"].src,
  ];

  return (
    <section className="mx-auto grid max-w-[1600px] gap-3 px-4 pb-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {assets.map((asset, index) => (
        <div
          key={asset}
          className={`relative min-h-[320px] overflow-hidden border border-white/15 bg-black ${
            index === 1 ? "lg:col-span-2" : ""
          }`}
        >
          <Image
            src={asset}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
          <div className="scanline absolute inset-0" />
        </div>
      ))}
    </section>
  );
}
