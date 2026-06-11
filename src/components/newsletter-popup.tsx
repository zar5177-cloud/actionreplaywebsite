"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  isNewsletterEmail,
  submitNewsletterSignup,
  type NewsletterSignupResult,
} from "./newsletter-signup-form";

const SESSION_KEY = "ar_newsletter_popup_seen";
const DISMISSED_KEY = "ar_newsletter_popup_dismissed_at";
const SUBMITTED_KEY = "ar_newsletter_popup_submitted_at";
const DISMISS_SUPPRESSION_MS = 7 * 24 * 60 * 60 * 1000;
const SUBMIT_SUPPRESSION_MS = 365 * 24 * 60 * 60 * 1000;

function timestampFresh(key: string, ttl: number) {
  if (typeof window === "undefined") return false;

  const raw = window.localStorage.getItem(key);
  if (!raw) return false;

  const timestamp = Number.parseInt(raw, 10);
  if (!Number.isFinite(timestamp)) return false;

  return Date.now() - timestamp < ttl;
}

function shouldSuppress(pathname: string) {
  if (pathname.startsWith("/checkout") || pathname.startsWith("/order-confirmed")) {
    return true;
  }

  if (typeof window === "undefined") {
    return true;
  }

  return (
    window.sessionStorage.getItem(SESSION_KEY) === "1" ||
    timestampFresh(DISMISSED_KEY, DISMISS_SUPPRESSION_MS) ||
    timestampFresh(SUBMITTED_KEY, SUBMIT_SUPPRESSION_MS)
  );
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (shouldSuppress(pathname)) {
      return;
    }

    let triggered = false;
    const trigger = () => {
      if (triggered || shouldSuppress(pathname)) {
        return;
      }

      triggered = true;
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(true);
    };
    const delayMs = 8000 + Math.floor(Math.random() * 4000);
    const timeout = window.setTimeout(trigger, delayMs);
    const onScroll = () => {
      const documentElement = document.documentElement;
      const scrollable =
        documentElement.scrollHeight - documentElement.clientHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

      if (progress >= 0.4) {
        trigger();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  function dismiss() {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  }

  function markSubmitted() {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    window.localStorage.setItem(SUBMITTED_KEY, String(Date.now()));
  }

  if (!isVisible) return null;

  return (
    <div className="ar-popup-backdrop fixed inset-0 z-[85] flex items-center justify-center bg-black/66 p-2 backdrop-blur-[3px] sm:p-4">
      <button
        type="button"
        aria-label="Close newsletter popup overlay"
        onClick={dismiss}
        className="absolute inset-0"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="ar-popup-panel relative aspect-[1288/805] bg-[url('/assets/generated/current-drop/actionreplay-popupui1.png')] bg-contain bg-center bg-no-repeat text-white"
        style={{
          width: "min(96vw, 1100px, calc((100dvh - 1rem) * 1288 / 805))",
        }}
      >
        <h2 id="newsletter-popup-title" className="sr-only">
          Get 10% off
        </h2>
        <ArtworkNewsletterControls
          dismiss={dismiss}
          markSubmitted={markSubmitted}
        />
      </section>
    </div>
  );
}

function ArtworkNewsletterControls({
  dismiss,
  markSubmitted,
}: {
  dismiss: () => void;
  markSubmitted: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success"; result: NewsletterSignupResult }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!isNewsletterEmail(cleanEmail)) {
      setState({ kind: "error", message: "ENTER A REAL EMAIL FILE." });
      return;
    }

    setState({ kind: "loading" });

    try {
      const result = await submitNewsletterSignup({
        email: cleanEmail,
        method: "popup",
        placement: "newsletter_popup",
        source: "popup",
      });
      setState({ kind: "success", result });
      setEmail("");
      markSubmitted();
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Try again or email us at support@shopactionreplay.com",
      });
    }
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(true);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close email signup"
        onClick={dismiss}
        className="absolute z-20 rounded-[0.45rem] outline-none transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-sky-200"
        style={{
          height: "6.8%",
          left: "86%",
          top: "6.8%",
          width: "4.7%",
        }}
      />

      {state.kind === "success" ? (
        <div
          className="absolute z-20 grid content-center rounded-[0.85rem] border border-white/55 bg-white/82 px-[2%] text-center shadow-[0_0_24px_rgba(255,255,255,0.55)] backdrop-blur-sm"
          style={{
            height: "9.4%",
            left: "18.5%",
            top: "66.2%",
            width: "63.2%",
          }}
        >
          <p className="font-mono text-[clamp(0.45rem,1.22vw,0.9rem)] font-black uppercase tracking-[0.12em] text-[#245ec4]">
            {state.result.message}
          </p>
          <div className="mt-[0.4%] flex items-center justify-center gap-[2%]">
            <span className="font-mono text-[clamp(0.7rem,2vw,1.45rem)] font-black italic tracking-[0.18em] text-[#123f9c]">
              {state.result.code}
            </span>
            <button
              type="button"
              onClick={() => void copyCode(state.result.code)}
              className="rounded-full border border-[#4d8bf5]/60 bg-[#eaf6ff] px-[2%] py-[0.4%] font-mono text-[clamp(0.42rem,1vw,0.72rem)] font-black uppercase tracking-[0.1em] text-[#245ec4] shadow-[0_0_12px_rgba(77,139,245,0.28)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245ec4]"
            >
              {copied ? "copied" : "copy"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="absolute inset-0 z-10">
          <label htmlFor="newsletter-popup-art-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-popup-art-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            className="absolute rounded-[0.55rem] border-0 bg-transparent px-[2.2%] font-mono text-[clamp(0.64rem,1.65vw,1.2rem)] font-black uppercase italic tracking-[0.11em] text-[#1f56bf] outline-none placeholder:text-[#7ba9e8]/70 focus:bg-white/22 focus:shadow-[inset_0_0_18px_rgba(255,255,255,0.36)]"
            style={{
              height: "7.9%",
              left: "18.35%",
              top: "66.8%",
              width: "63.1%",
            }}
          />
          <button
            type="submit"
            aria-label="Submit email for 10 percent off"
            disabled={state.kind === "loading"}
            className="absolute rounded-[0.85rem] outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sky-100 disabled:cursor-wait"
            style={{
              height: "12.2%",
              left: "24.1%",
              top: "80.5%",
              width: "52.8%",
            }}
          />
        </form>
      )}

      {state.kind === "error" ? (
        <p
          className="absolute z-20 text-center font-mono text-[clamp(0.46rem,1.1vw,0.78rem)] font-black uppercase tracking-[0.08em] text-[#174494] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]"
          style={{
            left: "22%",
            top: "75.4%",
            width: "56%",
          }}
        >
          {state.message}
        </p>
      ) : null}
    </>
  );
}
