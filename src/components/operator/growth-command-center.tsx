import Link from "next/link";
import {
  Archive,
  BarChart3,
  CalendarDays,
  FileText,
  LockKeyhole,
  Radio,
} from "lucide-react";
import {
  dailyChecklist,
  growthKpis,
  nextSevenDaySprint,
  operatorCalendarPreview,
  residueMarkers,
  sideAccountBriefs,
} from "@/data/growth-system";
import { ResidueInjector } from "./residue-injector";

const docLinks = [
  {
    label: "Strategy Doc",
    href: "/operator/docs/strategy",
    note: "operating rules, engine, sprint",
  },
  {
    label: "Universe Bible",
    href: "/operator/docs/account-universe",
    note: "side accounts and post examples",
  },
  {
    label: "Comment Bank",
    href: "/operator/docs/comment-caption-bank",
    note: "manual comment and caption language",
  },
  {
    label: "Templates",
    href: "/operator/docs/templates-and-archives",
    note: "leaks, fake docs, proof shots",
  },
  {
    label: "Drop System",
    href: "/operator/docs/drop-unlock-outreach-metrics",
    note: "scarcity, outreach, metrics schema",
  },
  {
    label: "Residue Layer",
    href: "/operator/docs/human-residue-layer",
    note: "scars, drift, dead experiments",
  },
  {
    label: "30-Day Calendar",
    href: "/operator/docs/content-calendar-30-days",
    note: "12PM / 3PM / 9PM runbook",
  },
];

export function GrowthCommandCenter() {
  return (
    <div className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-5 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <p className="section-kicker">operator console / noindex</p>
            <h1 className="section-title">growth archive os</h1>
            <p className="mt-4 max-w-3xl font-mono text-sm leading-6 text-zinc-300">
              Internal runbook for cult growth through recovered files, manual
              community work, hidden unlocks, and product proof that looks like
              it survived the wrong folder.
            </p>
          </div>
          <div className="crt-panel p-4">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
              safety lock
            </p>
            <p className="mt-3 font-mono text-sm leading-6 text-zinc-300">
              Manual only. No bots, scraping, mass DMs, engagement pods, fake
              testimonials, or impersonation of real publications.
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {growthKpis.map((kpi) => (
            <div key={kpi.label} className="crt-panel p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                {kpi.label}
              </p>
              <p className="mt-2 font-mono text-3xl text-white">{kpi.value}</p>
              <p className="mt-2 font-mono text-xs leading-5 text-zinc-400">
                {kpi.note}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,0.55fr)]">
          <div className="crt-panel p-4 sm:p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Radio size={18} className="text-sky-200" aria-hidden="true" />
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
                  daily loop
                </p>
                <h2 className="text-2xl font-black uppercase text-white">
                  do the same ritual, never the same post
                </h2>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {dailyChecklist.map((item) => (
                <div
                  key={`${item.time}-${item.action}`}
                  className="grid gap-3 border border-white/10 bg-white/[0.03] p-3 font-mono text-xs leading-5 sm:grid-cols-[4rem_5rem_1fr]"
                >
                  <span className="text-lime-200">{item.time}</span>
                  <span className="uppercase text-sky-200">{item.owner}</span>
                  <span className="text-zinc-300">{item.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="crt-panel p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <LockKeyhole size={18} className="text-fuchsia-200" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase text-white">
                sprint 001
              </h2>
            </div>
            <ol className="mt-4 grid gap-2">
              {nextSevenDaySprint.map((item, index) => (
                <li
                  key={item}
                  className="border border-white/10 bg-black/45 p-3 font-mono text-xs leading-5 text-zinc-300"
                >
                  <span className="mr-2 text-fuchsia-200">
                    D{String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4">
            <p className="section-kicker">human residue pass</p>
            <h2 className="text-4xl font-black uppercase leading-none text-white sm:text-6xl">
              make it feel used before found
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {residueMarkers.map((marker) => (
              <article key={marker.label} className="crt-panel p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-fuchsia-200">
                  residue marker
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase text-white">
                  {marker.label}
                </h3>
                <p className="mt-3 font-mono text-xs leading-5 text-zinc-400">
                  {marker.trace}
                </p>
                <p className="mt-3 border-l border-lime-300/45 pl-3 font-mono text-xs leading-5 text-zinc-300">
                  {marker.use}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <ResidueInjector />
        </section>

        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-kicker">side-account save slots</p>
              <h2 className="text-4xl font-black uppercase leading-none text-white sm:text-6xl">
                six accounts, six defects
              </h2>
            </div>
            <Link href="/operator/metrics" className="ui-button">
              <BarChart3 size={17} aria-hidden="true" />
              metrics scaffold
            </Link>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {sideAccountBriefs.map((account) => (
              <article key={account.handle} className="crt-panel p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-lime-200">
                  @{account.handle}
                </p>
                <h3 className="mt-2 text-2xl font-black uppercase text-white">
                  {account.role}
                </h3>
                <p className="mt-3 font-mono text-xs leading-5 text-zinc-400">
                  {account.bio}
                </p>
                <div className="mt-4 grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
                  <p className="border border-white/10 p-2 text-sky-200">
                    {account.cadence}
                  </p>
                  <p className="border border-white/10 p-2 text-zinc-400">
                    {account.defect}
                  </p>
                </div>
                <ul className="mt-4 grid gap-2">
                  {account.postSeeds.map((seed) => (
                    <li
                      key={seed}
                      className="border-l border-fuchsia-300/45 pl-3 font-mono text-xs leading-5 text-zinc-300"
                    >
                      {seed}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(20rem,0.55fr)]">
          <div className="crt-panel p-4 sm:p-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <CalendarDays size={18} className="text-sky-200" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase text-white">
                first seven days
              </h2>
            </div>
            <div className="mt-4 grid gap-2">
              {operatorCalendarPreview.map((item) => (
                <div
                  key={item.day}
                  className="grid gap-2 border border-white/10 bg-white/[0.03] p-3 font-mono text-xs leading-5 md:grid-cols-[4rem_1fr_1fr_1fr]"
                >
                  <span className="text-lime-200">D{item.day}</span>
                  <span className="text-white">{item.primary}</span>
                  <span className="text-zinc-300">{item.secondary}</span>
                  <span className="text-zinc-500">{item.night}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="crt-panel p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <Archive size={18} className="text-lime-200" aria-hidden="true" />
              <h2 className="text-2xl font-black uppercase text-white">
                repo files
              </h2>
            </div>
            <div className="mt-4 grid gap-2">
              {docLinks.map((doc) => (
                <Link
                  key={doc.label}
                  href={doc.href}
                  className="border border-white/10 bg-black/45 p-3 transition hover:border-sky-300/50"
                >
                  <span className="flex items-center gap-2 font-mono text-xs uppercase text-sky-200">
                    <FileText size={14} aria-hidden="true" />
                    {doc.label}
                  </span>
                  <span className="mt-1 block font-mono text-[0.68rem] leading-5 text-zinc-500">
                    {doc.note}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
