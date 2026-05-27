import type { Metadata } from "next";
import {
  AccountUniverseHero,
  AdminSystemDashboard,
  EcosystemPageFrame,
  HiddenUnlockSection,
  MissionBoard,
  ProfileMetaFooter,
} from "@/components/account-system";

export const metadata: Metadata = {
  title: "Admin System",
  description:
    "Action Replay admin scaffold for users, XP, currencies, rewards, uploads, hidden rewards, referrals, missions, and discount multipliers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <EcosystemPageFrame>
      <AccountUniverseHero
        active="admin"
        eyebrow="operator admin / scalable controls"
        title="Admin"
        copy="A private control surface for the account universe: users, XP, TIX, RC, product flags, uploads, rewards, hidden unlocks, referrals, missions, moderation, and discount multipliers."
      />
      <AdminSystemDashboard />
      <MissionBoard heading="mission controls" showHidden />
      <HiddenUnlockSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}

