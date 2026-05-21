import type { Metadata } from "next";
import { UnlockedGate } from "@/components/arg/unlocked-gate";

export const metadata: Metadata = {
  title: "Corrupted File",
  description:
    "A gated corrupted memory card file unlocked by the MEMORYCARD cheat code.",
};

export default function CorruptedFilePage() {
  return (
    <UnlockedGate
      requiredCode="MEMORYCARD"
      lockedTitle="memory card not detected"
      lockedCopy="Enter MEMORYCARD in the Action Replay input before opening this damaged save."
    >
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="crt-panel p-5 sm:p-8">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
              file_003 / recovered sector
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
              memory card not detected
            </h1>
            <div className="mt-6 grid gap-3 font-mono text-sm leading-6 text-zinc-300 sm:grid-cols-2">
              <p>
                Slot A reports empty. Slot B reports the same save with every
                name field overwritten by underscores.
              </p>
              <p>
                Inventory contains one locked tee, one missing poster, and a
                timestamp from a drop that has not happened yet.
              </p>
            </div>
            <pre className="mt-6 overflow-x-auto border border-white/10 bg-black/75 p-4 font-mono text-xs leading-6 text-sky-100">
{`SAVE_SLOT_A:
  wearer_id: ________
  item_ref: AR-002-MEMCARD-SLOT-A
  state: locked
  note: "do not format. wait for the next code."`}
            </pre>
          </div>
        </div>
      </section>
    </UnlockedGate>
  );
}
