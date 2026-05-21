import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Collection } from "@/lib/brand-data";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={collection.href}
      className="group relative block min-h-[250px] min-w-0 overflow-hidden border border-white/15 bg-zinc-950 text-white"
      style={{ "--collection-accent": collection.accent } as React.CSSProperties}
    >
      <Image
        src={collection.image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="object-cover opacity-55 grayscale transition duration-500 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-x-0 top-0 flex min-w-0 items-center justify-between gap-3 border-b border-white/15 bg-black/60 px-3 py-2 font-mono text-xs uppercase text-white">
        <span className="min-w-0 truncate">{collection.label}</span>
        <Star size={16} className="shrink-0 text-[var(--collection-accent)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="break-words text-2xl font-black uppercase leading-none text-white">
          {collection.title}
        </h3>
        <p className="mt-2 max-w-xs font-mono text-xs leading-5 text-zinc-300">
          {collection.summary}
        </p>
        <div className="mt-4 inline-flex max-w-full items-center gap-2 border border-white/20 bg-black px-3 py-2 font-mono text-xs uppercase text-white transition group-hover:border-[var(--collection-accent)] group-hover:text-[var(--collection-accent)]">
          Shop now <ArrowUpRight size={14} className="shrink-0" />
        </div>
      </div>
    </Link>
  );
}
