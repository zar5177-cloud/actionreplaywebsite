"use client";

import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";

type ShareArchiveLinkProps = {
  className?: string;
  label?: string;
  path?: string;
  placement: string;
};

function shareUrl(path: string, placement: string) {
  const base =
    typeof window === "undefined"
      ? "https://shopactionreplay.com"
      : window.location.origin;
  const url = new URL(path, base);

  url.searchParams.set("utm_source", "site");
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_campaign", "replay_referral_2026_06");
  url.searchParams.set("utm_content", placement);

  return url.toString();
}

export function ShareArchiveLink({
  className = "",
  label = "send the archive",
  path = "/go",
  placement,
}: ShareArchiveLinkProps) {
  const [state, setState] = useState<"idle" | "copied" | "shared">("idle");

  async function copyLink() {
    const nextUrl = shareUrl(path, placement);

    if (navigator.share) {
      try {
        await navigator.share({
          text: "Action Replay archive access",
          title: "Action Replay",
          url: nextUrl,
        });
        trackEvent({
          name: "copy_share_link",
          location: placement,
          share_url: nextUrl,
        });
        setState("shared");
        return;
      } catch {
        // User dismissed the native sheet. The copy path below still works.
      }
    }

    await navigator.clipboard.writeText(nextUrl);
    trackEvent({
      name: "copy_share_link",
      location: placement,
      share_url: nextUrl,
    });
    setState("copied");
  }

  return (
    <div className={`border border-white/10 bg-black/50 p-3 ${className}`}>
      <p className="font-mono text-[0.68rem] uppercase leading-5 tracking-[0.14em] text-zinc-500">
        send this to one person who would actually understand the folder.
      </p>
      <button
        type="button"
        onClick={() => void copyLink()}
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 border border-lime-300/70 bg-lime-300 px-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white"
      >
        {state === "idle" ? (
          <Send size={15} />
        ) : state === "copied" ? (
          <Check size={15} />
        ) : (
          <Copy size={15} />
        )}
        {state === "idle"
          ? label
          : state === "copied"
            ? "link copied"
            : "share sheet opened"}
      </button>
    </div>
  );
}
