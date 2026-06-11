import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { ShareArchiveLink } from "@/components/share-archive-link";

export const metadata: Metadata = {
  title: "Go",
  description: "Action Replay link-in-bio command page.",
  robots: {
    index: false,
    follow: true,
  },
};

const links = [
  ["SHOP AR-001", "/shop/action-replay-galaxy-tee?utm_source=instagram&utm_medium=bio&utm_campaign=ar001_repush_2026_06&utm_content=go_shop_ar001"],
  ["ENTER ARCHIVE", "/archive?utm_source=instagram&utm_medium=bio&utm_campaign=archive_depth_2026_06&utm_content=go_archive"],
  ["ENTER CODE", "/codes?utm_source=instagram&utm_medium=bio&utm_campaign=hidden_code_2026_06&utm_content=go_codes"],
  ["SIGNAL LOG", "/signal-log?utm_source=instagram&utm_medium=bio&utm_campaign=signal_log_2026_06&utm_content=go_signal_log"],
] as const;

export default function GoPage() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200">
          /go
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white">
          Action Replay
        </h1>
        <p className="mt-3 font-mono text-xs uppercase leading-5 text-zinc-400">
          link page copied from the archive because the normal one felt too clean.
        </p>
        <div className="mt-6 grid gap-3">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex min-h-14 items-center justify-between border border-white/12 bg-black/70 px-4 font-mono text-sm font-black uppercase tracking-[0.14em] text-white transition hover:border-lime-300/60 hover:text-lime-100"
            >
              {label}
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <ReplayClubSignup compact placement="go_page" source="go" />
        </div>
        <div className="mt-3">
          <ShareArchiveLink placement="go_page" path="/go" />
        </div>
      </div>
    </section>
  );
}
