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
        copy="This is the member layer, not influencer machinery: players, collectors, contributors, scouts, testers, and archive members earning access through real participation."
      />
      <ReplayClubSystem />
      <UploadReferralSection />
      <MissionBoard heading="club missions" showHidden />
      <RewardsRuleSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}

