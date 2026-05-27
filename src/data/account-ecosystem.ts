export type CurrencyKey = "tix" | "rc";

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra rare"
  | "event"
  | "hidden";

export type MissionType = "daily" | "weekly" | "hidden" | "seasonal";

export type CatalogStatus =
  | "live"
  | "owned"
  | "archive"
  | "club"
  | "hidden"
  | "discontinued";

export type MemberProfile = {
  username: string;
  memberId: string;
  joined: string;
  accountAge: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  title: string;
  rank: string;
  profilePicture: string;
  about: string;
  favoriteItems: string[];
  wishlist: string[];
  referralCount: number;
  uploadCount: number;
  badges: string[];
  achievements: string[];
  tickets: number;
  replayCredits: number;
};

export type EconomyRule = {
  key: CurrencyKey;
  name: string;
  label: string;
  balanceLabel: string;
  description: string;
  earn: string[];
  spend: string[];
  tone: string;
};

export type LevelReward = {
  level: number;
  title: string;
  xpRequired: number;
  unlock: string;
  note: string;
};

export type Badge = {
  id: string;
  name: string;
  rarity: Rarity;
  unlocked: boolean;
  description: string;
};

export type InventoryItem = {
  id: string;
  title: string;
  type: string;
  rarity: Rarity;
  status: CatalogStatus;
  acquired: string;
  serial: string;
  note: string;
  href?: string;
};

export type CatalogItem = {
  id: string;
  title: string;
  releaseDate: string;
  rarity: Rarity;
  status: CatalogStatus;
  ownershipCount: number;
  price: string;
  category: string;
  tags: string[];
  history: string;
  href?: string;
};

export type Mission = {
  id: string;
  title: string;
  type: MissionType;
  progress: number;
  target: number;
  reward: {
    xp: number;
    tix: number;
    rc: number;
    badge?: string;
  };
  status: "open" | "claimed" | "locked";
  clue: string;
};

export type UploadRecord = {
  id: string;
  title: string;
  status: "approved" | "review" | "queued";
  reward: string;
  note: string;
};

export type ReferralRecord = {
  code: string;
  signups: number;
  orders: number;
  rcEarned: number;
  nextUnlock: string;
};

export type ReplayClubTier = {
  id: string;
  title: string;
  requirement: string;
  benefits: string[];
  multiplier: string;
};

export type HiddenUnlock = {
  code: string;
  path: string;
  reward: string;
  state: "known" | "rumored" | "sealed";
};

export type AdminMetric = {
  label: string;
  value: string;
  note: string;
};

export type AdminQueueItem = {
  id: string;
  area: string;
  subject: string;
  status: string;
  action: string;
};

export const demoMember: MemberProfile = {
  username: "slot_b_player",
  memberId: "00821",
  joined: "06.01.26",
  accountAge: "2 days",
  level: 12,
  xp: 1840,
  nextLevelXp: 2200,
  title: "Collector",
  rank: "Level 12 Collector",
  profilePicture: "SLOT B",
  about:
    "kept the paper manual. found the wrong purple file twice. not formatting the memory card yet.",
  favoriteItems: ["AR-001 Galaxy Tee", "Wrong Purple Poster", "Blue Star Sticker"],
  wishlist: ["Memory Card Rev E Tee", "Silver Model Warning Pin"],
  referralCount: 3,
  uploadCount: 6,
  badges: ["First File", "Page 14", "Wrong Purple", "Club Pending"],
  achievements: ["Bought first item", "Completed profile", "Referred 3 users"],
  tickets: 640,
  replayCredits: 18,
};

