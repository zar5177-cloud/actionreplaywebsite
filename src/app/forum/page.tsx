import type { Metadata } from "next";
import { ForumThread } from "@/components/arg/forum-thread";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";

export const metadata: Metadata = {
  title: "Archived Forum Thread",
  description:
    "A fake old-web Action Replay forum thread about the hidden event.",
};

export default function ForumPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <ForumThread />
        </div>
        <aside className="grid content-start gap-4">
          <SecretCodeConsole />
          <div className="crt-panel p-4 font-mono text-xs leading-6 text-zinc-400">
            Mirror note: user avatars and signatures were stripped during
            recovery. One reply references a UI anomaly that still exists.
          </div>
        </aside>
      </div>
    </section>
  );
}
