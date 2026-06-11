export type CheatCode = {
  code: string;
  label: string;
  message: string;
  unlockType: "event" | "discount" | "content_unlock" | "redirect" | "message" | "page" | "manifesto";
  href?: string;
  discountCode?: string;
  unlockedFileId?: string;
};

export const localStorageUnlockKey = "ar-unlocked-codes";

export const cheatCodes: readonly CheatCode[] = [
  {
    code: "SHINY",
    label: "hidden discount",
    message: "SHINY CODE ACCEPTED. hidden discount unlocked.",
    unlockType: "discount",
    discountCode: "REPLAY10",
  },
  {
    code: "GALAXY001",
    label: "file expanded",
    message: "FILE AR-001 EXPANDED. galaxy file preview restored.",
    unlockType: "content_unlock",
    unlockedFileId: "AR-001",
    href: "/archive/AR-001",
  },
  {
    code: "SHINY50",
    label: "rare encounter",
    message: "rare encounter successful. 50% event found.",
    unlockType: "event",
  },
  {
    code: "RUNIT",
    label: "entry flag",
    message: "REPLAY MODE ACTIVE.",
    unlockType: "message",
  },
  {
    code: "CHEATTHEGAME",
    label: "brand phrase",
    message: "don't cheat the player. cheat the game.",
    unlockType: "message",
  },
  {
    code: "SYSTEM32",
    label: "system note",
    message: "old system path accepted. no file should still be here.",
    unlockType: "message",
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
];

export function normalizeCode(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}
