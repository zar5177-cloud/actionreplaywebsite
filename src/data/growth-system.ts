export type GrowthKpi = {
  label: string;
  value: string;
  note: string;
};

export type SideAccountBrief = {
  handle: string;
  role: string;
  bio: string;
  cadence: string;
  relationship: string;
  defect: string;
  postSeeds: string[];
};

export type DailyChecklistItem = {
  time: string;
  action: string;
  owner: "main" | "side" | "operator";
};

export type OperatorCalendarItem = {
  day: number;
  primary: string;
  secondary: string;
  night: string;
};

export type MetricDefinition = {
  key: string;
  label: string;
  source: string;
  decision: string;
};

export type ResidueMarker = {
  label: string;
  trace: string;
  use: string;
};

export const growthKpis: GrowthKpi[] = [
  {
    label: "followers",
    value: "4,868",
    note: "base count before the archive system expands",
  },
  {
    label: "30d net",
    value: "+4,323",
    note: "artifact lane is already pulling new people in",
  },
  {
    label: "7d net",
    value: "+1,827",
    note: "keep the mystery cadence, do not over-normalize",
  },
  {
    label: "strong window",
    value: "12-3PM",
    note: "primary post at 12, proof/clue at 3",
  },
];

export const residueMarkers: ResidueMarker[] = [
  {
    label: "02:14",
    trace: "timestamp that keeps appearing on exports, comments, and box notes",
    use: "use when an artifact needs the feeling of somebody awake too late",
  },
  {
    label: "DEV-02 NEVER SHIPPED",
    trace: "abandoned hardware/build label with no clean explanation",
    use: "place in margin notes, inventory stickers, and rejected docs",
  },
  {
    label: "M-CARD REV E",
    trace: "memory card revision nobody fully documents",
    use: "attach to hidden pages, hangtags, and corrupted save artifacts",
  },
  {
    label: "wrong purple",
    trace: "print color that failed but became emotionally protected",
    use: "use in tester notes and packaging proofs, not polished captions",
  },
  {
    label: "page 17 missing",
    trace: "recurring magazine/forum absence",
    use: "let override_monthly and bbs_mirror_2007 disagree about it",
  },
  {
    label: "DO NOT RUN ON SILVER MODEL",
    trace: "obsolete warning preserved after it stopped making sense",
    use: "small footer text, story sticker, or hidden product label",
  },
];

export const sideAccountBriefs: SideAccountBrief[] = [
  {
    handle: "replay_recovered",
    role: "recovered archive",
    bio: "recovered action replay fragments / bad exports / file dates unreliable",
    cadence: "4 posts per week, delayed reposts after main",
    relationship: "finds damaged versions of main account files",
    defect: "folder screenshots, export marks, blue compression blocks",
    postSeeds: [
      "FILE_006_packtest_final_NOTFINAL.jpg",
      "desktop folder: MAG_ADS_2006 / SLOT_B / old2",
      "cropped Photoshop layer called do not flatten",
      "barcode crop that resembles a launch date",
      "blue folder duplicate: final_REAL_USE_2_old",
    ],
  },
  {
    handle: "override_monthly",
    role: "fake magazine archive",
    bio: "import scans / regional ads / cheat column scraps / issue numbers disputed",
    cadence: "3 posts per week, mostly print scans",
    relationship: "acts like old coverage surfaced later",
    defect: "crop marks, paper texture, correction columns",
    postSeeds: [
      "issue 00 mail-order ad",
      "reader letter about a hidden shirt in a screenshot",
      "correction note: wrong code printed",
      "back-page classified looking for AR-001 poster",
      "page 17 scan marked missing, then quoted anyway",
    ],
  },
  {
    handle: "slotb_testers",
    role: "beta tester archive",
    bio: "slot b tester logs / rejected builds / wearing the wrong prototype since 2006",
    cadence: "2-3 posts per week, active during code windows",
    relationship: "explains bugs without removing mystery",
    defect: "QA tables, build notes, wrong-size test shots",
    postSeeds: [
      "known issue: countdown bug feels better than fix",
      "tag placement failed on size M",
      "localStorage flags screenshot",
      "do not let main post this crop",
      "DEV-02 NEVER SHIPPED in a build footer",
    ],
  },
  {
    handle: "memorycard_err",
    role: "corrupted memory card",
    bio: "save damaged / item data intact / names overwritten / do not format",
    cadence: "2 posts per week, frequent stories during hidden events",
    relationship: "turns variants into save-file clues",
    defect: "black screens, item slots, save corruption messages",
    postSeeds: [
      "new item found but image missing",
      "slot a empty, slot b responding",
      "mystery gift flag false",
      "wearer id overwritten by underscores",
      "DO NOT RUN ON SILVER MODEL warning",
    ],
  },
  {
    handle: "unlock_log_txt",
    role: "plain text unlock log",
    bio: "plain text unlock reports / active windows / no hints unless logged",
    cadence: "5-7 small logs per week",
    relationship: "confirms event state and code activity",
    defect: "minimal logs, timestamps, no glamour",
    postSeeds: [
      "[12:17:40] first SHINY50 entry confirmed",
      "archive file count increased from 5 to 6",
      "one pixel link clicked 27 times",
      "no automatic DMs configured",
      "[02:14:09] duplicate file kept because older",
    ],
  },
  {
    handle: "bbs_mirror_2007",
    role: "fake forum mirror",
    bio: "old forum mirror / signatures missing / avatars stripped / some posts recovered twice",
    cadence: "3 posts per week, one thread detail at a time",
    relationship: "makes the world feel discussed before launch",
    defect: "missing avatars, dead image attachments, locked threads",
    postSeeds: [
      "did anyone else find the hidden event?",
      "moderator note: stop posting full codes",
      "thread index showing AR-001 locked",
      "signature image dead even then",
      "page 2 never archived, but one quote survived",
    ],
  },
];

