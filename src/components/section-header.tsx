import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-white/15 pb-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-blue-300">
          {eyebrow}
        </p>
        <h2 className="mt-2 max-w-4xl text-3xl font-black uppercase leading-none text-white sm:text-5xl">
          {title}
        </h2>
        {copy ? (
          <p className="mt-3 max-w-2xl font-mono text-sm leading-6 text-zinc-300">
            {copy}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 md:w-auto">{action}</div> : null}
    </div>
  );
}
