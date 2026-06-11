export type PatchNote = {
  version: string;
  date: string;
  title: string;
  notes: string[];
  href?: string;
};

export const patchNotes: PatchNote[] = [
  {
    version: "v0.0.1",
    date: "2026-05-20",
    title: "archive opened",
    notes: ["first public archive window detected", "AR-001 file pointer added"],
    href: "/archive",
  },
  {
    version: "v0.0.2",
    date: "2026-05-21",
    title: "AR-001 stabilized",
    notes: ["galaxy tee and poster pair credit visible", "traffic spike preserved"],
    href: "/shop/action-replay-galaxy-tee",
  },
  {
    version: "v0.0.3",
    date: "2026-06-09",
    title: "first-party signal layer initialized",
    notes: ["UTM persistence added", "Replay Club capture added", "hidden code attempts tracked"],
    href: "/replay-club",
  },
];
