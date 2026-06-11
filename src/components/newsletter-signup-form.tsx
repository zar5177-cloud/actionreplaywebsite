"use client";

import { FormEvent, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { attributionToFormFields } from "@/lib/analytics/utm";

export type NewsletterSignupMethod = "popup" | "footer" | "replay_club" | "inline";

export type NewsletterSignupResult = {
  code: string;
  message: string;
};

type NewsletterSignupFormProps = {
  className?: string;
  method: NewsletterSignupMethod;
  onSuccess?: () => void;
  placement: string;
  source?: string;
  variant?: "popup" | "footer";
};

type SubmitState =
  | { kind: "idle"; message?: string }
  | { kind: "loading"; message: string }
  | { kind: "success"; code: string; message: string }
  | { kind: "error"; message: string };

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isNewsletterEmail(value: string) {
  return isEmail(value);
}

export async function submitNewsletterSignup({
  email,
  method,
  placement,
  source,
}: {
  email: string;
  method: NewsletterSignupMethod;
  placement: string;
  source: string;
}): Promise<NewsletterSignupResult> {
  const attribution = attributionToFormFields();
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attribution,
      current_page: window.location.pathname,
      email,
      method,
      placement,
      source,
    }),
  });
  const payload = (await response.json()) as {
    ok?: boolean;
    code?: string;
    error?: string;
    message?: string;
  };

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.error ??
        "Something went wrong. Try again or email us at support@shopactionreplay.com",
    );
  }

  window.localStorage.setItem(
    "ar_newsletter_signup",
    JSON.stringify({
      email,
      method,
      placement,
      source,
      timestamp: new Date().toISOString(),
      ...attribution,
    }),
  );
  trackEvent({ name: "newsletter_signup", method, placement });

  return {
    code: payload.code ?? "REPLAY10",
    message: payload.message ?? "Your code is active. Use it at checkout.",
  };
}

export function NewsletterSignupForm({
  className = "",
  method,
  onSuccess,
  placement,
  source = "site",
  variant = "popup",
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const fieldId = `newsletter-email-${placement}`;
  const isFooter = variant === "footer";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!isEmail(cleanEmail)) {
      setState({ kind: "error", message: "enter a real email file." });
      return;
    }

    setState({ kind: "loading", message: "requesting access..." });

    try {
      const result = await submitNewsletterSignup({
        email: cleanEmail,
        method,
        placement,
        source,
      });
      setState({
        kind: "success",
        code: result.code,
        message: result.message,
      });
      setEmail("");
      onSuccess?.();
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

  if (state.kind === "success") {
    return (
      <div
        className={`border border-lime-300/35 bg-lime-300/[0.07] p-3 ${className}`}
      >
        <p className="font-mono text-xs uppercase leading-5 tracking-[0.12em] text-lime-100">
          {state.message}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
          <div className="flex min-h-11 items-center border border-lime-300/40 bg-black px-3 font-mono text-sm font-black uppercase tracking-[0.18em] text-white">
            {state.code}
          </div>
          <button
            type="button"
            onClick={() => void copyCode(state.code)}
            className="flex min-h-11 items-center justify-center gap-2 border border-lime-300 bg-lime-300 px-3 font-mono text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-white"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "copied" : "copy code"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`${isFooter ? "grid gap-2" : "grid gap-3"} ${className}`}
    >
      {isFooter ? (
        <label
          htmlFor={fieldId}
          className="font-mono text-xs uppercase tracking-[0.2em] text-blue-300"
        >
          Stay in the loop
        </label>
      ) : (
        <label className="sr-only" htmlFor={fieldId}>
          Email
        </label>
      )}
      <div className={isFooter ? "grid gap-2 sm:grid-cols-[1fr_auto]" : "grid gap-2"}>
        <span className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={17}
          />
          <input
            id={fieldId}
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            className="ar-input ar-input-icon"
          />
        </span>
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="ui-button ui-button-hot min-h-12"
        >
          {state.kind === "loading" ? "loading..." : isFooter ? "join" : "unlock 10%"}
        </button>
      </div>
      {state.kind === "error" ? (
        <p className="font-mono text-xs leading-5 text-fuchsia-200">
          {state.message}
        </p>
      ) : null}
      <p className="font-mono text-[0.68rem] uppercase leading-5 tracking-[0.12em] text-zinc-500">
        No spam. Drop alerts only.
      </p>
    </form>
  );
}
