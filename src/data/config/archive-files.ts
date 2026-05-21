export type ArchiveFile = {
  id: string;
  fileName: string;
  title: string;
  timestamp: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "GLITCH" | "FORBIDDEN";
  checksum: string;
  description: string;
  recoveryNotes: string[];
  thumbnailTone: "blue" | "violet" | "silver" | "magenta" | "green";
};

export const archiveFiles = [
  {
    id: "file-001",
    fileName: "FILE_001",
    title: "HIDDEN EVENT ACTIVE",
    timestamp: "2006-11-18 03:17:44",
    rarity: "RARE",
    checksum: "A7-50-SH",
    description:
      "A dormant event flag keeps turning itself back on after every server wipe.",
    recoveryNotes: [
      "flag appears attached to a random encounter table",
      "image data recovered as blue static only",
      "users reported a code, then refused to post it twice",
    ],
    thumbnailTone: "blue",
  },
  {
    id: "file-002",
    fileName: "FILE_002",
    title: "SHINY FOUND",
    timestamp: "2007-02-04 22:09:12",
    rarity: "GLITCH",
    checksum: "50-ENC-OK",
    description:
      "Encounter proof with the good pixels burned out. The capture date predates the public drop.",
    recoveryNotes: [
      "metadata says 1/8192 but the log says otherwise",
      "screen name erased by compression artifacting",
      "half the frame repeats every 50 scanlines",
    ],
    thumbnailTone: "silver",
  },
  {
    id: "file-003",
    fileName: "FILE_003",
    title: "MEMORY CARD NOT DETECTED",
    timestamp: "2005-08-30 00:00:03",
    rarity: "UNCOMMON",
    checksum: "MC-A-ERR",
    description:
      "A shop save with the inventory intact, but the wearer data removed from every slot.",
    recoveryNotes: [
      "slot A fails, slot B returns the same error",
      "file header references a tee that does not exist yet",
      "unlock requires a phrase, not a password",
    ],
    thumbnailTone: "green",
  },
  {
    id: "file-004",
    fileName: "FILE_004",
    title: "BANNED PROMO",
    timestamp: "2006-04-21 19:45:28",
    rarity: "FORBIDDEN",
    checksum: "PR-0M-0X",
    description:
      "A poster crop rejected for looking too much like evidence from a closed mall kiosk.",
    recoveryNotes: [
      "barcode resolves to a dead forum thread",
      "magenta channel offset by 3 pixels",
      "do not restore the missing sponsor line",
    ],
    thumbnailTone: "magenta",
  },
  {
    id: "file-005",
    fileName: "FILE_005",
    title: "DEV BUILD",
    timestamp: "2004-12-12 12:12:12",
    rarity: "COMMON",
    checksum: "DEV-BLD-9",
    description:
      "Internal menu state with drop buttons visible before the archive skin was applied.",
    recoveryNotes: [
      "contains obsolete label: world override shop",
      "checkout pointer intentionally blank",
      "thread watchers marked this one as real",
    ],
    thumbnailTone: "violet",
  },
] as const satisfies readonly ArchiveFile[];
