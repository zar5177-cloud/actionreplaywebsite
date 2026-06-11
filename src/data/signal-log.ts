export type SignalLogEntry = {
  date: string;
  signal: string;
  sessions: number;
  note: string;
  href?: string;
};

export const signalLog: SignalLogEntry[] = [
  {
    date: "2026-05-20",
    signal: "traffic spike detected",
    sessions: 60,
    note: "first archive access window opened.",
    href: "/archive",
  },
  {
    date: "2026-05-21",
    signal: "major archive access window",
    sessions: 82,
    note: "largest known Shopify session spike from the first window.",
    href: "/shop/action-replay-galaxy-tee",
  },
  {
    date: "2026-06-06",
    signal: "secondary spike detected",
    sessions: 38,
    note: "external curiosity wave. source still needs UTM discipline.",
    href: "/signal-log",
  },
  {
    date: "2026-06-08",
    signal: "replay signal returned",
    sessions: 45,
    note: "site remembered the post, but did not capture enough of it yet.",
    href: "/replay-club",
  },
];
