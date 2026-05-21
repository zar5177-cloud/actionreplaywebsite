"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Globe2,
  KeyRound,
  Radio,
  ShoppingBag,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { assetById } from "@/lib/assets-manifest";

type CommandMode = {
  id: string;
  label: string;
  title: string;
  copy: string;
  image: string;
  icon: LucideIcon;
  stats: string[];
  log: string[];
};

const commandModes: CommandMode[] = [
  {
    id: "unlock",
    label: "Unlock",
    title: "001 live now",
    copy: "The live mirror is open for the Galaxy tee. The other product files were left in place, not cleared.",
    image: assetById["galaxy-tee-editorial-blue"].src,
    icon: KeyRound,
    stats: ["1 live product", "Shopify checkout", "Online only"],
    log: ["BOOT DROP", "CHECK SIZE RUN", "OPEN CHECKOUT"],
  },
  {
    id: "override",
    label: "Override",
    title: "Print file not verified",
    copy: "The 24x36 promo print keeps exporting darker than the shop record. It stays archived until somebody checks it again.",
    image: assetById["action-replay-2026-promo-poster"].src,
    icon: Zap,
    stats: ["AR-003", "Wrong purple", "Mirror pending"],
    log: ["LOAD PRINT", "CHECK PURPLE", "DO NOT PUBLISH"],
  },
  {
    id: "replay",
    label: "Replay",
    title: "Galaxy tee is the wearable",
    copy: "The AR-001 tee carries the purple psychic cat graphic, chrome AR mark, sleeve hit, and cheat-the-game text.",
    image: assetById["galaxy-tee-editorial-shoulder"].src,
    icon: Radio,
    stats: ["Black / White", "Lookbook", "Archive"],
    log: ["REWIND SOURCE", "REPLACE CHARACTER", "EXPORT DROP ART"],
  },
];

const railAssets = [
  assetById["galaxy-tee-editorial-blue"].src,
  assetById["galaxy-tee-product"].src,
  assetById["action-replay-2026-promo-poster"].src,
  assetById["galaxy-tee-editorial-floor"].src,
];

export function DropConsole() {
  const [activeId, setActiveId] = useState(commandModes[0].id);
  const activeMode =
    commandModes.find((mode) => mode.id === activeId) ?? commandModes[0];
  const ActiveIcon = activeMode.icon;

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-white/15 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
            Drop console
          </p>
          <h2 className="mt-2 max-w-4xl text-4xl font-black uppercase leading-none text-white sm:text-6xl">
            Live file active
          </h2>
        </div>
        <Link
          href="/shop"
          className="cyber-frame inline-flex h-11 w-full items-center justify-center gap-2 bg-white px-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-blue-600 hover:text-white sm:w-auto sm:tracking-[0.16em]"
        >
          Enter shop <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <div className="noise-panel relative min-h-[520px] overflow-hidden border border-blue-400/50 bg-black">
          <Image
            src={activeMode.image}
            alt={`${activeMode.title} artwork`}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {commandModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = mode.id === activeMode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActiveId(mode.id)}
                  className={`cyber-frame inline-flex h-11 items-center gap-2 border px-3 font-mono text-xs font-black uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "border-lime-300 bg-lime-300 text-black"
                      : "border-white/25 bg-black/75 text-white hover:border-blue-300 hover:text-blue-200"
                  }`}
                >
                  <Icon size={15} />
                  {mode.label}
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-4 left-4 right-4 border border-white/20 bg-black/80 p-4 backdrop-blur-sm">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-blue-300">
              <ActiveIcon size={15} />
              {activeMode.label} mode
            </p>
            <h3 className="mt-2 max-w-3xl text-4xl font-black uppercase leading-none text-white">
              {activeMode.title}
            </h3>
            <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-300">
              {activeMode.copy}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="border border-white/15 bg-black p-5">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
                  Drop details
                </p>
                <h3 className="mt-2 break-words text-4xl font-black uppercase leading-none text-white">
                  {activeMode.label} path
                </h3>
              </div>
              <Sparkles className="shrink-0 text-lime-300" size={30} />
            </div>

            <div className="mt-5 grid gap-2 min-[560px]:grid-cols-3">
              {activeMode.stats.map((stat) => (
                <div key={stat} className="min-w-0 border border-blue-500/40 bg-blue-950/20 p-3">
                  <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Status
                  </p>
                  <p className="mt-2 break-words font-mono text-sm uppercase text-white">
                    {stat}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border border-white/15 bg-zinc-950 p-4">
              {activeMode.log.map((line, index) => (
                <div
                  key={line}
                  className="flex min-w-0 items-center gap-3 border-b border-white/10 py-3 font-mono text-xs uppercase text-zinc-300 last:border-b-0"
                >
                  <span className="grid size-7 place-items-center bg-blue-600 text-white">
                    0{index + 1}
                  </span>
                  <span className="min-w-0 break-words">{line}</span>
                  <BadgeCheck className="ml-auto shrink-0 text-lime-300" size={16} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/shop"
              className="cyber-frame flex min-h-28 min-w-0 items-end justify-between gap-3 border border-blue-400 bg-blue-600 p-4 text-white transition hover:bg-white hover:text-black"
            >
              <span className="font-mono text-sm font-black uppercase tracking-[0.16em]">
                Shop products
              </span>
              <ShoppingBag className="shrink-0" size={22} />
            </Link>
            <Link
              href="/shop"
              className="cyber-frame flex min-h-28 min-w-0 items-end justify-between gap-3 border border-white/20 bg-zinc-950 p-4 text-white transition hover:border-lime-300 hover:text-lime-200"
            >
              <span className="font-mono text-sm font-black uppercase tracking-[0.16em]">
                Shop AR-001
              </span>
              <Globe2 className="shrink-0" size={22} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 min-[520px]:grid-cols-4">
            {railAssets.map((asset, index) => (
              <button
                key={asset}
                type="button"
                onClick={() =>
                  setActiveId(commandModes[index % commandModes.length].id)
                }
                className="relative h-24 overflow-hidden border border-white/15 bg-black transition hover:border-blue-300"
                aria-label={`Load visual ${index + 1}`}
              >
                <Image
                  src={asset}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
