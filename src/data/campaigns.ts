export type Campaign = {
  id: string;
  name: string;
  startDate: string;
  channels: string[];
  creativeVariants: string[];
};

export const campaigns: Campaign[] = [
  {
    id: "ar001_repush_2026_06",
    name: "AR-001 Repush June 2026",
    startDate: "2026-06-09",
    channels: ["instagram_story", "instagram_bio", "tiktok", "manual_dm"],
    creativeVariants: [
      "direct_flash_bluewall",
      "flatlay_corrupted_archive",
      "model_face_cropped",
      "poster_closeup",
      "signal_log_spike",
    ],
  },
  {
    id: "hidden_code_2026_06",
    name: "Hidden Code Terminal June 2026",
    startDate: "2026-06-09",
    channels: ["instagram_story", "instagram_post", "qr", "manual_dm"],
    creativeVariants: ["shiny_edge_code", "runit_terminal", "galaxy001_story"],
  },
];
