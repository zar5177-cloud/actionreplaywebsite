import type { Metadata } from "next";
import Link from "next/link";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";

export const metadata: Metadata = {
  title: "Cheat Code Streetwear",
  description:
    "Cheat code streetwear, nostalgic gaming clothing, DS-era archive files, and Action Replay Studio artifacts.",
};

export default function CheatCodeStreetwearPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_24rem]">
        <article className="border border-white/10 bg-black/70 p-5 sm:p-7">
          <p className="section-kicker">/cheat-code-streetwear</p>
          <h1 className="section-title">cheat code streetwear</h1>
          <p className="mt-5 font-mono text-sm leading-7 text-zinc-300">
            Action Replay is built around the old language of unlocks, hidden
            menus, cheat cartridges, save files, console retail, and late-2000s
            internet residue.
          </p>
          <p className="mt-4 font-mono text-sm leading-7 text-zinc-400">
            AR-001 is the first wearable artifact: a graphic tee treated like a
            recovered file, not a normal logo item.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/codes" className="ui-button">
              enter code
            </Link>
            <Link href="/replay-club" className="ui-button ui-button-hot">
              join replay club
            </Link>
          </div>
        </article>
        <SecretCodeConsole />
      </div>
    </section>
  );
}
