import type { Metadata } from "next";
import { EventCodeHunt } from "@/components/arg/event-code-hunt";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { SystemLogList } from "@/components/arg/system-log-list";
import { hiddenEvent } from "@/data/config/event";

export const metadata: Metadata = {
  title: "Hidden Event Active",
  description:
    "Search the hidden Action Replay event page for a buried SHINY code.",
};

export default function HiddenEventPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="section-kicker">event flag / active</p>
            <h1 className="section-title">{hiddenEvent.title}</h1>
            <p className="mt-4 max-w-2xl font-mono text-base lowercase leading-7 text-zinc-300">
              {hiddenEvent.dek}
            </p>
            <p className="mt-3 inline-flex border border-fuchsia-300/45 bg-fuchsia-400/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-100">
              {hiddenEvent.warning}
            </p>
          </div>
          <div className="crt-panel p-4 sm:p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
              {hiddenEvent.countdownLabel}
            </p>
            <p className="mt-3 font-mono text-4xl text-white">
              {hiddenEvent.countdownValue}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_22rem]">
          <EventCodeHunt />
          <div className="grid content-start gap-4">
            <SystemLogList logs={hiddenEvent.logs} />
            <SecretCodeConsole />
          </div>
        </div>
      </div>
    </section>
  );
}
