export type SystemMessage = {
  date?: string;
  message: string;
  href?: string;
};

export const systemMessages: SystemMessage[] = [
  {
    date: "2026-06-09",
    message: "archive instability detected. AR-002 remains locked.",
    href: "/archive",
  },
  {
    date: "2026-06-10",
    message: "new replay signal expected soon.",
    href: "/signal-log",
  },
  {
    message: "if duplicate appears, keep the older one.",
    href: "/patch-notes",
  },
  {
    message: "session spike stored as evidence.",
    href: "/signal-log",
  },
];

export function getSystemMessage(today = new Date()) {
  const isoDate = today.toISOString().slice(0, 10);
  const exact = systemMessages.find((item) => item.date === isoDate);
  if (exact) return exact;

  const fallback = systemMessages.filter((item) => !item.date);
  return fallback[today.getDate() % fallback.length] ?? systemMessages[0];
}
