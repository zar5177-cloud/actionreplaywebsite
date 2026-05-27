import type { Metadata } from "next";
import {
  AccountUniverseHero,
  CatalogSystemBoard,
  EcosystemPageFrame,
  HiddenUnlockSection,
  InventoryShelf,
  ProfileMetaFooter,
} from "@/components/account-system";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Action Replay collectible catalog with live items, archive items, ownership counts, rarity, and hidden unlockables.",
};

export default function CatalogPage() {
  return (
    <EcosystemPageFrame>
      <AccountUniverseHero
        active="catalog"
        eyebrow="catalog / marketplace archive"
        title="Catalog"
        copy="The catalog is both a shop and a memory system: live products, discontinued files, owner counts, rarity labels, and items people can talk about even when they cannot buy them."
      />
      <CatalogSystemBoard />
      <InventoryShelf />
      <HiddenUnlockSection />
      <ProfileMetaFooter />
    </EcosystemPageFrame>
  );
}

