import type { Metadata } from "next";
import {
  AccountUniverseHero,
  EcosystemPageFrame,
  MissionBoard,
  ProfileMetaFooter,
  ReplayClubSystem,
  RewardsRuleSection,
  UploadReferralSection,
} from "@/components/account-system";
import { ReplayClubSignup } from "@/components/replay-club-signup";

export const metadata: Metadata = {
  title: "Replay Club",
  description:
    "Replay Club membership, player roles, contributor benefits, upload features, affiliate codes, events, and member-only rewards.",
};

export default function ReplayClubPage() {
  return (
    <EcosystemPageFrame>
      <AccountUniverseHero
        active="club"
        eyebrow="replay club / member layer"
        title="Replay Club"
        copy="Private codes. Early files. Hidden drops. Archive access. Not a newsletter. Not influencer machinery."
      />
      <section className="mx-auto grid max-w-[1600px] gap-4 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8">
        <div className="border border-slate-300 bg-white/80 p-5 text-slate-950">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-800">
            access tiers
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["LEVEL 001", "EMAIL ACCESS", "hidden codes + early drop alerts"],
              ["LEVEL 002", "CUSTOMER ACCESS", "post-purchase files + private restocks"],
              ["LEVEL 003", "ARCHIVE ACCESS", "future members-only artifacts"],
            ].map(([level, title, copy]) => (
              <div key={level} className="border border-slate-300 bg-white p-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-sky-700">
                  {level}
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase leading-none">
                  {title}
                </h2>
                <p className="mt-3 font-mono text-xs uppercase leading-5 text-slate-500">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
        <ReplayClubSignup
          placement="replay_club_page"
          source="replay_club"
          title="ENTER EMAIL TO REQUEST CLEARANCE"
          copy="after signup, the first code appears. later files may not repeat."
        />
      </section>
      <ReplayClubSystem />
      <UploadReferralSection />
      <MissionBoard heading="club missions" showHidden />
      <RewardsRuleSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}
