import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SecretCodeConsole } from "@/components/arg/secret-code-console";
import { ReplayClubSignup } from "@/components/replay-club-signup";
import { archiveFiles } from "@/data/config/archive-files";

type ArchiveDetailPageProps = {
  params: Promise<{ fileId: string }>;
};

function findArchiveFile(fileId: string) {
  const normalized = decodeURIComponent(fileId).toLowerCase();

  return archiveFiles.find(
    (file) =>
      file.id.toLowerCase() === normalized ||
      file.fileName.toLowerCase() === normalized,
  );
}

export async function generateStaticParams() {
  return archiveFiles.map((file) => ({ fileId: file.id }));
}

export async function generateMetadata({
  params,
}: ArchiveDetailPageProps): Promise<Metadata> {
  const { fileId } = await params;
  const file = findArchiveFile(fileId);

  if (!file) {
    return { title: "Archive file missing" };
  }

  return {
    title: `${file.id} ${file.title}`,
    description: file.description,
  };
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const { fileId } = await params;
  const file = findArchiveFile(fileId);

  if (!file) {
    notFound();
  }

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_24rem]">
        <article className="border border-sky-300/35 bg-black/70 p-5 sm:p-7">
          <Link
            href="/archive"
            className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500 hover:text-sky-200"
          >
            /archive/index
          </Link>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.26em] text-lime-200">
            FILE ID: {file.id}
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
            {file.title}
          </h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-6 text-zinc-300">
            {file.description}
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["classification", file.classification ?? "untyped"],
              ["status", file.status ?? file.rarity],
              ["access", file.accessTier ?? "open"],
              ["timestamp", file.timestamp],
              ["checksum", file.checksum],
              [
                "corruption",
                typeof file.corruptionLevel === "number"
                  ? `${file.corruptionLevel}%`
                  : "unlogged",
              ],
            ].map(([label, value]) => (
              <div key={label} className="border border-white/10 bg-white/[0.03] p-3">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-zinc-600">
                  {label}
                </p>
                <p className="mt-1 font-mono text-xs uppercase text-zinc-100">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {file.systemNote ? (
            <p className="mt-5 border-l-2 border-lime-300/60 bg-lime-300/10 p-3 font-mono text-xs uppercase leading-5 text-lime-100">
              system note: {file.systemNote}
            </p>
          ) : null}

          <div className="mt-6 border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">
              recovery notes
            </p>
            <ul className="mt-3 space-y-2 font-mono text-xs leading-5 text-zinc-300">
              {file.recoveryNotes.map((note) => (
                <li key={note}>/ {note}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {file.productHandle ? (
              <Link href={`/shop/${file.productHandle}`} className="ui-button ui-button-hot">
                view artifact
              </Link>
            ) : null}
            <Link href="/codes" className="ui-button">
              enter code
            </Link>
          </div>
        </article>

        <aside className="grid content-start gap-4">
          {file.status === "locked" ? (
            <ReplayClubSignup
              placement={`archive_detail_${file.id}`}
              source="archive_detail"
              title="REQUEST CLEARANCE"
              copy="this file is visible because the index leaked. the preview still needs replay club access."
            />
          ) : (
            <SecretCodeConsole />
          )}
        </aside>
      </div>
    </section>
  );
}
