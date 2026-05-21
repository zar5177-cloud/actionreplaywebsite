export type ArchiveResidue = {
  fileId: string;
  lastVerified: string;
  revision: string;
  state: string;
  restoredFrom: string;
  aliases?: string[];
  timestampConflict?: string;
  maintainer?: string;
  deadImageRef?: string;
  deadImageAlt?: string;
  preservationNote?: string;
  absentMedia?: {
    label: string;
    ref: string;
    note: string;
  };
  compressionHistory?: string[];
  duplicateFile?: string;
  obsoleteWarning?: string;
  internalComment?: {
    user: string;
    body: string;
  };
  localizationFragment?: string;
  printError?: string;
  missingReference?: string;
  unlockHint?: {
    label: string;
    href: string;
  };
};

export type ResidueSecretRoute = {
  slug: string;
  title: string;
  marker: string;
  stamp: string;
  state: string;
  body: string;
  fragment: string;
  rewardLabel: string;
  reward: string;
  returnHref: string;
};

export type ArchiveLogEntry = {
  at: string;
  user: string;
  action: string;
  file: string;
  note: string;
  state: "restored" | "missing" | "reverted" | "preserved" | "rejected";
  format?: "lower" | "caps" | "bracket" | "plain";
};

export type MaintainerTrace = {
  user: string;
  habit: string;
  formatting: string;
  attachment: string;
};

export type DeadNavigationItem = {
  label: string;
  href: string;
  state: string;
  note: string;
};

export type PublicMemoryFragment = {
  label: string;
  value: string;
  href?: string;
};

export type SourceMaterialSlot = {
  label: string;
  wanted: string;
  currentState: string;
};

export const recurringResidueMarkers = [
  "02:14",
  "01:12AM",
  "03:17:44",
  "12:17",
  "LAST VERIFIED: 2007",
  "DEV-02 NEVER SHIPPED",
  "M-CARD REV E",
  "MIRROR BUILD",
  "DO NOT RUN ON SILVER MODEL",
  "TEMP LOCALIZATION FILE",
  "EUROPEAN DISTRIBUTION CANCELLED",
  "DEFECT PRESENT IN ALL COPIES",
] as const;

export const residueUsernames = [
  "coldboot",
  "slotA",
  "mira_local",
  "walkthrough_txt",
  "dev02",
  "nightstaff",
  "export_boy",
  "no_clip",
] as const;

export const obsoleteWarnings = [
  "DO NOT RUN ON SILVER MODEL",
  "if duplicate appears, keep the older one",
  "do not restore after 12:17",
  "manual save disabled during event",
  "slot b labels must not touch heat",
  "do not translate the warning line",
] as const;

export const fakeTimestamps = [
  "2007-02-27 02:14:09",
  "2006-11-18 03:17:44",
  "2005-08-30 00:00:03",
  "2007-02-04 22:09:12",
  "LAST VERIFIED: 2007",
  "modified after upload",
] as const;

export const residueFileStates = [
  "restored from damaged export",
  "image missing",
  "copy changed back",
  "duplicate kept",
  "mirror build only",
  "partially indexed",
] as const;

export const artifactStatuses = [
  "ARCHIVE PARTIALLY RESTORED",
  "DEFECT PRESENT IN ALL COPIES",
  "UNCONFIRMED SHINY EVENT",
  "MIRROR BUILD",
  "TEMP LOCALIZATION FILE",
  "EUROPEAN DISTRIBUTION CANCELLED",
] as const;

export const emotionalSlogans = [
  "kept because it hurt",
  "wrong purple approved by nightstaff",
  "the clean file is missing",
  "page 17 still did not come back",
  "do not make this easier to find",
  "restore the error, not the explanation",
] as const;

export const bannedResiduePhrases = [
  "lore drop",
  "ARG begins",
  "cinematic mystery",
  "viral clue",
  "worldbuilding moment",
  "engagement mechanic",
  "hidden story reveal",
] as const;

