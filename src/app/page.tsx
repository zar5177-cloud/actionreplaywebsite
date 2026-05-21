import type { Metadata } from "next";
import Link from "next/link";
import { Archive, Radio, ShoppingBag } from "lucide-react";
import { BootSequence } from "@/components/arg/boot-sequence";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { UnlockAlertSignup } from "@/components/arg/unlock-alert-signup";
import { FloatingDropShowcase } from "@/components/floating-drop-showcase";
import { HeroSection } from "@/components/hero-section";
import { LiveShopGrid } from "@/components/live-shop-grid";
import {
  FileStamp,
  ObsoleteWarning,
  UnlockHintFragment,
} from "@/components/residue/residue-fragments";
import { archiveFiles } from "@/data/config/archive-files";
import { brandSlogans } from "@/data/config/brand";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ACTION REPLAY",
  description:
    "Enter the hidden Action Replay archive, recover corrupted files, and unlock the current drop.",
};

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <>
      <HeroSection products={products} />

      <section className="hero-system relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.65fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
              recovered cheat archive / additive hidden layer
            </p>
            <h2 className="chrome-title mt-4 text-5xl font-black uppercase leading-[0.82] sm:text-7xl lg:text-[7rem]">
              hidden archive
            </h2>
            <p className="mt-5 max-w-2xl font-mono text-base lowercase leading-7 text-zinc-300 sm:text-xl">
              don&apos;t cheat the player. cheat the game.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/archive" className="ui-button ui-button-hot">
                <Archive size={17} aria-hidden="true" />
                enter archive
              </Link>
              <Link href="/hidden-event" className="ui-button">
                <Radio size={17} aria-hidden="true" />
                check for hidden event
              </Link>
              <Link href="/shop" className="ui-button">
                <ShoppingBag size={17} aria-hidden="true" />
                shop working drop
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <FileStamp label="build" value="MIRROR BUILD 0.7" />
              <FileStamp label="last verified" value="2007" />
              <UnlockHintFragment href="/secret/0214">
                02:14
              </UnlockHintFragment>
            </div>
          </div>
          <BootSequence />
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,0.55fr)]">
          <SecretCodeConsole />
          <UnlockAlertSignup />
        </div>
      </section>

      <FloatingDropShowcase products={products} />
      <LiveShopGrid products={products} />

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="section-kicker">archive signal</div>
            <h2 className="section-title">recovered files are changing</h2>
          </div>
          <p className="font-mono text-sm leading-6 text-zinc-400">
            The front page only shows the cleanest fragments. The rest is in the
            archive, forum mirror, and hidden event frame.
          </p>
        </div>
        <div className="mx-auto mt-4 max-w-7xl">
          <ObsoleteWarning>
            do not run on silver model. warning preserved from first sticker.
          </ObsoleteWarning>
        </div>
        <div className="mx-auto mt-5 grid max-w-7xl gap-3 md:grid-cols-2 lg:grid-cols-5">
          {archiveFiles.map((file) => (
            <Link
              key={file.id}
              href="/archive"
              className="border border-white/10 bg-black/45 p-3 transition hover:border-sky-300/50 hover:bg-sky-950/20"
            >
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
                {file.fileName}
              </p>
              <p className="mt-2 min-h-12 text-lg font-black uppercase leading-none text-white">
                {file.title}
              </p>
              <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lime-200">
                {file.rarity}
              </p>
              <p className="mt-3 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-zinc-600">
                restored from damaged export
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
