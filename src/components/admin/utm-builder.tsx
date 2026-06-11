"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { campaigns } from "@/data/campaigns";
import { trackEvent } from "@/lib/analytics/events";

const sources = ["instagram", "tiktok", "twitter", "discord", "reddit", "sms", "qr", "manual_dm"];
const mediums = ["story", "bio", "reel", "post", "comment", "dm", "paid", "organic"];

export function UtmBuilder() {
  const [destination, setDestination] = useState("https://shopactionreplay.com/shop/action-replay-galaxy-tee");
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("story");
  const [campaign, setCampaign] = useState(campaigns[0]?.id ?? "ar001_repush_2026_06");
  const [content, setContent] = useState("direct_flash_bluewall_slide3");
  const [term, setTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      const url = new URL(destination);
      url.searchParams.set("utm_source", source);
      url.searchParams.set("utm_medium", medium);
      url.searchParams.set("utm_campaign", campaign);
      url.searchParams.set("utm_content", content);
      if (term) {
        url.searchParams.set("utm_term", term);
      } else {
        url.searchParams.delete("utm_term");
      }
      return url.toString();
    } catch {
      return "invalid destination url";
    }
  }, [campaign, content, destination, medium, source, term]);

  async function copyLink() {
    if (!output.startsWith("http")) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    trackEvent({ name: "copy_share_link", location: "utm_builder", share_url: output });
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="border border-lime-300/30 bg-black/70 p-4 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.26em] text-lime-200">
          /admin/utm-builder
        </p>
        <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
          link stamp machine
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-6 text-zinc-400">
          Every post gets a fingerprint now. No more mystery traffic unless the
          mystery is intentional.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Field label="destination url">
            <input value={destination} onChange={(event) => setDestination(event.target.value)} className="ar-input" />
          </Field>
          <Field label="source">
            <select value={source} onChange={(event) => setSource(event.target.value)} className="ar-input">
              {sources.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="medium">
            <select value={medium} onChange={(event) => setMedium(event.target.value)} className="ar-input">
              {mediums.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="campaign">
            <select value={campaign} onChange={(event) => setCampaign(event.target.value)} className="ar-input">
              {campaigns.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
            </select>
          </Field>
          <Field label="content">
            <input value={content} onChange={(event) => setContent(event.target.value)} className="ar-input" />
          </Field>
          <Field label="term optional">
            <input value={term} onChange={(event) => setTerm(event.target.value)} className="ar-input" />
          </Field>
        </div>

        <div className="mt-5 border border-white/10 bg-white/[0.03] p-3">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
            output
          </p>
          <p className="mt-2 break-all font-mono text-sm leading-6 text-lime-100">
            {output}
          </p>
          <button type="button" onClick={copyLink} className="ui-button ui-button-hot mt-4">
            <Copy size={16} />
            {copied ? "copied" : "copy link"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">
      {label}
      {children}
    </label>
  );
}
