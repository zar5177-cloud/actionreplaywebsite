"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  cheatCodes,
  localStorageUnlockKey,
  normalizeCode,
  type CheatCode,
} from "@/data/config/cheat-codes";

type UnlockStatus =
  | { kind: "idle"; message: string }
  | { kind: "success"; code: CheatCode }
  | { kind: "repeat"; code: CheatCode }
  | { kind: "error"; message: string };

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

async function reportUnlock(code: string) {
  try {
    await fetch("/api/unlock-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        source: "console",
        path: window.location.pathname,
        occurredAt: new Date().toISOString(),
      }),
    });
  } catch {
    // The unlock should still work when analytics storage is not connected.
  }
}

export function SecretCodeConsole() {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [status, setStatus] = useState<UnlockStatus>({
    kind: "idle",
    message: "enter recovered code",
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setUnlocked(readUnlockedCodes());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const unlockedCodes = useMemo(
    () => cheatCodes.filter((code) => unlocked.includes(code.code)),
    [unlocked],
  );

  function persist(nextUnlocked: string[]) {
    setUnlocked(nextUnlocked);
    window.localStorage.setItem(
      localStorageUnlockKey,
      JSON.stringify(nextUnlocked),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeCode(input);
    const match = cheatCodes.find((code) => code.code === normalized);

    if (!match) {
      setStatus({
        kind: "error",
        message: "code rejected. no matching event flag.",
      });
      return;
    }

    if (unlocked.includes(match.code)) {
      setStatus({ kind: "repeat", code: match });
      setInput("");
      return;
    }

    persist([...unlocked, match.code]);
    void reportUnlock(match.code);
    setStatus({ kind: "success", code: match });
    setInput("");
  }

  const statusMessage =
    status.kind === "success" || status.kind === "repeat"
      ? status.code.message
      : status.message;

  return (
    <section className="crt-panel p-4 sm:p-5" aria-labelledby="secret-code">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-fuchsia-200">
            action replay input
          </p>
          <h2
            id="secret-code"
            className="mt-1 text-2xl font-black uppercase text-white"
          >
            secret unlock
          </h2>
        </div>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
          {unlocked.length}/4 flags
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="cheat-code">
          Enter cheat code
        </label>
        <input
          id="cheat-code"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="TYPE CODE"
          autoComplete="off"
          spellCheck={false}
          className="min-h-12 min-w-0 border border-white/15 bg-black/70 px-3 font-mono text-sm uppercase tracking-[0.2em] text-white placeholder:text-zinc-600"
        />
        <button type="submit" className="ui-button ui-button-hot">
          run code
        </button>
      </form>

      <div
        aria-live="polite"
        className={`mt-4 border px-3 py-2 font-mono text-xs leading-5 ${
          status.kind === "error"
            ? "border-fuchsia-300/45 bg-fuchsia-400/10 text-fuchsia-100"
            : "border-sky-300/35 bg-sky-400/10 text-sky-100"
        }`}
      >
        <span className="text-zinc-500">system:</span> {statusMessage}
        {(status.kind === "success" || status.kind === "repeat") &&
        status.code.href ? (
          <Link
            href={status.code.href}
            className="ml-2 inline-flex text-lime-200 underline underline-offset-4"
          >
            open file
          </Link>
        ) : null}
      </div>

      {unlockedCodes.length ? (
        <div className="mt-4 grid gap-2">
          {unlockedCodes.map((code) => (
            <div
              key={code.code}
              className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em]"
            >
              <span className="text-zinc-500">{code.label}</span>
              <span className="text-lime-200">{code.code}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
