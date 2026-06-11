"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { attributionToFormFields } from "@/lib/analytics/utm";

type SignalSurveyProps = {
  delayMs?: number;
  options: string[];
  placement: string;
  question: string;
  questionId: string;
};

const SESSION_PREFIX = "ar_signal_survey_seen_";
const LOCAL_RESPONSES_KEY = "ar_signal_survey_responses";

function readResponses() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_RESPONSES_KEY) ?? "[]") as
      | unknown[]
      | [];
  } catch {
    return [];
  }
}

function surveySessionId() {
  if (typeof window === "undefined") {
    return "";
  }

  const key = "ar_signal_survey_session_id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `survey-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.sessionStorage.setItem(key, next);
  return next;
}

export function SignalSurvey({
  delayMs = 20000,
  options,
  placement,
  question,
  questionId,
}: SignalSurveyProps) {
  const [isVisible, setVisible] = useState(false);
  const storageKey = useMemo(() => `${SESSION_PREFIX}${questionId}`, [questionId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setVisible(true);
      window.sessionStorage.setItem(storageKey, "shown");
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [delayMs, storageKey]);

  async function answerSurvey(answer: string) {
    const page = window.location.pathname;
    const payload = {
      answer,
      attribution: attributionToFormFields(),
      page,
      placement,
      question,
      question_id: questionId,
      session_id: surveySessionId(),
      timestamp: new Date().toISOString(),
    };

    window.localStorage.setItem(
      LOCAL_RESPONSES_KEY,
      JSON.stringify([...readResponses(), payload].slice(-50)),
    );

    trackEvent({ name: "survey_answer", question_id: questionId, answer, page });
    setVisible(false);

    await fetch("/api/research/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  }

  function dismissSurvey() {
    window.sessionStorage.setItem(storageKey, "dismissed");
    setVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="fixed bottom-20 left-3 z-[65] w-[calc(100vw-1.5rem)] max-w-sm border border-sky-300/35 bg-[#03040a]/95 p-3 text-white shadow-[0_0_48px_rgba(56,189,248,0.2)] backdrop-blur md:bottom-4 md:left-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-sky-200">
            visitor note / one answer
          </p>
          <p className="mt-2 font-mono text-xs uppercase leading-5 text-zinc-200">
            {question}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close survey"
          onClick={dismissSurvey}
          className="grid size-8 shrink-0 place-items-center border border-white/10 text-zinc-400 hover:border-sky-300 hover:text-sky-100"
        >
          <X size={14} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => void answerSurvey(option)}
            className="min-h-9 border border-white/12 bg-white/[0.04] px-2.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-zinc-200 transition hover:border-lime-300/60 hover:text-lime-100"
          >
            {option}
          </button>
        ))}
      </div>
    </aside>
  );
}