export const maintainerTraces = [
  {
    user: "coldboot",
    habit: "keeps old timestamps even when the export is newer",
    formatting: "short lowercase notes, usually no punctuation",
    attachment: "left this version because he liked it better",
  },
  {
    user: "mira_local",
    habit: "preserves warnings that no longer apply",
    formatting: "small careful sentences, sometimes too personal",
    attachment: "don't remove this one again",
  },
  {
    user: "nightstaff",
    habit: "rejects the same color proof repeatedly",
    formatting: "caps for status, lowercase for the reason",
    attachment: "still not the correct purple",
  },
  {
    user: "export_boy",
    habit: "duplicates files instead of deciding which one is final",
    formatting: "filename fragments and half-notes",
    attachment: "this scan always exports darker",
  },
] as const satisfies readonly MaintainerTrace[];

export const publicMemoryFragments: readonly PublicMemoryFragment[] = [
  {
    label: "old label",
    value: "SLOT B / M-CARD REV E",
    href: "/secret/silver-model",
  },
  {
    label: "maintainer",
    value: "mira_local left the warning in",
  },
  {
    label: "timestamp",
    value: "02:14 appears in four folders",
    href: "/secret/0214",
  },
  {
    label: "missing",
    value: "page 17 still skips the index",
    href: "/secret/page-17-missing",
  },
];

export const deadNavigationItems = [
  {
    label: "scan_page_17.tif",
    href: "/archive/page-17",
    state: "asset unavailable",
    note: "alt text recovered, image not restored",
  },
  {
    label: "euro_dist",
    href: "/distribution/eu-cancelled",
    state: "mirror pending",
    note: "folder empty except label stock",
  },
  {
    label: "dev02/nav",
    href: "/dev-02/nav",
    state: "route removed",
    note: "button spacing kept in screenshots",
  },
] as const satisfies readonly DeadNavigationItem[];

export const sourceMaterialSlots = [
  {
    label: "scan bed 001",
    wanted: "actual label sheet scan with dust, not recreated texture",
    currentState: "placeholder only",
  },
  {
    label: "phone flash 002",
    wanted: "overbright desk photo of wrong purple proof",
    currentState: "needs real capture",
  },
  {
    label: "crt capture 003",
    wanted: "CRT moire on archive-log page, handheld angle",
    currentState: "not recorded",
  },
  {
    label: "paper mark 004",
    wanted: "sharpie correction on packaging test",
    currentState: "empty folder kept",
  },
] as const satisfies readonly SourceMaterialSlot[];

