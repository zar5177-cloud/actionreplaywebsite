"use client";

import { useEffect, useState } from "react";
import { hiddenEvent } from "@/data/config/event";

const localStorageDiscoveryKey = "ar-shiny-pixel-discovered";

export function EventCodeHunt() {
  const [isDiscovered, setDiscovered] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDiscovered(
        window.localStorage.getItem(localStorageDiscoveryKey) === "1",
      );
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  function revealCode() {
    window.localStorage.setItem(localStorageDiscoveryKey, "1");
    setDiscovered(true);
  }

  return (
    <div className="relative min-h-[24rem] overflow-hidden border border-sky-300/25 bg-black/70 p-4 sm:min-h-[32rem] sm:p-6">
      <div className="absolute inset-0 event-grid" aria-hidden="true" />
      <div className="relative max-w-xl">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-lime-200">
          active anomaly
        </p>
        <h2 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
          search the frame
        </h2>
        <p className="mt-4 font-mono text-sm leading-6 text-zinc-300">
          Old pages did not make secrets obvious. One pixel is behaving like a
          link.
        </p>
      </div>

      <button
        type="button"
        aria-label="Hidden clickable pixel"
        onClick={revealCode}
        className="absolute right-[18%] top-[57%] size-3 border border-sky-100/40 bg-sky-200/80 shadow-[0_0_18px_rgba(125,211,252,0.7)] transition hover:scale-150 focus-visible:scale-150 sm:size-2"
      />

      {isDiscovered ? (
        <div
          aria-live="polite"
          className="absolute bottom-4 left-4 right-4 border border-lime-300/55 bg-lime-300/10 p-4 font-mono text-sm uppercase tracking-[0.16em] text-lime-100 sm:bottom-6 sm:left-6 sm:right-auto"
        >
          code found: {hiddenEvent.revealedCode}
        </div>
      ) : null}
    </div>
  );
}
