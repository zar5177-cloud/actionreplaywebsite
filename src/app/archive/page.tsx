import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveGrid } from "@/components/arg/archive-grid";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { archiveFiles } from "@/data/config/archive-files";

export const metadata: Metadata = {
  title: "Recovered Archive",
  description:
    "Browse recovered Action Replay files, corrupted promo fragments, and hidden event records.",
};

export default function ArchivePage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <p className="section-kicker">/archive/index.html</p>
            <h1 className="section-title">recovered files</h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
              Five files were pulled from a dead mirror. The thumbnails are
              damaged, timestamps disagree, and one record keeps reporting an
              active event.
            </p>
            <Link
              href="/archive-log"
              className="mt-4 inline-flex border border-white/10 bg-black/40 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500 transition hover:border-sky-300/45 hover:text-sky-100"
            >
              restore_log.txt
            </Link>
          </div>
          <SecretCodeConsole />
        </div>

        <div className="mt-7">
          <ArchiveGrid files={archiveFiles} />
        </div>
        <div className="mt-7">
          <ReplayClubSignup
            placement="archive_page_bottom"
            source="archive"
            title="REQUEST REPLAY CLUB CLEARANCE"
            copy="some locked files do not open from the public grid. save your contact before the next window closes."
          />
        </div>
      </div>
    </section>
  );
}
