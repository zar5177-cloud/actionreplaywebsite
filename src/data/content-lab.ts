export type CreativeRecord = {
  id: string;
  postDate: string;
  platform: string;
  format: string;
  visualStyle: string;
  caption: string;
  audio: string;
  link: string;
  utm: string;
  sessions: number;
  emailSignups: number;
  sales: number;
  notes: string;
  winner: boolean;
};

export const creativeRecords: CreativeRecord[] = [
  {
    id: "creative_2026_06_08_001",
    postDate: "2026-06-08",
    platform: "instagram",
    format: "story",
    visualStyle: "direct flash / spike unknown",
    caption: "unlogged",
    audio: "none",
    link: "/r/galaxy",
    utm: "utm_source=instagram&utm_medium=story&utm_campaign=ar001_repush_2026_06&utm_content=direct_flash_unknown",
    sessions: 45,
    emailSignups: 0,
    sales: 0,
    notes: "strong curiosity, no capture layer at the time",
    winner: true,
  },
];
