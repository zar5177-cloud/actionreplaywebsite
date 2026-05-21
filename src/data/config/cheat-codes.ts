export type CheatCode = {
  code: string;
  label: string;
  message: string;
  unlockType: "event" | "social" | "page" | "manifesto";
  href?: string;
};

export const localStorageUnlockKey = "ar-unlocked-codes";

export const cheatCodes = [
  {
    code: "SHINY50",
    label: "rare encounter",
    message: "rare encounter successful. 50% event found.",
    unlockType: "event",
  },
  {
    code: "RUNIT",
    label: "entry flag",
    message: "comment #RUNIT + #CHEATTHEGAME to activate entry.",
    unlockType: "social",
  },
  {
    code: "MEMORYCARD",
    label: "corrupted file",
    message: "memory card handshake accepted. corrupted file route exposed.",
    unlockType: "page",
    href: "/corrupted-file",
  },
  {
    code: "DONTCHEAT",
    label: "manifesto",
    message: "brand manifesto recovered from hidden sector.",
    unlockType: "manifesto",
    href: "/manifesto",
  },
] as const satisfies readonly CheatCode[];

export function normalizeCode(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}
