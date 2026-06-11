"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { NewsletterSignupForm } from "./newsletter-signup-form";

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
    <div className="fixed inset-0 z-[85] flex items-end bg-black/68 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
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
        className="relative w-full border-t border-lime-300/30 bg-[#03040a] p-5 text-white shadow-[0_-24px_90px_rgba(0,0,0,0.55)] sm:max-w-md sm:border sm:border-lime-300/25 sm:shadow-[0_0_90px_rgba(190,242,100,0.14)]"
      >
        <button
          type="button"
          aria-label="Close email signup"
          onClick={dismiss}
          className="absolute right-3 top-3 grid size-9 place-items-center border border-white/10 text-zinc-400 transition hover:border-lime-300/60 hover:text-lime-100"
        >
          <X size={16} />
        </button>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
          file access / email
        </p>
        <h2
          id="newsletter-popup-title"
          className="mt-2 pr-10 text-4xl font-black uppercase leading-none text-white"
        >
          JOIN THE ARCHIVE
        </h2>
        <p className="mt-3 max-w-sm font-mono text-xs uppercase leading-5 text-zinc-400">
          Sign up for 10% off your first order + early drop access.
        </p>
        <div className="mt-4">
          <NewsletterSignupForm
            method="popup"
            onSuccess={markSubmitted}
            placement="newsletter_popup"
            source="popup"
            variant="popup"
          />
        </div>
      </section>
    </div>
  );
}