export const economyRules: EconomyRule[] = [
  {
    key: "tix",
    name: "Tickets",
    label: "TIX",
    balanceLabel: "640 TIX",
    description:
      "Easy reward currency for small account upgrades, stickers, wallpapers, profile cosmetics, and small discount windows.",
    earn: ["daily login", "fit upload", "reviews", "missions", "hidden page visits"],
    spend: ["sticker inserts", "wallpapers", "profile frames", "raffle entries", "small discounts"],
    tone: "blue",
  },
  {
    key: "rc",
    name: "Replay Credits",
    label: "RC",
    balanceLabel: "$18 RC",
    description:
      "Store-credit balance for real purchases. It stays plain, stackable with discount codes, and never behaves like a token.",
    earn: ["purchases", "approved referrals", "rare missions", "club multipliers", "staff grants"],
    spend: ["all live products", "member items", "restock windows", "shipping credit tests"],
    tone: "lime",
  },
];

export const levelRewards: LevelReward[] = [
  {
    level: 1,
    title: "New Player",
    xpRequired: 0,
    unlock: "profile page and basic TIX missions",
    note: "account exists, not much proof yet",
  },
  {
    level: 5,
    title: "Catalog Member",
    xpRequired: 450,
    unlock: "wishlist, favorite items, and catalog save slots",
    note: "the old catalog starts remembering clicks",
  },
  {
    level: 10,
    title: "Collector",
    xpRequired: 1400,
    unlock: "profile frame, first RC mission, hidden item previews",
    note: "member card starts showing seniority",
  },
  {
    level: 20,
    title: "Archive Scout",
    xpRequired: 4200,
    unlock: "Replay Club application priority and early-access rooms",
    note: "trusted enough to see odd stock counts",
  },
  {
    level: 35,
    title: "Override Tester",
    xpRequired: 9800,
    unlock: "tester missions, member-only item windows, rare upload rewards",
    note: "do not give this title to clean accounts",
  },
];

export const badges: Badge[] = [
  {
    id: "first-file",
    name: "First File",
    rarity: "common",
    unlocked: true,
    description: "Profile completed before the catalog was fully sorted.",
  },
  {
    id: "wrong-purple",
    name: "Wrong Purple",
    rarity: "rare",
    unlocked: true,
    description: "Saved the poster proof after the color mismatch stayed.",
  },
  {
    id: "page-14",
    name: "Page 14",
    rarity: "uncommon",
    unlocked: true,
    description: "Visited the current Galaxy catalog page.",
  },
  {
    id: "three-referrals",
    name: "Three Users Found",
    rarity: "rare",
    unlocked: true,
    description: "Referral count reached three without sounding like an ad.",
  },
  {
    id: "silver-model",
    name: "Silver Model Warning",
    rarity: "hidden",
    unlocked: false,
    description: "There is a code for this. It probably still works.",
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv-ar001",
    title: "AR-001 Galaxy Tee",
    type: "garment file",
    rarity: "rare",
    status: "owned",
    acquired: "06.01.26",
    serial: "AR001-GALAXY-0821",
    note: "owner stamp pending Shopify receipt sync",
    href: "/shop/action-replay-galaxy-tee",
  },
  {
    id: "inv-ar003",
    title: "Wrong Purple Poster",
    type: "wall file",
    rarity: "ultra rare",
    status: "owned",
    acquired: "06.01.26",
    serial: "AR003-WPURPLE-0821",
    note: "poster stock flag preserved in profile",
    href: "/shop/ar-003-corrupted-promo-poster",
  },
  {
    id: "inv-sticker",
    title: "Blue Star Sticker",
    type: "insert",
    rarity: "uncommon",
    status: "owned",
    acquired: "05.31.26",
    serial: "INSERT-STAR-11",
    note: "earned with TIX, not sold",
  },
];