export const archiveResidueByFileId: Record<string, ArchiveResidue> = {
  "file-001": {
    fileId: "file-001",
    lastVerified: "2007-02-27 02:14:09",
    revision: "MIRROR BUILD / flag restored twice",
    state: "restored from damaged export",
    restoredFrom: "blue_folder/event_table_final_REAL_USE_2.old",
    aliases: ["FILE_001", "event flag", "blue folder table"],
    timestampConflict: "created 2006-11-18, verified 2007-02-27",
    maintainer: "coldboot",
    deadImageRef: "event_banner_active_old.gif",
    deadImageAlt: "blue banner, almost blank, active text in lower corner",
    preservationNote: "leave this one. cleaner banner lost the old active mark.",
    absentMedia: {
      label: "voice memo unavailable",
      ref: "audio/event_flag_roomtone_0214.m4a",
      note: "capture log says fan noise and one keyboard hit. file not in mirror.",
    },
    compressionHistory: [
      "gif export 2006, jpeg preview 2007",
      "thumbnail regenerated darker after cache clear",
      "cleaner banner exists, not linked",
    ],
    duplicateFile: "event_table_final_REAL_USE_2_old.bak",
    obsoleteWarning: "manual save disabled during event",
    internalComment: {
      user: "coldboot",
      body: "do not make the active flag look intentional",
    },
    localizationFragment: "TEMP_LOCALIZE: event still open",
    printError: "blue channel repeats every 50 scanlines",
    unlockHint: {
      label: "the timestamp links back to itself",
      href: "/secret/0214",
    },
  },
  "file-002": {
    fileId: "file-002",
    lastVerified: "LAST VERIFIED: 2007",
    revision: "UNCONFIRMED SHINY EVENT / capture cropped by export_boy",
    state: "partially indexed",
    restoredFrom: "shiny_found_scan_page17_missing.tif",
    aliases: ["FILE_002", "shiny proof", "page 17 copy"],
    timestampConflict: "capture predates public drop, scan says later",
    maintainer: "walkthrough_txt",
    deadImageRef: "scan_page_17.tif",
    deadImageAlt: "missing scan, alt text says shiny proof was cleaner",
    preservationNote: "do not rebuild page 17 from memory.",
    absentMedia: {
      label: "capture audio removed",
      ref: "audio/shiny_room_ambience.wav",
      note: "waveform placeholder survived; download mirror did not.",
    },
    compressionHistory: [
      "scan 600dpi listed, preview only 320px",
      "rescan request denied twice",
      "sharpened copy older than source",
    ],
    duplicateFile: "shiny_found_scan_page17_missing_COPY.tif",
    obsoleteWarning: "if duplicate appears, keep the older one",
    internalComment: {
      user: "walkthrough_txt",
      body: "page 17 had the cleaner proof. nobody saved it.",
    },
    missingReference: "page 17 still missing",
    unlockHint: {
      label: "missing page stub",
      href: "/secret/page-17-missing",
    },
  },
  "file-003": {
    fileId: "file-003",
    lastVerified: "2005-08-30 00:00:03",
    revision: "M-CARD REV E / slot b responds",
    state: "image missing",
    restoredFrom: "card_dump_0207/slot_b_item.dat",
    aliases: ["FILE_003", "slot b item", "M-CARD REV E"],
    timestampConflict: "slot A reports empty, slot B reports same file",
    maintainer: "mira_local",
    deadImageRef: "slot_b_item_thumb.bmp",
    deadImageAlt: "small item thumbnail, black shirt edge visible",
    preservationNote: "warning removed once. mira put it back before upload.",
    absentMedia: {
      label: "slot transfer tone missing",
      ref: "audio/m-card-rev-e-transfer.aif",
      note: "referenced by support macro, never restored.",
    },
    compressionHistory: [
      "bmp thumb converted to png, then back to bmp label",
      "slot b preview cropped from wrong save",
      "black levels crushed by old laptop display",
    ],
    obsoleteWarning: "DO NOT RUN ON SILVER MODEL",
    internalComment: {
      user: "mira_local",
      body: "leave the warning. it was on the first sticker.",
    },
    localizationFragment: "JP_TEMP: item name withheld",
    unlockHint: {
      label: "silver model warning",
      href: "/secret/silver-model",
    },
  },
  "file-004": {
    fileId: "file-004",
    lastVerified: "2006-04-21 19:45:28",
    revision: "REV C LABEL STOCK / sponsor line removed",
    state: "copy changed back",
    restoredFrom: "promo_ads/rejected/wrong_purple_scan.psd",
    aliases: ["FILE_004", "banned promo", "wrong purple"],
    timestampConflict: "print proof darker than scan every export",
    maintainer: "nightstaff",
    deadImageRef: "sponsor_line_restore.png",
    deadImageAlt: "missing sponsor line, not restored",
    preservationNote: "still not the correct purple. keep the bad proof beside it.",
    absentMedia: {
      label: "print room memo unavailable",
      ref: "audio/nightstaff_purple_note.amr",
      note: "transcript only says 'darker again' and then cuts.",
    },
    compressionHistory: [
      "psd proof exported at wrong profile",
      "jpeg pass introduced magenta edge",
      "clean purple rejected because barcode looked new",
    ],
    duplicateFile: "wrong_purple_scan_REAL_USE.psd",
    obsoleteWarning: "do not translate the warning line",
    internalComment: {
      user: "nightstaff",
      body: "wrong purple rejected again. keep it nearby.",
    },
    printError: "magenta channel offset by 3px",
    unlockHint: {
      label: "wrong purple note",
      href: "/secret/wrong-purple",
    },
  },
  "file-005": {
    fileId: "file-005",
    lastVerified: "2004-12-12 12:12:12",
    revision: "DEV-02 NEVER SHIPPED",
    state: "mirror build only",
    restoredFrom: "dev02_nav_abandoned/build_menu_capture.bmp",
    aliases: ["FILE_005", "dev build", "world override shop"],
    timestampConflict: "build label older than archive skin",
    maintainer: "dev02",
    deadImageRef: "dev02_buttonrow_old.bmp",
    deadImageAlt: "obsolete button row with one empty slot",
    preservationNote: "do not delete the empty button slot. spacing collapses.",
    absentMedia: {
      label: "menu click audio gone",
      ref: "audio/dev02_nav_click_03.wav",
      note: "listed in build notes; folder contains only thumbs.db.",
    },
    compressionHistory: [
      "bmp screen grab from silver model",
      "resized for abandoned nav, never replaced",
      "newer capture exists but lacks empty slot",
    ],
    duplicateFile: "build_menu_capture_final_DO_NOT_USE.bmp",
    obsoleteWarning: "European distribution cancelled",
    internalComment: {
      user: "dev02",
      body: "drop buttons visible before archive skin. remove, then re-add.",
    },
    missingReference: "DEV-02 reference removed then re-added",
    unlockHint: {
      label: "dev build stub",
      href: "/secret/dev-02",
    },
  },
};

