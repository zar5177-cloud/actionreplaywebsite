import Link from "next/link";
import type { ReactNode } from "react";

type FragmentProps = {
  children: ReactNode;
  className?: string;
};

export function ObsoleteWarning({ children, className = "" }: FragmentProps) {
  return (
    <div
      className={`border border-amber-200/20 bg-amber-300/[0.04] px-2.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-amber-100/80 ${className}`}
    >
      <span className="text-zinc-600">obsolete warning:</span> {children}
    </div>
  );
}

export function FileStamp({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex border border-white/10 bg-black/45 px-2 py-1 font-mono text-[0.64rem] uppercase tracking-[0.15em] text-zinc-500 ${className}`}
    >
      <span className="mr-1 text-zinc-600">{label}:</span>
      <span className="text-zinc-300">{value}</span>
    </span>
  );
}

export function RestorationNote({ children, className = "" }: FragmentProps) {
  return (
    <p
      className={`border-l border-sky-300/35 pl-3 font-mono text-xs leading-5 text-zinc-400 ${className}`}
    >
      <span className="text-sky-200/80">restore note:</span> {children}
    </p>
  );
}

export function MissingAsset({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`grid min-h-24 place-items-center border border-dashed border-white/15 bg-black/45 p-3 text-center font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-600 ${className}`}
    >
      <span>{label}</span>
    </div>
  );
}

export function InternalComment({
  user,
  children,
  className = "",
}: {
  user: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-xs leading-5 text-zinc-500 ${className}`}
    >
      <span className="text-fuchsia-200/80">{user}:</span> {children}
    </p>
  );
}

export function DuplicateFileNotice({
  fileName,
  className = "",
}: {
  fileName: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-fuchsia-200/15 bg-fuchsia-300/[0.035] px-2.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-zinc-400 ${className}`}
    >
      duplicate kept: <span className="text-fuchsia-100/80">{fileName}</span>
    </div>
  );
}

export function UnlockHintFragment({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex border border-lime-300/20 bg-lime-300/[0.04] px-2.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-lime-100/80 transition hover:border-lime-200/50 hover:text-lime-50 ${className}`}
    >
      <span className="mr-1 text-zinc-600">fragment:</span>
      {children}
    </Link>
  );
}

export function TemporalMismatch({
  children,
  className = "",
}: FragmentProps) {
  return (
    <p
      className={`font-mono text-[0.68rem] leading-5 text-zinc-600 ${className}`}
    >
      <span className="text-zinc-500">metadata disagrees:</span> {children}
    </p>
  );
}

export function AliasStrip({
  aliases,
  className = "",
}: {
  aliases: readonly string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {aliases.map((alias) => (
        <span
          key={alias}
          className="border border-white/10 bg-black/35 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-zinc-500"
        >
          {alias}
        </span>
      ))}
    </div>
  );
}

export function BrokenThumbnail({
  fileRef,
  altText,
  className = "",
}: {
  fileRef: string;
  altText: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={altText}
      className={`relative overflow-hidden border border-dashed border-white/15 bg-black/55 p-3 ${className}`}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_9px)] opacity-60" />
      <div className="relative grid min-h-24 place-items-center text-center">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-zinc-600">
            image ref missing
          </p>
          <p className="mt-2 break-all font-mono text-xs text-zinc-400">
            {fileRef}
          </p>
          <p className="mt-2 font-mono text-[0.68rem] leading-5 text-zinc-600">
            alt: {altText}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DeadNavReference({
  href,
  label,
  state,
  note,
  className = "",
}: {
  href: string;
  label: string;
  state: string;
  note: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`border border-white/10 bg-black/35 px-2.5 py-2 font-mono text-[0.66rem] uppercase tracking-[0.15em] text-zinc-500 transition hover:border-zinc-500/60 hover:text-zinc-300 ${className}`}
    >
      <span className="block text-zinc-300">{label}</span>
      <span className="mt-1 block text-zinc-600">{state}</span>
      <span className="mt-1 block normal-case tracking-normal text-zinc-600">
        {note}
      </span>
    </a>
  );
}

export function PreservationNote({
  children,
  className = "",
}: FragmentProps) {
  return (
    <p
      className={`border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-xs leading-5 text-zinc-400 ${className}`}
    >
      <span className="text-amber-100/75">preserved:</span> {children}
    </p>
  );
}

export function AbsentMedia({
  label,
  fileRef,
  note,
  className = "",
}: {
  label: string;
  fileRef: string;
  note: string;
  className?: string;
}) {
  return (
    <div
      className={`border border-white/10 bg-black/45 p-3 font-mono text-xs leading-5 text-zinc-500 ${className}`}
    >
      <div className="mb-3 flex h-8 items-end gap-1" aria-hidden="true">
        {[8, 15, 5, 22, 11, 18, 6, 13, 3, 17, 9, 20].map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="w-1 bg-zinc-700/70"
            style={{ height }}
          />
        ))}
      </div>
      <p className="uppercase tracking-[0.16em] text-zinc-400">{label}</p>
      <p className="mt-1 break-all text-zinc-600">{fileRef}</p>
      <p className="mt-2 text-zinc-500">{note}</p>
    </div>
  );
}
