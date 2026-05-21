"use client";

import { FormEvent, useState } from "react";

const localStorageSignupKey = "ar-unlock-alerts";

export function UnlockAlertSignup() {
  const [value, setValue] = useState("");
  const [isSaved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleaned = value.trim();

    if (!cleaned) return;

    const existingRaw = window.localStorage.getItem(localStorageSignupKey);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const submissions = Array.isArray(existing) ? existing : [];

    window.localStorage.setItem(
      localStorageSignupKey,
      JSON.stringify([
        ...submissions,
        { value: cleaned, submittedAt: new Date().toISOString() },
      ]),
    );
    setSaved(true);
    setValue("");
  }

  return (
    <section className="crt-panel p-4 sm:p-5" aria-labelledby="unlock-alerts">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-sky-200">
            receive unlock alerts
          </p>
          <h2
            id="unlock-alerts"
            className="mt-1 text-2xl font-black uppercase text-white"
          >
            watch the drop
          </h2>
        </div>
        <span className="border border-white/10 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
          local save
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="unlock-contact">
          Email or SMS
        </label>
        <input
          id="unlock-contact"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setSaved(false);
          }}
          placeholder="EMAIL OR SMS"
          className="min-h-12 min-w-0 border border-white/15 bg-black/70 px-3 font-mono text-sm text-white placeholder:text-zinc-600"
        />
        <button type="submit" className="ui-button">
          subscribe
        </button>
      </form>

      {isSaved ? (
        <p aria-live="polite" className="mt-3 font-mono text-xs text-lime-200">
          saved. unlock alerts armed for this browser.
        </p>
      ) : (
        <p className="mt-3 font-mono text-xs leading-5 text-zinc-500">
          Replace this localStorage write with Klaviyo, Mailchimp, or SMS capture
          when the live list is ready.
        </p>
      )}
    </section>
  );
}
