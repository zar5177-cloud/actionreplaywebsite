import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Coins,
  Crown,
  Eye,
  Flag,
  Gift,
  ImageUp,
  KeyRound,
  LockKeyhole,
  Medal,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  adminMetrics,
  adminQueue,
  badges,
  catalogItems,
  demoMember,
  economyRules,
  hiddenUnlocks,
  inventoryItems,
  levelRewards,
  missions,
  referralRecord,
  replayClubTiers,
  uploadHistory,
  type CatalogItem,
  type CatalogStatus,
  type CurrencyKey,
  type InventoryItem,
  type Mission,
  type MissionType,
  type Rarity,
} from "@/data/account-ecosystem";

type Tone = "blue" | "lime" | "violet" | "white" | "slate";

const rarityClasses: Record<Rarity, string> = {
  common: "border-sky-200 bg-sky-50 text-sky-800",
  uncommon: "border-cyan-200 bg-cyan-50 text-cyan-800",
  rare: "border-blue-300 bg-blue-50 text-blue-900",
  "ultra rare": "border-violet-300 bg-violet-50 text-violet-900",
  event: "border-lime-300 bg-lime-50 text-lime-900",
  hidden: "border-zinc-400 bg-zinc-950 text-zinc-100",
};

const statusLabels: Record<CatalogStatus, string> = {
  archive: "Archive",
  club: "Club",
  discontinued: "Discontinued",
  hidden: "Hidden",
  live: "Live",
  owned: "Owned",
};

const missionLabels: Record<MissionType, string> = {
  daily: "Daily",
  weekly: "Weekly",
  hidden: "Hidden",
  seasonal: "Seasonal",
};

