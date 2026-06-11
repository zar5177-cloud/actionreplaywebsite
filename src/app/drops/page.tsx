import type { Metadata } from "next";
import Link from "next/link";
import { drops } from "@/data/drops";

export const metadata: Metadata = {
  title: "Drops",
  description: "Action Replay drop operating system and archive release states.",
};

export default function DropsPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">/drops</p>
        <h1 className="section-title">drop os</h1>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {drops.map((drop) => (
            <Link
              key={drop.id}
              href={`/drops/${drop.id}`}
              className="border border-white/10 bg-black/70 p-5 transition hover:border-lime-300/50"
            >
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-lime-200">
                {drop.id} / {drop.status}
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none text-white">
                {drop.name}
              </h2>
              <p className="mt-4 font-mono text-xs uppercase leading-5 text-zinc-500">
                {drop.products.join(" / ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
