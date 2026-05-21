import type { Metadata } from "next";
import { UnlockedGate } from "@/components/arg/unlocked-gate";
import { brandManifesto } from "@/data/config/manifesto";

export const metadata: Metadata = {
  title: "Hidden Manifesto",
  description:
    "The hidden Action Replay brand manifesto unlocked by the DONTCHEAT code.",
};

export default function ManifestoPage() {
  return (
    <UnlockedGate
      requiredCode="DONTCHEAT"
      lockedTitle="manifesto locked"
      lockedCopy="Enter DONTCHEAT in the Action Replay input to restore this hidden file."
    >
      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="crt-panel p-5 sm:p-8">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-fuchsia-200">
              hidden sector / manifesto.txt
            </p>
            <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
              don&apos;t cheat the player
            </h1>
            <div className="mt-8 space-y-5">
              {brandManifesto.map((line) => (
                <p
                  key={line}
                  className="border-l border-sky-300/40 pl-4 font-mono text-sm leading-7 text-zinc-300 sm:text-base"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </UnlockedGate>
  );
}
