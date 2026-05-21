"use client";

import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { residueInjector } from "@/data/residue";

function pick<T>(items: readonly T[], offset: number) {
  return items[offset % items.length];
}

function makeSeed() {
  return Math.floor(Math.random() * 100000);
}

export function ResidueInjector() {
  const [seed, setSeed] = useState(214);

  const output = useMemo(
    () => ({
      timestamp: pick(residueInjector.timestamps, seed),
      warning: pick(residueInjector.warnings, seed + 1),
      fileNote: pick(residueInjector.fileNotes, seed + 2),
      missingReference: pick(residueInjector.missingReferences, seed + 3),
      duplicateFileName: pick(residueInjector.duplicateFileNames, seed + 4),
      productLabel: pick(residueInjector.obsoleteProductLabels, seed + 5),
      slogan: pick(residueInjector.tinyEmotionalSlogans, seed + 6),
      routeIdea: pick(residueInjector.hiddenRouteIdeas, seed + 7),
      maintainerHabit: pick(residueInjector.maintainerHabits, seed + 8),
      deadNavigation: pick(residueInjector.deadNavigation, seed + 9),
      texturePrompt: pick(residueInjector.texturePrompts, seed + 10),
      sourceSlot: pick(residueInjector.sourceMaterialSlots, seed + 11),
      bannedPhrase: pick(residueInjector.bannedPhrases, seed + 12),
    }),
    [seed],
  );

  return (
    <section className="crt-panel p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
            residue injector
          </p>
          <h2 className="text-2xl font-black uppercase text-white">
            generate one scar, then stop
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setSeed(makeSeed())}
          className="ui-button"
        >
          <RefreshCcw size={17} aria-hidden="true" />
          reroll
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {[
          ["timestamp", output.timestamp],
          ["warning", output.warning],
          ["file note", output.fileNote],
          ["missing ref", output.missingReference],
          ["duplicate", output.duplicateFileName],
          ["label", output.productLabel],
          ["small line", output.slogan],
          ["route", output.routeIdea],
          ["maintainer", output.maintainerHabit],
          ["dead nav", output.deadNavigation],
          ["texture", output.texturePrompt],
          [
            "source slot",
            `${output.sourceSlot.label}: ${output.sourceSlot.currentState}`,
          ],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border border-white/10 bg-black/45 p-3 font-mono text-xs leading-5"
          >
            <p className="uppercase tracking-[0.18em] text-zinc-600">{label}</p>
            <p className="mt-1 text-zinc-200">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 border-l border-fuchsia-300/45 pl-3 font-mono text-xs leading-5 text-zinc-500">
        Avoid: <span className="text-fuchsia-100/80">{output.bannedPhrase}</span>
      </p>
    </section>
  );
}
