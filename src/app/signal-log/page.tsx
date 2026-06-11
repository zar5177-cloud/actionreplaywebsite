import type { Metadata } from "next";
import Link from "next/link";
import { signalLog } from "@/data/signal-log";

export const metadata: Metadata = {
  title: "Signal Log",
  description:
    "Real Action Replay Shopify traffic spikes preserved as archive signal logs.",
};

export default function SignalLogPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="section-kicker">/signal-log</p>
        <h1 className="section-title">signal log</h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
          real Shopify sessions, stored before the archive forgets why anyone came here.
        </p>

        <div className="mt-7 grid gap-3">
          {signalLog.map((entry) => (
            <article
              key={`${entry.date}-${entry.sessions}`}
              className="border border-lime-300/20 bg-black/70 p-4 font-mono"
            >
              <div className="grid gap-3 sm:grid-cols-[9rem_1fr_auto] sm:items-center">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {entry.date}
                </p>
                <div>
                  <h2 className="text-sm uppercase tracking-[0.16em] text-lime-100">
                    {entry.signal}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {entry.note}
                  </p>
                </div>
                <p className="text-3xl font-black text-white">
                  {entry.sessions}
                  <span className="ml-2 text-xs font-normal uppercase tracking-[0.16em] text-zinc-500">
                    sessions
                  </span>
                </p>
              </div>
              {entry.href ? (
                <Link
                  href={entry.href}
                  className="mt-3 inline-flex text-[0.68rem] uppercase tracking-[0.18em] text-sky-200 underline underline-offset-4"
                >
                  open linked file
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