const toneClasses: Record<Tone, string> = {
  blue: "border-sky-200 bg-sky-50/88 text-sky-950",
  lime: "border-lime-200 bg-lime-50/88 text-lime-950",
  slate: "border-slate-200 bg-white/80 text-slate-900",
  violet: "border-violet-200 bg-violet-50/88 text-violet-950",
  white: "border-white/75 bg-white/72 text-slate-950",
};

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function ProgressBar({
  value,
  max,
  tone = "blue",
}: {
  value: number;
  max: number;
  tone?: "blue" | "lime" | "violet";
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const fillClass =
    tone === "lime"
      ? "bg-lime-300"
      : tone === "violet"
        ? "bg-violet-400"
        : "bg-sky-400";

  return (
    <div className="h-3 overflow-hidden border border-slate-900/10 bg-white">
      <div className={`h-full ${fillClass}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

function MiniPill({
  children,
  tone = "white",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

function RarityPill({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className={`inline-flex border px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] ${rarityClasses[rarity]}`}
    >
      {rarity}
    </span>
  );
}

function SystemPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[8px] border border-white/70 bg-white/78 shadow-[0_18px_70px_rgba(35,101,165,0.14)] backdrop-blur-xl ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0)_36%),linear-gradient(90deg,rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(rgba(14,165,233,0.07)_1px,transparent_1px)] bg-[size:auto,34px_34px,34px_34px]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function AccountUniverseHero({
  eyebrow,
  title,
  copy,
  active = "account",
}: {
  eyebrow: string;
  title: string;
  copy: string;
  active?: "account" | "catalog" | "missions" | "club" | "admin";
}) {
  const nav = [
    { id: "account", label: "Profile", href: "/account", icon: UserRound },
    { id: "catalog", label: "Catalog", href: "/catalog", icon: Boxes },
    { id: "missions", label: "Missions", href: "/missions", icon: ClipboardList },
    { id: "club", label: "Replay Club", href: "/replay-club", icon: Crown },
    { id: "admin", label: "Admin", href: "/admin", icon: ShieldCheck },
  ] as const;

  return (
    <section className="relative isolate overflow-hidden border-b border-sky-200/70 bg-[#edfaff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.96),transparent_19rem),radial-gradient(circle_at_78%_22%,rgba(14,165,233,0.32),transparent_24rem),linear-gradient(180deg,#f9feff_0%,#dff5ff_52%,#b8e5ff_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-55 [background-image:linear-gradient(rgba(14,116,144,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(14,116,144,0.1)_1px,transparent_1px)] [background-size:52px_52px]"
      />
      <div className="mx-auto grid max-w-[1600px] gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <MiniPill tone="blue">action_replay.sys</MiniPill>
            <MiniPill tone="lime">member universe</MiniPill>
            <MiniPill tone="white">no wallet / no token</MiniPill>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-sky-800">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-normal text-slate-950 sm:text-7xl lg:text-[7.5rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
            {copy}
          </p>
        </div>
        <SystemPanel className="p-3">
          <div className="grid gap-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex min-w-0 items-center justify-between gap-3 rounded-[6px] border px-3 py-3 font-mono text-xs font-black uppercase tracking-[0.12em] transition ${
                    isActive
                      ? "border-sky-500 bg-sky-500 text-white shadow-[0_10px_28px_rgba(14,116,144,0.22)]"
                      : "border-sky-200 bg-white/70 text-slate-700 hover:border-sky-400 hover:text-sky-900"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0" />
                </Link>
              );
            })}
          </div>
        </SystemPanel>
      </div>
    </section>
  );
}

export function AccountProfileSection() {
  const xpRemaining = demoMember.nextLevelXp - demoMember.xp;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1fr)]">
        <SystemPanel className="p-5">
          <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
            <div className="grid aspect-square place-items-center rounded-[8px] border border-sky-200 bg-[radial-gradient(circle_at_35%_25%,#fff,transparent_28%),linear-gradient(135deg,#0ea5e9,#ffffff_48%,#7dd3fc)] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  avatar
                </p>
                <p className="mt-2 text-3xl font-black uppercase text-slate-950">
                  {demoMember.profilePicture}
                </p>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <MiniPill tone="blue">MEMBER #{demoMember.memberId}</MiniPill>
                <MiniPill tone="lime">Joined {demoMember.joined}</MiniPill>
              </div>
              <h2 className="mt-4 break-words text-4xl font-black uppercase leading-none text-slate-950 sm:text-5xl">
                {demoMember.username}
              </h2>
              <p className="mt-2 font-mono text-sm uppercase tracking-[0.12em] text-sky-800">
                Level {demoMember.level} {demoMember.title}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700">
                {demoMember.about}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between gap-3 font-mono text-xs uppercase text-slate-600">
              <span>{demoMember.xp} XP</span>
              <span>{xpRemaining} XP until Level {demoMember.level + 1}</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={demoMember.xp} max={demoMember.nextLevelXp} />
            </div>
          </div>
        </SystemPanel>

        <div className="grid gap-4 md:grid-cols-2">
          {economyRules.map((currency) => (
            <CurrencyPanel key={currency.key} currency={currency.key} />
          ))}
          <SystemPanel className="p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
              account age
            </p>
            <p className="mt-3 text-4xl font-black uppercase text-slate-950">
              {demoMember.accountAge}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Seniority should become part of the collection. Old accounts get
              quieter badges, not louder popups.
            </p>
          </SystemPanel>
          <SystemPanel className="p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
              social proof
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MiniStat label="uploads" value={demoMember.uploadCount.toString()} />
              <MiniStat label="refs" value={demoMember.referralCount.toString()} />
              <MiniStat label="badges" value={demoMember.badges.length.toString()} />
            </div>
          </SystemPanel>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-sky-100 bg-white/72 p-3">
      <p className="text-2xl font-black uppercase text-slate-950">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

export function CurrencyPanel({ currency }: { currency: CurrencyKey }) {
  const rule = economyRules.find((item) => item.key === currency)!;
  const Icon = currency === "tix" ? Coins : CircleDollarSign;

  return (
    <SystemPanel className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
            {rule.name}
          </p>
          <p className="mt-2 text-4xl font-black uppercase leading-none text-slate-950">
            {rule.balanceLabel}
          </p>
        </div>
        <span
          className={`grid size-11 place-items-center rounded-[8px] border ${
            currency === "tix"
              ? "border-sky-300 bg-sky-100 text-sky-700"
              : "border-lime-300 bg-lime-100 text-lime-800"
          }`}
        >
          <Icon size={22} />
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{rule.description}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            earn
          </p>
          <ul className="mt-2 grid gap-1">
            {rule.earn.slice(0, 4).map((item) => (
              <li key={item} className="font-mono text-[11px] uppercase text-slate-700">
                + {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            redeem
          </p>
          <ul className="mt-2 grid gap-1">
            {rule.spend.slice(0, 4).map((item) => (
              <li key={item} className="font-mono text-[11px] uppercase text-slate-700">
                - {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SystemPanel>
  );
}

export function BadgeShelf() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">profile identity</p>
            <h2 className="section-title !text-slate-950">badges and seniority</h2>
          </div>
          <MiniPill tone="white">status should be earned slowly</MiniPill>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {badges.map((badge) => (
            <SystemPanel key={badge.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[8px] border border-sky-200 bg-white text-sky-700">
                  {badge.unlocked ? <BadgeCheck size={20} /> : <LockKeyhole size={20} />}
                </span>
                <RarityPill rarity={badge.rarity} />
              </div>
              <h3 className="mt-4 text-xl font-black uppercase leading-none text-slate-950">
                {badge.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {badge.description}
              </p>
            </SystemPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InventoryShelf() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.36fr)]">
        <div>
          <div className="mb-4">
            <p className="section-kicker">inventory / owned files</p>
            <h2 className="section-title !text-slate-950">collection history</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {inventoryItems.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <SystemPanel className="p-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
            favorites
          </p>
          <div className="mt-4 grid gap-2">
            {demoMember.favoriteItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-[6px] border border-sky-100 bg-white/72 px-3 py-2 font-mono text-xs uppercase text-slate-700"
              >
                <Star size={14} className="text-sky-500" />
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
            wishlist
          </p>
          <div className="mt-4 grid gap-2">
            {demoMember.wishlist.map((item) => (
              <div
                key={item}
                className="rounded-[6px] border border-slate-200 bg-white/60 px-3 py-2 font-mono text-xs uppercase text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </SystemPanel>
      </div>
    </section>
  );
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const body = (
    <SystemPanel className="h-full p-4">
      <div className="flex items-start justify-between gap-3">
        <RarityPill rarity={item.rarity} />
        <MiniPill tone="blue">{statusLabels[item.status]}</MiniPill>
      </div>
      <h3 className="mt-5 min-h-16 text-2xl font-black uppercase leading-none text-slate-950">
        {item.title}
      </h3>
      <div className="mt-4 grid gap-2 font-mono text-[11px] uppercase text-slate-600">
        <p>{item.type}</p>
        <p>acquired {item.acquired}</p>
        <p>{item.serial}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{item.note}</p>
    </SystemPanel>
  );

  return item.href ? (
    <Link href={item.href} className="block h-full transition hover:-translate-y-0.5">
      {body}
    </Link>
  ) : (
    body
  );
}

export function LevelLadder() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4">
          <p className="section-kicker">xp ladder</p>
          <h2 className="section-title !text-slate-950">levels unlock access</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-5">
          {levelRewards.map((reward) => (
            <SystemPanel key={reward.level} className="p-4">
              <MiniPill tone={reward.level <= demoMember.level ? "lime" : "white"}>
                level {reward.level}
              </MiniPill>
              <h3 className="mt-4 text-2xl font-black uppercase leading-none text-slate-950">
                {reward.title}
              </h3>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-sky-800">
                {compactNumber(reward.xpRequired)} XP
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {reward.unlock}
              </p>
              <p className="mt-4 border-t border-sky-100 pt-3 font-mono text-[10px] uppercase leading-4 text-slate-500">
                {reward.note}
              </p>
            </SystemPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MissionBoard({
  heading = "missions and achievements",
  showHidden = true,
}: {
  heading?: string;
  showHidden?: boolean;
}) {
  const visibleMissions = showHidden
    ? missions
    : missions.filter((mission) => mission.type !== "hidden");

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">reward board</p>
            <h2 className="section-title !text-slate-950">{heading}</h2>
          </div>
          <MiniPill tone="lime">XP / TIX / RC / badges</MiniPill>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {visibleMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionCard({ mission }: { mission: Mission }) {
  const isComplete = mission.progress >= mission.target;

  return (
    <SystemPanel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <MiniPill tone={mission.type === "hidden" ? "violet" : "blue"}>
          {missionLabels[mission.type]}
        </MiniPill>
        <MiniPill tone={mission.status === "claimed" ? "lime" : "white"}>
          {mission.status}
        </MiniPill>
      </div>
      <h3 className="mt-4 text-2xl font-black uppercase leading-none text-slate-950">
        {mission.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{mission.clue}</p>
      <div className="mt-4">
        <div className="flex justify-between gap-3 font-mono text-[11px] uppercase text-slate-500">
          <span>
            {mission.progress}/{mission.target}
          </span>
          <span>{isComplete ? "ready" : "in progress"}</span>
        </div>
        <div className="mt-2">
          <ProgressBar
            value={mission.progress}
            max={mission.target}
            tone={mission.type === "hidden" ? "violet" : "blue"}
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px] uppercase text-slate-700">
        <span className="rounded-[6px] border border-sky-100 bg-white/72 px-2 py-2">
          +{mission.reward.xp} XP
        </span>
        <span className="rounded-[6px] border border-sky-100 bg-white/72 px-2 py-2">
          +{mission.reward.tix} TIX
        </span>
        <span className="rounded-[6px] border border-lime-200 bg-lime-50 px-2 py-2">
          +{mission.reward.rc} RC
        </span>
      </div>
      {mission.reward.badge ? (
        <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase text-violet-800">
          <Medal size={14} />
          badge: {mission.reward.badge}
        </p>
      ) : null}
    </SystemPanel>
  );
}

export function CatalogSystemBoard() {
  const categories = Array.from(new Set(catalogItems.map((item) => item.category)));
  const liveCount = catalogItems.filter((item) => item.status === "live").length;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(250px,0.32fr)_minmax(0,1fr)]">
        <aside className="space-y-3">
          <SystemPanel className="p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
                catalog filter
              </p>
              <Search size={17} className="text-sky-700" />
            </div>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-between rounded-[6px] border border-sky-500 bg-sky-500 px-3 font-mono text-xs font-black uppercase tracking-[0.12em] text-white"
              >
                <span>All items</span>
                <span>{catalogItems.length}</span>
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className="flex h-10 items-center justify-between rounded-[6px] border border-sky-100 bg-white/70 px-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-700"
                >
                  <span>{category}</span>
                  <span>
                    {catalogItems.filter((item) => item.category === category).length}
                  </span>
                </button>
              ))}
            </div>
          </SystemPanel>
          <SystemPanel className="p-4">
            <MiniPill tone="lime">{liveCount} live files</MiniPill>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The catalog should feel like a marketplace and a museum at the same
              time: purchasable pieces, locked samples, discontinued evidence,
              and hidden records.
            </p>
          </SystemPanel>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">old catalog channel</p>
              <h2 className="section-title !text-slate-950">collectible item grid</h2>
            </div>
            <MiniPill tone="white">ownership counts visible</MiniPill>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {catalogItems.map((item) => (
              <CatalogCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogCard({ item }: { item: CatalogItem }) {
  const content = (
    <SystemPanel className="h-full p-3">
      <div className="aspect-square rounded-[8px] border border-sky-100 bg-[radial-gradient(circle_at_38%_30%,#fff,transparent_30%),linear-gradient(135deg,#e6f8ff,#83d8ff_58%,#ffffff)] p-3">
        <div className="flex h-full flex-col justify-between rounded-[6px] border border-white/80 bg-white/54 p-3">
          <div className="flex flex-wrap gap-2">
            <RarityPill rarity={item.rarity} />
            <MiniPill tone={item.status === "live" ? "lime" : "white"}>
              {statusLabels[item.status]}
            </MiniPill>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
              {item.id}
            </p>
            <h3 className="mt-2 text-3xl font-black uppercase leading-none text-slate-950">
              {item.title}
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-4 px-1">
        <div className="grid grid-cols-3 gap-2 font-mono text-[10px] uppercase text-slate-600">
          <span className="rounded-[6px] border border-sky-100 bg-white/70 px-2 py-2">
            {item.releaseDate}
          </span>
          <span className="rounded-[6px] border border-sky-100 bg-white/70 px-2 py-2">
            {compactNumber(item.ownershipCount)} own
          </span>
          <span className="rounded-[6px] border border-sky-100 bg-white/70 px-2 py-2">
            {item.price}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{item.history}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sky-100 bg-white/70 px-2 py-1 font-mono text-[10px] uppercase text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </SystemPanel>
  );

  return item.href ? (
    <Link href={item.href} className="block h-full transition hover:-translate-y-0.5">
      {content}
    </Link>
  ) : (
    content
  );
}

export function UploadReferralSection() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div>
          <div className="mb-4">
            <p className="section-kicker">community uploads</p>
            <h2 className="section-title !text-slate-950">fit proof queue</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {uploadHistory.map((upload) => (
              <SystemPanel key={upload.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-[8px] border border-sky-200 bg-white text-sky-700">
                    <ImageUp size={20} />
                  </span>
                  <MiniPill
                    tone={
                      upload.status === "approved"
                        ? "lime"
                        : upload.status === "review"
                          ? "blue"
                          : "white"
                    }
                  >
                    {upload.status}
                  </MiniPill>
                </div>
                <h3 className="mt-4 text-xl font-black uppercase leading-none text-slate-950">
                  {upload.title}
                </h3>
                <p className="mt-3 font-mono text-[11px] uppercase text-sky-800">
                  {upload.reward}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {upload.note}
                </p>
              </SystemPanel>
            ))}
          </div>
        </div>

        <SystemPanel className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-[8px] border border-sky-200 bg-white text-sky-700">
              <UsersRound size={22} />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-800">
                referral code
              </p>
              <p className="mt-1 text-2xl font-black uppercase text-slate-950">
                {referralRecord.code}
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <MiniStat label="signups" value={referralRecord.signups.toString()} />
            <MiniStat label="orders" value={referralRecord.orders.toString()} />
            <MiniStat label="rc" value={`$${referralRecord.rcEarned}`} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {referralRecord.nextUnlock}
          </p>
        </SystemPanel>
      </div>
    </section>
  );
}

export function HiddenUnlockSection() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-4">
          <p className="section-kicker">hidden systems</p>
          <h2 className="section-title !text-slate-950">codes, URLs, and strange rewards</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-4">
          {hiddenUnlocks.map((unlock) => (
            <SystemPanel key={unlock.code} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-[8px] border border-sky-200 bg-white text-sky-700">
                  <KeyRound size={19} />
                </span>
                <MiniPill tone={unlock.state === "known" ? "lime" : "white"}>
                  {unlock.state}
                </MiniPill>
              </div>
              <h3 className="mt-4 text-2xl font-black uppercase leading-none text-slate-950">
                {unlock.code}
              </h3>
              <p className="mt-3 break-all font-mono text-[11px] uppercase leading-5 text-sky-800">
                {unlock.path}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {unlock.reward}
              </p>
            </SystemPanel>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReplayClubSystem() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]">
        <div>
          <div className="mb-4">
            <p className="section-kicker">membership layer</p>
            <h2 className="section-title !text-slate-950">Replay Club</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {replayClubTiers.map((tier) => (
              <SystemPanel key={tier.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <MiniPill tone="blue">{tier.requirement}</MiniPill>
                  <MiniPill tone="lime">{tier.multiplier}</MiniPill>
                </div>
                <h3 className="mt-5 text-3xl font-black uppercase leading-none text-slate-950">
                  {tier.title}
                </h3>
                <ul className="mt-4 grid gap-2">
                  {tier.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                    >
                      <Sparkles size={15} className="mt-1 shrink-0 text-sky-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </SystemPanel>
            ))}
          </div>
        </div>

        <SystemPanel className="p-5">
          <MiniPill tone="lime">application terminal</MiniPill>
          <h3 className="mt-4 text-4xl font-black uppercase leading-none text-slate-950">
            player, collector, contributor, scout
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Replay Club is not an ambassador program. It is the account layer
            where people earn access by wearing, uploading, referring, testing,
            and finding small pieces of the archive.
          </p>
          <div className="mt-5 grid gap-2">
            {["early access", "member-only items", "exclusive missions", "affiliate codes", "event access"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-[6px] border border-sky-100 bg-white/70 px-3 py-2 font-mono text-xs uppercase text-slate-700"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </SystemPanel>
      </div>
    </section>
  );
}

export function RewardsRuleSection() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 md:grid-cols-3">
        {[
          {
            icon: Award,
            title: "Discounts unlock from behavior",
            copy: "Purchases, uploads, referrals, and hidden discoveries can create rewards without forcing dark patterns.",
          },
          {
            icon: CircleDollarSign,
            title: "RC stacks with discount codes",
            copy: "Replay Credits are plain store credit. They should apply on all products and stay separate from TIX.",
          },
          {
            icon: Gift,
            title: "Random inserts stay physical",
            copy: "Package inserts, sticker flags, and rare badges give the system surprise without becoming gambling UX.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <SystemPanel key={item.title} className="p-5">
              <span className="grid size-11 place-items-center rounded-[8px] border border-sky-200 bg-white text-sky-700">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-2xl font-black uppercase leading-none text-slate-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
            </SystemPanel>
          );
        })}
      </div>
    </section>
  );
}

export function AdminSystemDashboard() {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.36fr)]">
        <div>
          <div className="mb-4">
            <p className="section-kicker">admin dashboard / private scaffold</p>
            <h2 className="section-title !text-slate-950">system control</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {adminMetrics.map((metric) => (
              <SystemPanel key={metric.label} className="p-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-800">
                  {metric.label}
                </p>
                <p className="mt-3 text-4xl font-black uppercase text-slate-950">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {metric.note}
                </p>
              </SystemPanel>
            ))}
          </div>

          <SystemPanel className="mt-4 overflow-hidden">
            <div className="grid border-b border-sky-100 bg-white/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-600 md:grid-cols-[0.5fr_0.7fr_1fr_0.8fr_1.2fr]">
              <span>ID</span>
              <span>Area</span>
              <span>Subject</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            <div className="divide-y divide-sky-100">
              {adminQueue.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 px-4 py-4 text-sm text-slate-700 md:grid-cols-[0.5fr_0.7fr_1fr_0.8fr_1.2fr]"
                >
                  <span className="font-mono text-xs uppercase text-slate-500">
                    {item.id}
                  </span>
                  <span className="font-mono text-xs uppercase text-sky-800">
                    {item.area}
                  </span>
                  <span className="font-semibold text-slate-900">{item.subject}</span>
                  <span>{item.status}</span>
                  <span>{item.action}</span>
                </div>
              ))}
            </div>
          </SystemPanel>
        </div>

        <div className="grid gap-4">
          <SystemPanel className="p-5">
            <MiniPill tone="blue">scalable controls</MiniPill>
            <div className="mt-5 grid gap-2">
              {[
                ["users", UserRound],
                ["xp and levels", Medal],
                ["currency balances", Coins],
                ["rewards", Gift],
                ["uploads", Upload],
                ["hidden unlocks", Eye],
                ["referrals", UsersRound],
                ["missions", ClipboardList],
                ["discount multipliers", Flag],
              ].map(([label, Icon]) => {
                const ControlIcon = Icon as typeof UserRound;
                return (
                  <div
                    key={label as string}
                    className="flex items-center gap-2 rounded-[6px] border border-sky-100 bg-white/70 px-3 py-2 font-mono text-xs uppercase text-slate-700"
                  >
                    <ControlIcon size={14} className="text-sky-700" />
                    {label as string}
                  </div>
                );
              })}
            </div>
          </SystemPanel>
          <SystemPanel className="p-5">
            <MiniPill tone="lime">commerce boundary</MiniPill>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The admin layer can adjust XP, TIX, RC, missions, hidden rewards,
              and multipliers. Shopify checkout remains server-side and should
              not leak Storefront tokens into client components.
            </p>
          </SystemPanel>
        </div>
      </div>
    </section>
  );
}

export function EcosystemPageFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#f7fdff_0%,#dff5ff_44%,#f8fbff_100%)] text-slate-950">
      {children}
    </div>
  );
}

export function AccountQuickLinks() {
  return (
    <section className="px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-3 md:grid-cols-4">
        {[
          { href: "/catalog", label: "browse catalog", icon: Boxes },
          { href: "/missions", label: "claim missions", icon: ClipboardList },
          { href: "/replay-club", label: "join replay club", icon: Crown },
          { href: "/shop", label: "shop live files", icon: PackageCheck },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-0 items-center justify-between gap-3 rounded-[8px] border border-sky-200 bg-white/78 px-4 py-4 font-mono text-xs font-black uppercase tracking-[0.12em] text-slate-800 shadow-[0_14px_34px_rgba(35,101,165,0.12)] transition hover:-translate-y-0.5 hover:border-sky-500 hover:text-sky-900"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon size={17} className="shrink-0 text-sky-700" />
                <span className="truncate">{item.label}</span>
              </span>
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ProfileMetaFooter() {
  return (
    <section className="px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] border-y border-sky-200 py-4">
        <div className="flex flex-wrap gap-2">
          {[
            "member age matters",
            "TIX are small rewards",
            "RC is store credit",
            "hidden URLs stay quiet",
            "catalog ownership is public",
            "uploads enter review",
          ].map((line) => (
            <span
              key={line}
              className="rounded-full border border-sky-200 bg-white/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600"
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
