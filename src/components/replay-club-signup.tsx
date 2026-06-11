"use client";

import { FormEvent, useState } from "react";
import { Mail, Radio } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { attributionToFormFields } from "@/lib/analytics/utm";
import { ShareArchiveLink } from "./share-archive-link";

type ReplayClubSignupProps = {
  placement: string;
  source?: string;
  compact?: boolean;
  title?: string;
  copy?: string;
};

type SubmitState =
  | { kind: "idle"; message?: string }
  | { kind: "loading"; message: string }
  | { kind: "success"; message: string; code: string }
  | { kind: "error"; message: string };

const platformOptions = ["DS", "PS2", "Xbox 360", "Wii", "PSP", "GameCube"];
const styleOptions = ["graphic tee", "poster", "stickers", "hoodie", "baby tee", "archive only"];

export function ReplayClubSignup({
  compact = false,
  copy = "unlock early drops, hidden codes, archive files, and private restock access.",
  placement,
  source = "site",
  title = "JOIN REPLAY CLUB",
}: ReplayClubSignupProps) {
  const [email, setEmail] = useState("");
  const [favoritePlatform, setFavoritePlatform] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "loading", message: "requesting clearance..." });

    const attribution = attributionToFormFields();

    try {
      const response = await fetch("/api/replay-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          placement,
          current_page: window.location.pathname,
          favorite_platform: favoritePlatform,
          style_preference: stylePreference,
          attribution,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        code?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "access request failed.");
      }

      window.localStorage.setItem(
        "ar_replay_club_signup",
        JSON.stringify({
          email,
          placement,
          source,
          favoritePlatform,
          stylePreference,
          timestamp: new Date().toISOString(),
          ...attribution,
        }),
      );
      trackEvent({ name: "email_signup", source, placement });
      setState({
        kind: "success",
        message: payload.message ?? "ACCESS REQUEST RECEIVED.",
        code: payload.code ?? "REPLAY10",
      });
      setEmail("");
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "replay club request failed.",
      });
    }
  }

  return (
    <section
      className={`border border-lime-300/30 bg-black/70 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center border border-lime-300/50 bg-lime-300/10 text-lime-200">
          <Radio size={18} />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
            access layer / email capture
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase leading-none text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl font-mono text-xs leading-5 text-zinc-400">
            {copy}
          </p>
        </div>
      </div>

      {state.kind === "success" ? (
        <div className="mt-4 grid gap-3">
          <div className="border border-lime-300/40 bg-lime-300/10 p-3 font-mono text-xs uppercase leading-5 text-lime-100">
            <p>{state.message}</p>
            <p className="mt-2 text-white">
              first code: <span className="text-lime-200">{state.code}</span>
            </p>
          </div>
          <ShareArchiveLink
            path="/go"
            placement={`replay_club_success_${placement}`}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="sr-only" htmlFor={`replay-email-${placement}`}>
            Email
          </label>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <span className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={17}
              />
              <input
                id={`replay-email-${placement}`}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@archive.net"
                className="ar-input ar-input-icon"
              />
            </span>
            <button
              type="submit"
              disabled={state.kind === "loading"}
              className="ui-button ui-button-hot min-h-12"
            >
              {state.kind === "loading" ? "requesting..." : "unlock access"}
            </button>
          </div>

          {!compact ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
                choose your system
                <select
                  value={favoritePlatform}
                  onChange={(event) => setFavoritePlatform(event.target.value)}
                  className="ar-input"
                >
                  <option value="">unselected</option>
                  {platformOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
                preferred file
                <select
                  value={stylePreference}
                  onChange={(event) => setStylePreference(event.target.value)}
                  className="ar-input"
                >
                  <option value="">unselected</option>
                  {styleOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
        </form>
      )}

      {state.kind === "error" ? (
        <p className="mt-3 font-mono text-xs leading-5 text-fuchsia-200">
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
