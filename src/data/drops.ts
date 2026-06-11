export type Drop = {
  id: string;
  name: string;
  status: "planning" | "teasing" | "live" | "sold_out" | "archived";
  launchDate?: string;
  products: string[];
  campaignIds: string[];
  codes: string[];
  archiveFileIds: string[];
  creativeAssets: string[];
  checklist: string[];
};

export const drops: Drop[] = [
  {
    id: "ar-001",
    name: "AR-001 Galaxy",
    status: "live",
    launchDate: "2026-05-21",
    products: ["action-replay-galaxy-tee", "ar-003-corrupted-promo-poster"],
    campaignIds: ["ar001_repush_2026_06"],
    codes: ["SHINY", "GALAXY001", "REPLAY10"],
    archiveFileIds: ["AR-001", "AR-003"],
    creativeAssets: [
      "direct_flash_bluewall",
      "flatlay_corrupted_archive",
      "poster_closeup",
    ],
    checklist: [
      "UTM links created",
      "Replay Club capture visible",
      "product CTA visible on mobile",
      "Clarity review queued after spike",
    ],
  },
  {
    id: "ar-002",
    name: "AR-002 Locked File",
    status: "planning",
    products: ["ar-002-memory-card-tee"],
    campaignIds: ["hidden_code_2026_06"],
    codes: ["MEMORYCARD", "SYSTEM32"],
    archiveFileIds: ["AR-002"],
    creativeAssets: ["locked_file_crop", "memory_card_error"],
    checklist: [
      "collect Replay Club intent",
      "do not expose product as purchasable",
      "name material changes before release",
    ],
  },
];
