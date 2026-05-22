import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[8px] border border-white/10 bg-black/70 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.3)] sm:p-8">
          <h1 className="mt-5 text-5xl font-black uppercase leading-none text-white sm:text-7xl">
            Page unavailable
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
            This page is not part of the current public capsule. Return to the
            shop or browse the archive.
          </p>
          <Link href="/shop" className="ui-button mt-6">
            <ArrowLeft size={17} aria-hidden="true" />
            back to shop
          </Link>
        </div>
      </div>
    </section>
  );
}
