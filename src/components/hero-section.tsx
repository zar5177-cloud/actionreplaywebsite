import Image from "next/image";
import Link from "next/link";
import { Archive, ArrowUpRight, BadgeCheck, LockKeyhole, Radio } from "lucide-react";
import {
  products as fallbackProducts,
  type Product,
} from "@/lib/brand-data";
import { assetById } from "@/lib/assets-manifest";
import { formatUsdPrice } from "@/lib/money";

const cities = ["NYC", "MADRID", "SEOUL", "JAPAN", "LONDON"];

export function HeroSection({
  products = fallbackProducts,
}: {
  products?: Product[];
}) {
  const liveProducts = products.filter(
    (product) => product.productState === "live",
  );
  const tee = liveProducts.find((product) => product.category === "tees");
  const poster = liveProducts.find((product) => product.slug.includes("poster"));

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#050508] text-white">
      <Image
        src={assetById["galaxy-poster-product-black"].src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_67%_28%,rgba(174,124,255,0.34),transparent_30%),linear-gradient(90deg,#030305_0%,rgba(3,3,5,0.78)_34%,rgba(3,3,5,0.28)_62%,#030305_100%)]" />
      <div className="scanline absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-[1680px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)] lg:px-8 lg:py-8">
        <div className="flex min-w-0 flex-col justify-between gap-8">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-100">
            <span className="rounded-full border border-violet-300/50 bg-black/70 px-3 py-2">
              AR-001 available
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2">
              AR-003 poster
            </span>
            <span className="rounded-full border border-lime-300/60 bg-lime-300/10 px-3 py-2 text-lime-100">
              15% pair credit
            </span>
          </div>

          <div className="min-w-0">
            <Image
              src={assetById["action-replay-ar-mark-white"].src}
              alt="Action Replay"
              width={86}
              height={86}
              priority
              className="mb-5 h-16 w-16 object-contain opacity-90 drop-shadow-[0_0_18px_rgba(255,255,255,0.34)] sm:h-20 sm:w-20"
            />
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-blue-200">
              don&apos;t cheat the player, cheat the game
            </p>
            <h1 className="mt-4 max-w-[11ch] break-words text-6xl font-black uppercase leading-[0.76] text-white sm:text-8xl lg:text-[8.5rem] xl:text-[10rem]">
              Action Replay
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg">
              AR-001 // Galaxy Tee. First wearable artifact recovered from the
              replay archive. A corrupted DS-era cheat-code file that learned
              how to be clothing.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr] sm:items-end">
            <Link
              href={tee ? `/shop/${tee.slug}` : "/shop"}
              className="inline-flex h-14 items-center justify-center gap-2 border border-blue-300 bg-blue-600 px-5 font-mono text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_0_38px_rgba(37,99,235,0.34)] transition hover:border-lime-300 hover:bg-violet-600"
            >
              Shop AR-001
              <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/archive"
              className="inline-flex h-14 items-center justify-center gap-2 border border-white/15 bg-black/70 px-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-sky-300 hover:text-sky-100"
            >
              <Archive size={16} />
              Enter archive
            </Link>
            <Link
              href="/replay-club"
              className="inline-flex h-14 items-center justify-center gap-2 border border-lime-300/70 bg-lime-300/10 px-4 font-mono text-xs font-black uppercase tracking-[0.14em] text-lime-100 transition hover:bg-lime-300 hover:text-black"
            >
              <Radio size={16} />
              Join Replay Club
            </Link>
            <div className="grid grid-cols-5 border border-white/15 bg-black/70 sm:col-span-3">
              {cities.map((city) => (
                <span
                  key={city}
                  className="border-r border-white/10 px-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-300 last:border-r-0"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-rows-[minmax(360px,1fr)_auto]">
          <div className="grid min-h-[380px] gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.56fr)] lg:min-h-0">
            <Link
              href={tee ? `/shop/${tee.slug}` : "/shop"}
              className="group relative min-h-[420px] overflow-hidden border border-violet-300/35 bg-black shadow-[0_0_60px_rgba(139,92,246,0.20)] md:min-h-0"
            >
              <Image
                src={tee?.images[0] ?? assetById["galaxy-tee-editorial-blue"].src}
                alt={tee?.title ?? "AR-001 Galaxy tee"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 48vw"
                className="object-cover object-[38%_72%] brightness-[1.08] transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-black/10" />
              <div className="absolute left-3 top-3 border border-white/20 bg-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-blue-100">
                Galaxy tee / {tee ? formatUsdPrice(tee.price) : "$48"}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="max-w-xl text-4xl font-black uppercase leading-none text-white sm:text-5xl">
                  AR-001 &quot;GALAXY&quot; Tee
                </h2>
                <p className="mt-2 max-w-md font-mono text-xs uppercase leading-5 text-zinc-300">
                  Enzyme-washed cotton, purple Galaxy graphic, sleeve mark,
                  soft broken-in weight.
                </p>
              </div>
            </Link>

            <Link
              href={poster ? `/shop/${poster.slug}` : "/shop"}
              className="group relative min-h-[420px] overflow-hidden border border-blue-300/30 bg-black md:min-h-0"
            >
              <Image
                src={poster?.images[0] ?? assetById["action-replay-2026-promo-poster"].src}
                alt={poster?.title ?? "Action Replay promo poster"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28vw"
                className="object-contain object-center p-2 transition duration-700 group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              <div className="absolute left-3 top-3 flex items-center gap-2 border border-lime-300/60 bg-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-100">
                <LockKeyhole size={13} />
                Promo poster / {poster ? formatUsdPrice(poster.price) : "$42"}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-violet-100">
                  24 x 36 print
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase leading-none text-white">
                  Corrupted promo poster
                </h2>
              </div>
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Secure checkout", "Orders complete through Shopify."],
              ["Worldwide shipping", "Rates return at checkout."],
              ["Pair credit", "Tee plus poster saves 15%."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="min-w-0 border border-white/15 bg-black/75 p-4 backdrop-blur"
              >
                <BadgeCheck className="text-lime-300" size={18} />
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-white">
                  {title}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase leading-5 text-zinc-500">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
