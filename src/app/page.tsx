import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  Boxes,
  ClipboardList,
  Crown,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { FloatingDropShowcase } from "@/components/floating-drop-showcase";
import { HeroSection } from "@/components/hero-section";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { archiveFiles } from "@/data/config/archive-files";
import { brandSlogans } from "@/data/config/brand";
import { signalLog } from "@/data/signal-log";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ACTION REPLAY",
  description:
    "Shop the Action Replay Galaxy capsule and explore the recovered archive.",
};

export default async function Home() {
  const products = await getCatalogProducts();

  return (
    <>
      <HeroSection products={products} />

      <section className="border-b border-lime-300/20 bg-black px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_24rem] lg:items-start">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
              signal log / real shopify data
            </p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
              spike-based curiosity detected
            </h2>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
              306 sessions from May 10 to June 9. The archive does not have
              steady traffic yet. It has windows when people suddenly care.
            </p>
            <div className="mt-5 grid gap-2 md:grid-cols-4">
              {signalLog.map((entry) => (
                <Link
                  key={entry.date}
                  href={entry.href ?? "/signal-log"}
                  className="border border-white/10 bg-black/50 p-3 transition hover:border-lime-300/50"
                >
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-zinc-500">
                    {entry.date}
                  </p>
                  <p className="mt-2 font-mono text-3xl text-white">
                    {entry.sessions}
                  </p>
                  <p className="mt-2 font-mono text-[0.68rem] uppercase leading-5 text-lime-100">
                    {entry.signal}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          <ReplayClubSignup
            placement="homepage_signal_log"
            source="homepage"
            title="JOIN REPLAY CLUB"
            copy="hidden codes, early files, private drops. the next spike should not disappear."
          />
        </div>
      </section>

      <section className="hero-system relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.55fr)] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-sky-200">
              current capsule / limited issue
            </p>
            <h2 className="chrome-title mt-4 text-5xl font-black uppercase leading-[0.82] sm:text-7xl lg:text-[7rem]">
              Galaxy issue
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-xl">
              The tee and poster share the same purple artifact, the same bad
              export, the same late-night catalog page. Wear one. Keep the other
              on the wall.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="ui-button ui-button-hot">
                <ShoppingBag size={17} aria-hidden="true" />
                shop the drop
              </Link>
              <Link href="/archive" className="ui-button">
                <Archive size={17} aria-hidden="true" />
                archive
              </Link>
            </div>
          </div>
          <div className="rounded-[8px] border border-white/10 bg-black/55 p-5 shadow-[0_26px_80px_rgba(0,0,0,0.25)] backdrop-blur">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-lime-200">
              Pair credit
            </p>
            <p className="mt-3 text-3xl font-black uppercase leading-none text-white">
              Tee + poster saves 15%
            </p>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              The discount applies in the bag when both live pieces are added.
              Shipping and tax calculate securely at checkout.
            </p>
          </div>
        </div>
      </section>

      <FloatingDropShowcase products={products} />

      <section className="border-y border-sky-200/70 bg-[linear-gradient(180deg,#f8fdff_0%,#dff5ff_100%)] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-sky-800">
              player universe / access layer
            </p>
            <h2 className="mt-3 max-w-4xl text-5xl font-black uppercase leading-[0.84] text-slate-950 sm:text-7xl">
              Build your account like an old profile
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
              Member number, join date, XP, TIX, Replay Credits, owned files,
              uploads, referrals, badges, and catalog history. Not a rewards
              popup. A persistent player record.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/account",
                label: "profile",
                detail: "MEMBER #00821",
                icon: UserRound,
              },
              {
                href: "/catalog",
                label: "catalog",
                detail: "rarity / ownership",
                icon: Boxes,
              },
              {
                href: "/missions",
                label: "missions",
                detail: "XP / TIX / RC",
                icon: ClipboardList,
              },
              {
                href: "/replay-club",
                label: "replay club",
                detail: "members / scouts",
                icon: Crown,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-[8px] border border-sky-200 bg-white/78 px-4 py-4 font-mono text-xs font-black uppercase tracking-[0.12em] text-slate-800 shadow-[0_14px_34px_rgba(35,101,165,0.12)] transition hover:-translate-y-0.5 hover:border-sky-500 hover:text-sky-900"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[6px] border border-sky-200 bg-sky-50 text-sky-700">
                      <Icon size={18} />
                    </span>
                    <span className="grid min-w-0">
                      <span className="truncate">{item.label}</span>
                      <span className="mt-1 truncate text-[10px] font-normal text-slate-500">
                        {item.detail}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-sky-700">/</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="section-kicker">archive residue</div>
            <h2 className="section-title">older pieces still hum</h2>
          </div>
          <p className="text-sm leading-6 text-zinc-400">
            A few recovered fragments stay visible around the shop. They should
            feel found, not explained.
          </p>
        </div>
        <div className="mx-auto mt-5 grid max-w-7xl gap-3 md:grid-cols-2 lg:grid-cols-5">
          {archiveFiles.slice(0, 5).map((file) => (
            <Link
              key={file.id}
              href="/archive"
              className="rounded-[8px] border border-white/10 bg-black/45 p-3 transition hover:border-sky-300/50 hover:bg-sky-950/20"
            >
              <p className="mt-2 min-h-12 text-lg font-black uppercase leading-none text-white">
                {file.title}
              </p>
              <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-lime-200">
                {file.rarity}
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
