"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  cheatCodes,
  localStorageUnlockKey,
  normalizeCode,
  type CheatCode,
} from "@/data/config/cheat-codes";
import { residueSecretRouteBySlug, type ResidueSecretRoute } from "@/data/residue";
import {
  FileStamp,
  InternalComment,
  ObsoleteWarning,
} from "@/components/residue/residue-fragments";

type ShareableUnlockCardProps = {
  code: string;
};

function readUnlockedCodes() {
  try {
    const stored = window.localStorage.getItem(localStorageUnlockKey);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

async function reportUnlock(code: string, source: "secret-page") {
  try {
    await fetch("/api/unlock-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        source,
        path: window.location.pathname,
        occurredAt: new Date().toISOString(),
      }),
    });
  } catch {
    // Unlocks should still work if analytics storage is not wired yet.
  }
}

export function ShareableUnlockCard({ code }: ShareableUnlockCardProps) {
  const normalizedCode = normalizeCode(code);
  const match = useMemo<CheatCode | undefined>(
    () => cheatCodes.find((cheatCode) => cheatCode.code === normalizedCode),
    [normalizedCode],
  );
  const residueRoute = useMemo<ResidueSecretRoute | undefined>(
    () => residueSecretRouteBySlug[code.trim().toLowerCase()],
    [code],
  );
  const [status, setStatus] = useState("checking local save...");

  useEffect(() => {
    if (!match) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const unlocked = readUnlockedCodes();
      if (!unlocked.includes(match.code)) {
        window.localStorage.setItem(
          localStorageUnlockKey,
          JSON.stringify([...unlocked, match.code]),
        );
        void reportUnlock(match.code, "secret-page");
        setStatus("flag written to this browser.");
        return;
      }

      setStatus("flag already existed in this browser.");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [match]);

  if (residueRoute) {
    return (
      <div className="crt-panel p-5 sm:p-8">
        <div className="flex flex-wrap gap-1.5">
          <FileStamp label="marker" value={residueRoute.marker} />
          <FileStamp label="stamp" value={residueRoute.stamp} />
          <FileStamp label="state" value={residueRoute.state} />
        </div>
        <h1 className="mt-5 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
          {residueRoute.title}
        </h1>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-6 text-zinc-300">
          {residueRoute.body}
        </p>
        <ObsoleteWarning className="mt-5">
          {residueRoute.fragment}
        </ObsoleteWarning>
        <div className="mt-5 border border-white/10 bg-black/45 p-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
            {residueRoute.rewardLabel}
          </p>
          <InternalComment user="mirror_staff" className="mt-3">
            {residueRoute.reward}
          </InternalComment>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={residueRoute.returnHref} className="ui-button ui-button-hot">
            return to file
          </Link>
          <Link href="/archive-log" className="ui-button">
            open restore log
          </Link>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="crt-panel p-5 sm:p-8">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-fuchsia-200">
          bad mirror
        </p>
        <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
          code not indexed
        </h1>
        <p className="mt-4 font-mono text-sm leading-6 text-zinc-300">
          The URL looked like an unlock page, but no matching event flag exists.
        </p>
      </div>
    );
  }

  return (
    <div className="crt-panel p-5 sm:p-8">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
        shareable unlock / local save
      </p>
      <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
        {match.label}
      </h1>
      <div className="mt-5 grid gap-3 font-mono text-sm leading-6 text-zinc-300 sm:grid-cols-2">
        <p>{match.message}</p>
        <p>
          This page writes the flag to localStorage. It is a local browser
          note, not an account login or checkout gate.
        </p>
      </div>
      <div className="mt-6 border border-lime-300/50 bg-lime-300/10 p-3 font-mono text-xs uppercase tracking-[0.16em] text-lime-100">
        {status}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="ui-button ui-button-hot">
          return to console
        </Link>
        {"href" in match && match.href ? (
          <Link href={match.href} className="ui-button">
            open unlocked file
          </Link>
        ) : (
          <Link href="/hidden-event" className="ui-button">
            open hidden event
          </Link>
        )}
      </div>
    </div>
  );
}
