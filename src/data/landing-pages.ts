export type LandingPage = {
  slug: string;
  campaign: string;
  headline: string;
  subhead: string;
  productHandle?: string;
  destination?: string;
  theme: "galaxy" | "cheat" | "system" | "club";
};

export const landingPages: LandingPage[] = [
  {
    slug: "galaxy",
    campaign: "ar001_repush_2026_06",
    headline: "AR-001 // GALAXY",
    subhead: "first wearable artifact recovered from the replay archive.",
    productHandle: "action-replay-galaxy-tee",
    theme: "galaxy",
  },
  {
    slug: "ar001",
    campaign: "ar001_repush_2026_06",
    headline: "AR-001 FILE OPEN",
    subhead: "tee, poster, and wrong-purple evidence from the same export.",
    productHandle: "action-replay-galaxy-tee",
    theme: "galaxy",
  },
  {
    slug: "cheat",
    campaign: "hidden_code_2026_06",
    headline: "ENTER REPLAY CODE",
    subhead: "if the code works, the page will know.",
    destination: "/codes",
    theme: "cheat",
  },
  {
    slug: "replay-club",
    campaign: "replay_club_2026_06",
    headline: "REPLAY CLUB ACCESS",
    subhead: "private codes. early files. hidden drops.",
    destination: "/replay-club",
    theme: "club",
  },
  {
    slug: "system",
    campaign: "signal_log_2026_06",
    headline: "SIGNAL RETURNED",
    subhead: "actual Shopify spikes stored as archive evidence.",
    destination: "/signal-log",
    theme: "system",
  },
];