export const catalogItems: CatalogItem[] = [
  {
    id: "cat-ar001",
    title: "AR-001 Galaxy Tee",
    releaseDate: "05.23.26",
    rarity: "rare",
    status: "live",
    ownershipCount: 821,
    price: "$38.00",
    category: "tees",
    tags: ["galaxy", "page 14", "live file"],
    history: "First live file after the access gate. The sleeve mark survived the bad export.",
    href: "/shop/action-replay-galaxy-tee",
  },
  {
    id: "cat-ar003",
    title: "AR-003 Corrupted Promo Poster",
    releaseDate: "05.23.26",
    rarity: "ultra rare",
    status: "live",
    ownershipCount: 214,
    price: "$32.00",
    category: "collectibles",
    tags: ["wrong purple", "pair credit", "low stock"],
    history: "Printed from the darker Galaxy export. Nobody fixed the purple.",
    href: "/shop/ar-003-corrupted-promo-poster",
  },
  {
    id: "cat-ar002",
    title: "AR-002 Memory Card Tee",
    releaseDate: "unresolved",
    rarity: "hidden",
    status: "archive",
    ownershipCount: 0,
    price: "not for sale",
    category: "tees",
    tags: ["slot b", "rev e", "sample"],
    history: "Visible as a sample, not a sellable product. One tester note calls it better.",
  },
  {
    id: "cat-wallpaper",
    title: "Aero Login Wallpaper",
    releaseDate: "06.01.26",
    rarity: "common",
    status: "club",
    ownershipCount: 1260,
    price: "90 TIX",
    category: "cosmetic",
    tags: ["profile", "access gate", "blue"],
    history: "A light-blue login screen reward for accounts older than one day.",
  },
  {
    id: "cat-pin",
    title: "Do Not Run On Silver Model Pin",
    releaseDate: "not listed",
    rarity: "hidden",
    status: "hidden",
    ownershipCount: 17,
    price: "code only",
    category: "accessories",
    tags: ["warning", "secret", "insert"],
    history: "The warning remained after the reason disappeared.",
  },
  {
    id: "cat-dev02",
    title: "DEV-02 Never Shipped Patch",
    releaseDate: "02.14.07",
    rarity: "event",
    status: "discontinued",
    ownershipCount: 58,
    price: "archived",
    category: "accessories",
    tags: ["event", "sample", "tester"],
    history: "A patch record imported from an older folder. The image is cleaner than the story.",
  },
];

export const missions: Mission[] = [
  {
    id: "daily-login",
    title: "Return to the access screen",
    type: "daily",
    progress: 1,
    target: 1,
    reward: { xp: 25, tix: 40, rc: 0 },
    status: "open",
    clue: "Daily login should feel like checking an old profile, not a streak trap.",
  },
  {
    id: "fit-upload",
    title: "Upload first fit pic",
    type: "daily",
    progress: 0,
    target: 1,
    reward: { xp: 80, tix: 120, rc: 0, badge: "First Fit" },
    status: "open",
    clue: "Uploads enter moderation before public profile display.",
  },
  {
    id: "refer-three",
    title: "Refer 3 players",
    type: "weekly",
    progress: 3,
    target: 3,
    reward: { xp: 220, tix: 300, rc: 12, badge: "Three Users Found" },
    status: "open",
    clue: "Referral rewards unlock after real checkout or approved signup.",
  },
  {
    id: "complete-profile",
    title: "Complete profile card",
    type: "weekly",
    progress: 8,
    target: 8,
    reward: { xp: 150, tix: 180, rc: 5 },
    status: "claimed",
    clue: "About text, avatar, wishlist, and favorite item all count.",
  },
  {
    id: "hidden-page",
    title: "Find the unlisted warning path",
    type: "hidden",
    progress: 0,
    target: 1,
    reward: { xp: 310, tix: 500, rc: 15, badge: "Silver Model Warning" },
    status: "locked",
    clue: "The URL was written like a support file, then abandoned.",
  },
  {
    id: "archive-set",
    title: "Collect 3 archive items",
    type: "seasonal",
    progress: 2,
    target: 3,
    reward: { xp: 400, tix: 700, rc: 20, badge: "Page 14 Set" },
    status: "open",
    clue: "AR-001 plus AR-003 already count. One insert file is missing.",
  },
];