export const residueSecretRoutes = [
  {
    slug: "dev-02",
    title: "DEV-02 NEVER SHIPPED",
    marker: "dev02_nav_abandoned",
    stamp: "2004-12-12 12:12:12",
    state: "mirror build only",
    body: "The nav was removed, restored, removed again, then left in the export folder because the empty button spacing looked familiar.",
    fragment: "button label recovered: WORLD OVERRIDE SHOP",
    rewardLabel: "copy fragment",
    reward: "Do not announce DEV-02. If asked, call it a build menu.",
    returnHref: "/archive-log",
  },
  {
    slug: "page-17-missing",
    title: "PAGE 17 STILL MISSING",
    marker: "issue00_scan_gap",
    stamp: "LAST VERIFIED: 2007",
    state: "image missing",
    body: "The scan index jumps from page 16 to page 18. Three later notes quote page 17 anyway.",
    fragment: "margin text: shiny proof was cleaner before upload",
    rewardLabel: "missing-page clue",
    reward: "Look for any asset that claims to be a copy of a missing file.",
    returnHref: "/archive",
  },
  {
    slug: "silver-model",
    title: "DO NOT RUN ON SILVER MODEL",
    marker: "m-card_rev_e_warning",
    stamp: "2005-08-30 00:00:03",
    state: "warning preserved",
    body: "Nobody remembers which silver model. The warning stayed because it was printed on the first slot b label.",
    fragment: "slot b labels must not touch heat",
    rewardLabel: "preserved warning",
    reward: "M-CARD REV E belongs with memory card files, not product copy.",
    returnHref: "/corrupted-file",
  },
  {
    slug: "wrong-purple",
    title: "WRONG PURPLE APPROVED",
    marker: "rev_c_label_stock",
    stamp: "2006-04-21 19:45:28",
    state: "rejected again",
    body: "The purple failed print check twice. nightstaff kept the proof because the bad ink made the barcode look less new.",
    fragment: "print note: magenta channel offset by 3px",
    rewardLabel: "print defect",
    reward: "If a restock happens, do not match the clean purple exactly.",
    returnHref: "/archive",
  },
  {
    slug: "0214",
    title: "02:14",
    marker: "night_export_time",
    stamp: "2007-02-27 02:14:09",
    state: "duplicate kept",
    body: "This timestamp appears on exports that should not share a folder. It is probably just when the last person stopped renaming files.",
    fragment: "if duplicate appears, keep the older one",
    rewardLabel: "route hint",
    reward: "Try the routes that look like warnings before the routes that look like codes.",
    returnHref: "/hidden-event",
  },
] as const satisfies readonly ResidueSecretRoute[];

export const residueSecretRouteBySlug = Object.fromEntries(
  residueSecretRoutes.map((route) => [route.slug, route]),
) as Record<string, ResidueSecretRoute>;

