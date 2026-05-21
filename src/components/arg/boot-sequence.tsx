"use client";

import { useEffect, useState } from "react";
import { systemBootLines } from "@/data/config/brand";

export function BootSequence() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      const timeout = window.setTimeout(() => {
        setVisibleCount(systemBootLines.length);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    const timer = window.setInterval(() => {
      setVisibleCount((count) => {
        if (count >= systemBootLines.length) {
          window.clearInterval(timer);
          return count;
        }

        return count + 1;
      });
    }, 340);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Fake system boot sequence"
      className="crt-panel min-h-[17rem] p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-sky-200">
        <span>boot.log</span>
        <span className="text-lime-200">status: partial</span>
      </div>
      <ol className="space-y-2 font-mono text-xs leading-5 text-zinc-300 sm:text-sm">
        {systemBootLines.slice(0, visibleCount).map((line, index) => (
          <li key={line} className="flex gap-2">
            <span className="shrink-0 text-zinc-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
      <p className="mt-5 inline-flex border border-lime-300/45 bg-lime-300/10 px-2 py-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-lime-100">
        waiting for user input<span className="ml-1 animate-pulse">_</span>
      </p>
    </section>
  );
}
