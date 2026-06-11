import type { Metadata } from "next";
import { creativeRecords } from "@/data/content-lab";

export const metadata: Metadata = {
  title: "Content Lab",
  description: "Internal Action Replay creative performance registry.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContentLabPage() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="section-kicker">/content-lab</p>
        <h1 className="section-title">creative performance registry</h1>
        <div className="mt-7 overflow-x-auto border border-white/10 bg-black/70">
          <table className="min-w-full text-left font-mono text-xs uppercase">
            <thead className="text-zinc-500">
              <tr>
                {["id", "platform", "format", "style", "sessions", "signups", "sales", "winner"].map((head) => (
                  <th key={head} className="border-b border-white/10 px-3 py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creativeRecords.map((record) => (
                <tr key={record.id} className="text-zinc-300">
                  <td className="border-b border-white/10 px-3 py-3 text-lime-200">{record.id}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.platform}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.format}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.visualStyle}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.sessions}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.emailSignups}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.sales}</td>
                  <td className="border-b border-white/10 px-3 py-3">{record.winner ? "yes" : "no"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
