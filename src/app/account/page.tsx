import type { Metadata } from "next";
import {
  AccountProfileSection,
  AccountQuickLinks,
  AccountUniverseHero,
  BadgeShelf,
  EcosystemPageFrame,
  InventoryShelf,
  LevelLadder,
  MissionBoard,
  ProfileMetaFooter,
  UploadReferralSection,
} from "@/components/account-system";

export const metadata: Metadata = {
  title: "Player Account",
  description:
    "Action Replay player profile, XP, currencies, badges, inventory, uploads, referrals, and account seniority.",
};

export default function AccountPage() {
  return (
    <EcosystemPageFrame>
      <AccountUniverseHero
        active="account"
        eyebrow="player profile / persistent account"
        title="Member #00821"
        copy="A profile should feel like an old online game account: join date, level, collection history, small currencies, weird badges, and enough seniority that the account itself becomes an artifact."
      />
      <AccountProfileSection />
      <AccountQuickLinks />
      <BadgeShelf />
      <InventoryShelf />
      <MissionBoard heading="open account missions" showHidden={false} />
      <LevelLadder />
      <UploadReferralSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}

