export type ArchiveFile = {
  id: string;
  fileName: string;
  title: string;
  status?: "public" | "locked" | "corrupted" | "sold_out" | "coming_soon";
  accessTier?: "open" | "replay_club" | "admin";
  classification?: string;
  releaseDate?: string;
  productHandle?: string;
  timestamp: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "GLITCH" | "FORBIDDEN";
  checksum: string;
  description: string;
  systemNote?: string;
  corruptionLevel?: number;
  tags?: string[];
  recoveryNotes: string[];
  thumbnailTone: "blue" | "violet" | "silver" | "magenta" | "green";
};

export const archiveFiles: readonly ArchiveFile[] = [
  {
    id: "AR-001",
    fileName: "AR_001",
    title: "GALAXY TEE",
    status: "public",
    accessTier: "open",
    classification: "wearable artifact",
    releaseDate: "2026-05-21",
    productHandle: "action-replay-galaxy-tee",
    timestamp: "2026-05-21 02:14:07",
    rarity: "RARE",
    checksum: "AR-001-GAL",
    description:
      "First public garment recovered from the replay archive. White and black file variants share the same damaged Galaxy source.",
    systemNote: "don't cheat the player, cheat the game.",
    corruptionLevel: 12,
    tags: ["ds-era", "cheat-code", "galaxy", "artifact"],
    recoveryNotes: [
      "public release file survived first archive window",
      "pairs with AR-003 poster without changing checkout path",
      "source export still reports wrong purple",
    ],
    thumbnailTone: "blue",
  },
  {
    id: "AR-002",
    fileName: "AR_002",
    title: "[DATA CORRUPTED]",
    status: "locked",
    accessTier: "replay_club",
    classification: "unknown",
    timestamp: "2026-06-09 00:00:02",
    rarity: "FORBIDDEN",
    checksum: "AR-002-LOCK",
    description:
      "File exists but cannot be opened without Replay Club clearance.",
    systemNote: "access request required. do not restore in public grid yet.",
    corruptionLevel: 87,
    tags: ["locked", "future-drop", "replay-club"],
    recoveryNotes: [
      "preview image intentionally missing",
      "filename changed twice after midnight",
      "email clearance should capture first and last touch source",
    ],
    thumbnailTone: "green",
  },
  {
    id: "AR-003",
    fileName: "AR_003",
    title: "CORRUPTED PROMO POSTER",
    status: "public",
    accessTier: "open",
    classification: "print artifact",
    releaseDate: "2026-05-21",
    productHandle: "ar-003-corrupted-promo-poster",
    timestamp: "2026-05-21 03:03:33",
    rarity: "GLITCH",
    checksum: "AR-003-PRNT",
    description:
      "Oversized Galaxy promo poster recovered from the darker export.",
    systemNote: "same file family, different surface.",
    corruptionLevel: 34,
    tags: ["poster", "wrong-purple", "pair-credit"],
    recoveryNotes: [
      "magenta channel kept slightly wrong",
      "pair credit appears when queued with AR-001",
      "print file should not become too clean",
    ],
    thumbnailTone: "magenta",
  },
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
];
