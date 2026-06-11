import type { Metadata } from "next";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { ReplayClubSignup } from "@/components/replay-club-signup";

export const metadata: Metadata = {
  title: "Replay Code Terminal",
  description:
    "Enter Action Replay codes to unlock archive files, system messages, and Replay Club access.",
};

export default function CodesPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div>
          <p className="section-kicker">/codes</p>
          <h1 className="section-title">replay code terminal</h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
            Old codes still work sometimes. The page will not explain why.
          </p>
          <div className="mt-6">
            <SecretCodeConsole />
          </div>
        </div>
        <ReplayClubSignup
          placement="codes_page"
          source="codes"
          title="SAVE FUTURE CODES"
          copy="join replay club to get hidden codes before the public grid notices."
        />
      </div>
    </section>
  );
}
