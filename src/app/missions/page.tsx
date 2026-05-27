import type { Metadata } from "next";
import {
  AccountUniverseHero,
  EcosystemPageFrame,
  HiddenUnlockSection,
  MissionBoard,
  ProfileMetaFooter,
  RewardsRuleSection,
} from "@/components/account-system";

export const metadata: Metadata = {
  title: "Missions",
  description:
    "Action Replay daily missions, weekly missions, hidden achievements, seasonal rewards, XP, TIX, RC, and badges.",
};

export default function MissionsPage() {
  return (
    <EcosystemPageFrame>
      <AccountUniverseHero
        active="missions"
        eyebrow="missions / achievements / rewards"
        title="Mission Board"
        copy="Daily returns, uploads, referrals, purchases, reviews, tags, events, and hidden page discoveries all feed XP without turning the site into a trap."
      />
      <MissionBoard />
      <RewardsRuleSection />
      <HiddenUnlockSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}

