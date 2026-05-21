import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { growthKpis, metricDefinitions } from "@/data/growth-system";

export const metadata: Metadata = {
  title: "Metrics Scaffold",
  description: "Manual-first Action Replay growth and unlock metrics scaffold.",
  robots: {
    index: false,
    follow: false,
  },
};

const schemaBlocks = [
  {
    title: "DailySocialMetric",
    body: `{
  date: string;
  account: string;
  followers: number;
  follows: number;
  unfollows: number;
  saves: number;
  shares: number;
  comments: number;
  profileVisits: number;
  websiteClicks: number;
  notes: string;
}`,
  },
  {
    title: "UnlockEvent",
    body: `{
  code: string;
  source: "console" | "secret-page" | "qr" | "caption" | "story";
  path: string;
  occurredAt: string;
  sessionId?: string;
}`,
  },
  {
    title: "DropMetric",
    body: `{
  dropId: string;
  unitsAvailable: number;
  unitsSold: number;
  waitlistAdds: number;
  conversionRate: number;
  codeUses: number;
  selloutMinutes?: number;
}`,
  },
];

export default function MetricsPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/operator" className="ui-button">
          <ArrowLeft size={17} aria-hidden="true" />
          operator console
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="section-kicker">metrics / local scaffold</p>
            <h1 className="section-title">signal board</h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-300">
              Track the parts that prove cult growth: saves, shares, profile
              visits, unlock events, signups, product clicks, and drop
              conversion. Manual inputs first. Approved first-party events later.
            </p>
          </div>
          <div className="crt-panel p-4">
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-lime-200" aria-hidden="true" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-200">
                /api/unlock-events
              </p>
            </div>
            <p className="mt-3 font-mono text-xs leading-5 text-zinc-400">
              The endpoint validates code events and returns an accepted stub.
              Add storage only when analytics is ready.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
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
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {metricDefinitions.map((metric) => (
            <article key={metric.key} className="crt-panel p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-sky-200">
                {metric.key}
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                {metric.label}
              </h2>
              <p className="mt-3 font-mono text-xs leading-5 text-zinc-400">
                Source: {metric.source}
              </p>
              <p className="mt-2 border-l border-fuchsia-300/50 pl-3 font-mono text-xs leading-5 text-zinc-300">
                {metric.decision}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {schemaBlocks.map((block) => (
            <article key={block.title} className="crt-panel p-4">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-lime-200">
                schema
              </p>
              <h2 className="mt-2 text-xl font-black uppercase text-white">
                {block.title}
              </h2>
              <pre className="mt-4 overflow-x-auto border border-white/10 bg-black/75 p-3 font-mono text-[0.68rem] leading-5 text-sky-100">
                {block.body}
              </pre>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
