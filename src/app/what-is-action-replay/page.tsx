import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What Is Action Replay Studio?",
  description:
    "Action Replay Studio is a nostalgia-driven clothing archive inspired by cheat codes, DS-era gaming, corrupted files, and 2000s console culture.",
};

export default function WhatIsActionReplayPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-4xl border border-white/10 bg-black/70 p-5 sm:p-7">
        <p className="section-kicker">/what-is-action-replay</p>
        <h1 className="section-title">what is action replay?</h1>
        <p className="mt-5 font-mono text-sm leading-7 text-zinc-300">
          Action Replay Studio is a nostalgia-driven clothing project built from
          cheat codes, corrupted files, fake console memories, and the feeling of
          discovering something hidden in an old game case.
        </p>
        <p className="mt-4 font-mono text-sm leading-7 text-zinc-400">
          The products are treated like recovered files: tees, posters, stickers,
          codes, and locked archive objects that happen to exist in the real
          world.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/archive" className="ui-button">
            enter archive
          </Link>
          <Link href="/shop/action-replay-galaxy-tee" className="ui-button ui-button-hot">
            shop AR-001
          </Link>
        </div>
      </article>
    </section>
  );
}