export const archiveLogEntries = [
  {
    at: "2007-02-27 02:14:09",
    user: "coldboot",
    action: "file restored",
    file: "FILE_001",
    note: "active flag came back after cache clear. left visible.",
    state: "restored",
    format: "lower",
  },
  {
    at: "2007-02-27 02:18:40",
    user: "walkthrough_txt",
    action: "image missing",
    file: "PAGE_17",
    note: "scan index preserved even though the page is gone.",
    state: "missing",
    format: "plain",
  },
  {
    at: "2007-02-27 03:03:12",
    user: "nightstaff",
    action: "wrong purple rejected again",
    file: "FILE_004",
    note: "kept proof in rejected folder. do not color-correct.",
    state: "rejected",
    format: "plain",
  },
  {
    at: "2007-03-01 12:17:00",
    user: "dev02",
    action: "DEV-02 reference removed",
    file: "FILE_005",
    note: "button spacing collapsed. reference re-added at 12:22.",
    state: "reverted",
    format: "bracket",
  },
  {
    at: "2007-03-01 12:22:41",
    user: "dev02",
    action: "DEV-02 reference re-added",
    file: "FILE_005",
    note: "do not ship it, just stop deleting the label.",
    state: "preserved",
    format: "lower",
  },
  {
    at: "2007-03-02 01:12:00",
    user: "mira_local",
    action: "silver model warning preserved",
    file: "FILE_003",
    note: "nobody confirmed the model. warning was already on the sticker.",
    state: "preserved",
    format: "plain",
  },
  {
    at: "2007-03-03 03:17:44",
    user: "slotA",
    action: "copy changed back",
    file: "FILE_004",
    note: "dead sponsor line removed again. same as old export.",
    state: "reverted",
    format: "lower",
  },
  {
    at: "2007-03-03 03:19:05",
    user: "export_boy",
    action: "duplicate filename kept",
    file: "FILE_001",
    note: "newer file looked cleaner. older file felt correct.",
    state: "preserved",
    format: "plain",
  },
  {
    at: "2007-03-04 01:12:00",
    user: "mira_local",
    action: "restored from old laptop",
    file: "FILE_003",
    note: "left this version because he liked it better.",
    state: "restored",
    format: "plain",
  },
  {
    at: "2007-03-04 02:14:00",
    user: "nightstaff",
    action: "STILL NOT THE CORRECT PURPLE",
    file: "FILE_004",
    note: "scan always exports darker. do not fix tonight.",
    state: "rejected",
    format: "caps",
  },
  {
    at: "2007-03-05 12:17:00",
    user: "coldboot",
    action: "copy changed back",
    file: "FILE_001",
    note: "don't remove this one again.",
    state: "reverted",
    format: "lower",
  },
] as const satisfies readonly ArchiveLogEntry[];

export const residueInjector = {
  timestamps: fakeTimestamps,
  warnings: obsoleteWarnings,
  fileNotes: [
    "restored from damaged export",
    "copy changed back after review",
    "duplicate kept because older",
    "archive partially restored",
    "image opens, then fails",
    "clean file missing from mirror",
  ],
  missingReferences: [
    "page 17 still missing",
    "DEV-02 route removed",
    "first QR test not recovered",
    "European distribution cancelled",
    "sponsor line not restored",
    "forum page 2 never archived",
  ],
  duplicateFileNames: [
    "poster_final_REAL_USE_2_old.psd",
    "event_table_final_REAL_USE_2_old.bak",
    "wrong_purple_scan_REAL_USE.psd",
    "build_menu_capture_final_DO_NOT_USE.bmp",
    "slot_b_item_COPY_previous.dat",
    "page17_scan_missing_COPY.tif",
  ],
  obsoleteProductLabels: [
    "M-CARD REV E",
    "SLOT B ONLY",
    "REV C LABEL STOCK",
    "MIRROR BUILD",
    "DEV-02 NEVER SHIPPED",
    "TEMP LOCALIZATION FILE",
  ],
  tinyEmotionalSlogans: emotionalSlogans,
  hiddenRouteIdeas: residueSecretRoutes.map((route) => `/secret/${route.slug}`),
  maintainerHabits: maintainerTraces.map((trace) => trace.habit),
  deadNavigation: deadNavigationItems.map((item) => item.href),
  texturePrompts: [
    "overbright flash photo of label stock",
    "desk scan with one sharpie mark crossing the wrong line",
    "CRT moire over a shop button nobody uses",
    "fingerprint visible on black mailer",
    "badly cropped export with Finder sidebar still visible",
    "thumbnail broken but alt text preserved",
  ],
  sourceMaterialSlots,
  bannedPhrases: bannedResiduePhrases,
} as const;
