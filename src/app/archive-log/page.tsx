import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArrowLeft } from "lucide-react";
import { archiveLogEntries } from "@/data/residue";
import {
  FileStamp,
  AbsentMedia,
  InternalComment,
  ObsoleteWarning,
  PreservationNote,
} from "@/components/residue/residue-fragments";

export const metadata: Metadata = {
  title: "Archive Log",
  description:
    "A restoration log for recovered Action Replay files, missing images, changed copy, and preserved warnings.",
};

const stateClass = {
  restored: "text-lime-200",
  missing: "text-zinc-500",
  reverted: "text-sky-200",
  preserved: "text-amber-100",
  rejected: "text-fuchsia-200",
} as const;

export default function ArchiveLogPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link href="/archive" className="ui-button">
          <ArrowLeft size={17} aria-hidden="true" />
          recovered files
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="section-kicker">restore_log.txt / public mirror</p>
            <h1 className="section-title">archive log</h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
              Internal restoration notes exported with the archive. The log is
              incomplete, but the missing rows explain too much already.
            </p>
          </div>
          <div className="crt-panel p-4">
            <FileStamp label="build" value="MIRROR BUILD" />
            <p className="mt-3 font-mono text-xs leading-5 text-zinc-500">
              last clean sync failed at 02:14. page 17 still missing.
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden border border-white/10 bg-black/45">
          <div className="grid grid-cols-[8rem_6rem_1fr] border-b border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 sm:grid-cols-[12rem_7rem_9rem_1fr]">
            <span>time</span>
            <span>user</span>
            <span className="hidden sm:block">file</span>
            <span>action</span>
          </div>
          <div className="divide-y divide-white/10">
            {archiveLogEntries.map((entry) => (
              <article
                key={`${entry.at}-${entry.action}-${entry.file}`}
                className="grid gap-3 px-3 py-4 font-mono text-xs leading-5 sm:grid-cols-[12rem_7rem_9rem_1fr]"
              >
                <span className="text-zinc-500">{entry.at}</span>
                <span className="text-fuchsia-100/80">{entry.user}</span>
                <span className="text-sky-100/70">{entry.file}</span>
                <div>
                  <p
                    className={`tracking-[0.16em] ${entry.format === "lower" ? "lowercase" : "uppercase"} ${stateClass[entry.state]}`}
                  >
                    {entry.format === "bracket"
                      ? `[${entry.action}]`
                      : entry.action}
                  </p>
                  <InternalComment user={entry.user} className="mt-2">
                    {entry.note}
                  </InternalComment>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <ObsoleteWarning>
            DEV-02 reference removed then re-added. do not ship the label.
          </ObsoleteWarning>
          <PreservationNote>
            outdated scan preserved beside cleaner export. removing it changes
            the page spacing.
          </PreservationNote>
          <Link
            href="/secret/page-17-missing"
            className="border border-white/10 bg-black/40 p-3 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500 transition hover:border-sky-300/45 hover:text-sky-100"
          >
            <Archive size={15} className="mr-2 inline" aria-hidden="true" />
            attachment index still skips page 17
          </Link>
          <AbsentMedia
            label="voice memo unavailable"
            fileRef="audio/restore_room_0214.m4a"
            note="listed in restore log, removed from mirror before public sync."
          />
        </div>
      </div>
    </section>
  );
}
