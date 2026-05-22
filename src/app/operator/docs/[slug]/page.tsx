import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const docs = {
  strategy: {
    title: "Strategy Doc",
    file: "README.md",
  },
  "account-universe": {
    title: "Account Universe Bible",
    file: "account-universe-bible.md",
  },
  "comment-caption-bank": {
    title: "Comment And Caption Bank",
    file: "comment-caption-bank.md",
  },
  "templates-and-archives": {
    title: "Templates And Archives",
    file: "templates-and-archives.md",
  },
  "drop-unlock-outreach-metrics": {
    title: "Drop Unlock Outreach Metrics",
    file: "drop-unlock-outreach-metrics.md",
  },
  "human-residue-layer": {
    title: "Human Residue Layer",
    file: "human-residue-layer.md",
  },
  "content-calendar-30-days": {
    title: "30-Day Content Calendar",
    file: "content-calendar-30-days.md",
  },
} as const;

type DocSlug = keyof typeof docs;

type OperatorDocPageProps = {
  params: Promise<{ slug: string }>;
};

function isDocSlug(value: string): value is DocSlug {
  return value in docs;
}

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: OperatorDocPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isDocSlug(slug)) {
    return {
      title: "Operator Doc Missing",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: docs[slug].title,
    description: "Action Replay internal growth-system markdown artifact.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OperatorDocPage({ params }: OperatorDocPageProps) {
  if (process.env.ENABLE_OPERATOR_CONSOLE !== "true") {
    notFound();
  }

  const { slug } = await params;

  if (!isDocSlug(slug)) {
    notFound();
  }

  const doc = docs[slug];
  const filePath = path.join(
    process.cwd(),
    "docs",
    "growth-system",
    doc.file,
  );
  const body = await readFile(filePath, "utf8");

  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/operator" className="ui-button">
          <ArrowLeft size={17} aria-hidden="true" />
          operator console
        </Link>

        <article className="crt-panel mt-6 p-4 sm:p-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-lime-200">
            docs/growth-system/{doc.file}
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-none text-white sm:text-6xl">
            {doc.title}
          </h1>
          <pre className="mt-6 whitespace-pre-wrap break-words border border-white/10 bg-black/65 p-4 font-mono text-xs leading-6 text-zinc-200 sm:text-sm">
            {body}
          </pre>
        </article>
      </div>
    </section>
  );
}
