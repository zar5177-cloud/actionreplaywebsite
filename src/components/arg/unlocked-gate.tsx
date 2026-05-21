"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { localStorageUnlockKey } from "@/data/config/cheat-codes";

type UnlockedGateProps = {
  requiredCode: string;
  lockedTitle: string;
  lockedCopy: string;
  children: ReactNode;
};

export function UnlockedGate({
  requiredCode,
  lockedTitle,
  lockedCopy,
  children,
}: UnlockedGateProps) {
  const [state, setState] = useState<"loading" | "locked" | "unlocked">(
    "loading",
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(localStorageUnlockKey);
        const parsed = stored ? JSON.parse(stored) : [];
        const unlocked =
          Array.isArray(parsed) &&
          parsed.some((value) => value === requiredCode.toUpperCase());

        setState(unlocked ? "unlocked" : "locked");
      } catch {
        setState("locked");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [requiredCode]);

  if (state === "loading") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="crt-panel p-6 font-mono text-sm uppercase tracking-[0.18em] text-zinc-400">
          checking local save...
        </div>
      </section>
    );
  }

  if (state === "locked") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="crt-panel p-6 sm:p-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-fuchsia-200">
            access denied
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
            {lockedTitle}
          </h1>
          <p className="mt-4 max-w-xl font-mono text-sm leading-6 text-zinc-300">
            {lockedCopy}
          </p>
          <Link href="/" className="ui-button mt-6 inline-flex">
            return to code input
          </Link>
        </div>
      </section>
    );
  }

  return children;
}