export const uploadHistory: UploadRecord[] = [
  {
    id: "up-006",
    title: "mirror fit / blue hallway",
    status: "approved",
    reward: "+80 XP / +120 TIX",
    note: "face optional, garment visible, weird crop kept",
  },
  {
    id: "up-007",
    title: "poster wall proof",
    status: "review",
    reward: "pending",
    note: "needs owner stamp before it appears on profile",
  },
  {
    id: "up-008",
    title: "receipt corner / not full receipt",
    status: "queued",
    reward: "manual RC check",
    note: "privacy crop accepted by default",
  },
];

export const referralRecord: ReferralRecord = {
  code: "SLOTB-0821",
  signups: 7,
  orders: 3,
  rcEarned: 18,
  nextUnlock: "5 approved orders unlock Scout multiplier",
};

export const replayClubTiers: ReplayClubTier[] = [
  {
    id: "member",
    title: "Replay Member",
    requirement: "account created",
    multiplier: "1.0x XP",
    benefits: ["profile card", "TIX missions", "wishlist", "basic catalog saves"],
  },
  {
    id: "collector",
    title: "Catalog Member",
    requirement: "level 5 or first purchase",
    multiplier: "1.15x TIX",
    benefits: ["member uploads", "early notices", "profile badge", "wallpaper rewards"],
  },
  {
    id: "scout",
    title: "Archive Scout",
    requirement: "level 20, 3 referrals, or staff invite",
    multiplier: "1.25x XP / 1.25x TIX",
    benefits: ["affiliate code", "secret missions", "member-only item windows", "event access"],
  },
  {
    id: "tester",
    title: "Override Tester",
    requirement: "manual approval",
    multiplier: "1.5x XP on events",
    benefits: ["tester badge", "moderated drops", "hidden reward grants", "sample ledger access"],
  },
];

export const hiddenUnlocks: HiddenUnlock[] = [
  {
    code: "WRONGPURPLE",
    path: "/secret/wrongpurple",
    reward: "Wrong Purple badge and poster proof stamp",
    state: "known",
  },
  {
    code: "SLOTB",
    path: "/secret/slotb",
    reward: "Memory Card Rev E archive stamp",
    state: "known",
  },
  {
    code: "SILVERMODEL",
    path: "/support/do-not-run-on-silver-model",
    reward: "hidden pin eligibility and rare badge",
    state: "rumored",
  },
  {
    code: "PAGE17",
    path: "/catalog/page-17",
    reward: "missing page achievement",
    state: "sealed",
  },
];

export const adminMetrics: AdminMetric[] = [
  {
    label: "members",
    value: "1,284",
    note: "profiles created since access gate",
  },
  {
    label: "tix issued",
    value: "248,600",
    note: "small reward currency only",
  },
  {
    label: "rc liability",
    value: "$3,418",
    note: "store-credit balance to reconcile",
  },
  {
    label: "uploads pending",
    value: "42",
    note: "moderation queue before public profile display",
  },
  {
    label: "hidden codes",
    value: "7",
    note: "3 public, 2 rumored, 2 sealed",
  },
  {
    label: "club applicants",
    value: "86",
    note: "no ambassador language in review",
  },
];

export const adminQueue: AdminQueueItem[] = [
  {
    id: "adm-001",
    area: "upload",
    subject: "poster wall proof",
    status: "needs crop check",
    action: "approve, reject, or ask for owner stamp",
  },
  {
    id: "adm-002",
    area: "currency",
    subject: "manual RC grant",
    status: "pending Shopify receipt",
    action: "grant after order match",
  },
  {
    id: "adm-003",
    area: "mission",
    subject: "PAGE17 hidden achievement",
    status: "sealed",
    action: "schedule reveal window",
  },
  {
    id: "adm-004",
    area: "referral",
    subject: "SLOTB-0821",
    status: "3 orders verified",
    action: "unlock scout review at 5",
  },
  {
    id: "adm-005",
    area: "catalog",
    subject: "DEV-02 patch",
    status: "discontinued",
    action: "keep visible, purchase disabled",
  },
];