export const dailyChecklist: DailyChecklistItem[] = [
  {
    time: "09:00",
    owner: "operator",
    action: "check comments, save strong theories, reply to 5-12 with tiny specifics",
  },
  {
    time: "12:00",
    owner: "main",
    action: "publish the primary artifact, product proof, or drop state",
  },
  {
    time: "12:25",
    owner: "side",
    action: "one relevant side account comment or delayed story repost",
  },
  {
    time: "15:00",
    owner: "main",
    action: "publish secondary clue, crop, story, or proof detail",
  },
  {
    time: "18:00",
    owner: "operator",
    action: "manually engage with 15-25 adjacent posts, no links unless asked",
  },
  {
    time: "21:00",
    owner: "main",
    action: "looser story: failed export, CRT photo, poll, code clue, desk shot",
  },
];

export const operatorCalendarPreview: OperatorCalendarItem[] = [
  {
    day: 1,
    primary: "FILE_006 recovered folder preview",
    secondary: "story poll: restore error or keep error",
    night: "replay_recovered posts the bad export crop",
  },
  {
    day: 2,
    primary: "test print flash photo, no clean reveal",
    secondary: "wrong blue ink close crop",
    night: "unlock_log_txt logs archive file count increased",
  },
  {
    day: 3,
    primary: "fake forum screenshot about the blue pixel",
    secondary: "point to /hidden-event without hint",
    night: "bbs_mirror_2007 posts reply crop",
  },
  {
    day: 4,
    primary: "packaging sticker test with SLOT B label",
    secondary: "handwritten note: code too big",
    night: "memorycard_err posts inventory slot",
  },
  {
    day: 5,
    primary: "fake issue 00 magazine scan",
    secondary: "zoom crop marks and correction note",
    night: "override_monthly posts page 17 disputed",
  },
  {
    day: 6,
    primary: "product-as-evidence desk photo",
    secondary: "filename code clue",
    night: "slotb_testers posts bug table",
  },
  {
    day: 7,
    primary: "first-week archive index recap",
    secondary: "story: which file feels wrong",
    night: "metrics review, no extra lore dump",
  },
];

export const metricDefinitions: MetricDefinition[] = [
  {
    key: "saves",
    label: "Saves",
    source: "Instagram post insights",
    decision: "signals artifact value; strongest input for archive lanes",
  },
  {
    key: "shares",
    label: "Shares",
    source: "Instagram post insights",
    decision: "signals repostability; use for micro-page pitches",
  },
  {
    key: "profileVisits",
    label: "Profile visits",
    source: "Instagram account insights",
    decision: "if high but follows lag, pin posts or bio are too confusing",
  },
  {
    key: "websiteClicks",
    label: "Website clicks",
    source: "Instagram account insights plus web analytics",
    decision: "if low after saves, bridge with hidden-code prompts",
  },
  {
    key: "unlockEvents",
    label: "Code unlocks",
    source: "/api/unlock-events scaffold",
    decision: "shows whether clues become action",
  },
  {
    key: "signups",
    label: "Email/SMS saves",
    source: "capture provider or local scaffold",
    decision: "quantity and early-access confidence",
  },
  {
    key: "productInterest",
    label: "Product clicks",
    source: "shop analytics",
    decision: "separates lore attention from buy intent",
  },
  {
    key: "dropConversion",
    label: "Drop conversion",
    source: "commerce checkout",
    decision: "next quantity, restock rules, reserve units",
  },
];

export const nextSevenDaySprint = [
  "Launch replay_recovered with FILE_006 and one quiet owner trail.",
  "Publish test print proof and open event-flag waitlist language.",
  "Launch bbs_mirror_2007 with one archived thread crop.",
  "Ship one shareable secret page and hide one clue in a post asset.",
  "Post packaging sticker evidence and inventory label.",
  "Run manual outreach: 12 comments, 5 saves, 3 non-pushy DMs.",
  "Publish first-run postmortem: one mistake, one next-release clue.",
];
