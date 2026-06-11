import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, Radio, Shirt } from "lucide-react";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { ShareArchiveLink } from "@/components/share-archive-link";

export const metadata: Metadata = {
  title: "Artifact Secured",
  description: "Action Replay post-purchase extraction note.",
  robots: {
    index: false,
    follow: false,
  },
};

const notes = [
  {
    Icon: Mail,
    label: "tracking email",
    text: "Shopify sends the normal receipt. The archive does not replace that.",
  },
  {
    Icon: Shirt,
    label: "care file",
    text: "wash cold, inside out. do not treat the print like a gas station towel.",
  },
  {
    Icon: Radio,
    label: "fit archive",
    text: "tag @actionreplay.studio or reply with a fit pic if the file should be logged.",
  },
] as const;

export default function OrderConfirmedPage() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="border border-lime-300/30 bg-black/75 p-5 text-white shadow-[0_0_72px_rgba(190,242,100,0.12)] sm:p-7">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-lime-200">
            extraction queue / post purchase
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none sm:text-7xl">
            artifact secured.
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm uppercase leading-6 text-zinc-400">
            your file is now in the extraction queue. check your email for
            normal tracking. keep the box weirdly if you want. no rule about it.
          </p>

          <div className="mt-6 grid gap-3">
            {notes.map(({ Icon, label, text }) => (
              <div
                key={label}
                className="grid gap-3 border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[2.25rem_1fr]"
              >
                <span className="grid size-9 place-items-center border border-white/15 text-lime-200">
                  <Icon size={17} />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-white">
                    {label}
                  </p>
                  <p className="mt-1 font-mono text-xs leading-5 text-zinc-500">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/archive" className="ui-button">
              reopen archive
            </Link>
            <Link href="/codes" className="ui-button ui-button-hot">
              enter code
            </Link>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="border border-white/10 bg-white/[0.03] p-4">
            <CheckCircle2 className="text-lime-200" size={24} />
            <p className="mt-3 font-mono text-xs uppercase leading-5 text-zinc-400">
              send the archive to someone who would get it before explaining it
              ruins it.
            </p>
          </div>
          <ShareArchiveLink placement="order_confirmed" path="/go" />
          <ReplayClubSignup
            compact
            placement="order_confirmed"
            source="post_purchase"
            title="REPLAY CLUB ACCESS"
            copy="private files, restock notes, strange codes, and the next thing before it gets named correctly."
          />
        </div>
      </div>
    </section>
  );
}
