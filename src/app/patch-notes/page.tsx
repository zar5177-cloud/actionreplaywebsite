import type { Metadata } from "next";
import Link from "next/link";
import { patchNotes } from "@/data/patch-notes";

export const metadata: Metadata = {
  title: "Patch Notes",
  description: "Action Replay archive patch notes and tiny system updates.",
};

export default function PatchNotesPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="section-kicker">/patch-notes</p>
        <h1 className="section-title">patch notes</h1>
        <div className="mt-7 grid gap-4">
          {patchNotes.map((note) => (
            <article key={note.version} className="border border-white/10 bg-black/70 p-4">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
                <span className="text-lime-200">{note.version}</span>
                <span>{note.date}</span>
              </div>
              <h2 className="mt-3 text-3xl font-black uppercase leading-none text-white">
                {note.title}
              </h2>
              <ul className="mt-4 grid gap-2 font-mono text-xs leading-5 text-zinc-400">
                {note.notes.map((item) => (
                  <li key={item}>/ {item}</li>
                ))}
              </ul>
              {note.href ? (
                <Link href={note.href} className="ui-button mt-4">
                  open affected file
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
