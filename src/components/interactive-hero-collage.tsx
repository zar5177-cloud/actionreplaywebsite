"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { assetById } from "@/lib/assets-manifest";

type CollageItem = {
  assetId: keyof typeof assetById;
  code: string;
  href: string;
  desktopClassName: string;
};

const LIVE_SHOP_LABEL = "Open product file";

const collageItems: CollageItem[] = [
  {
    assetId: "galaxy-tee-product",
    code: "01",
    href: "/shop/action-replay-galaxy-tee",
    desktopClassName: "z-[5] left-[0%] top-[21%] h-[48%] w-[32%] rotate-[-2deg]",
  },
  {
    assetId: "action-replay-2026-promo-poster",
    code: "02",
    href: "/shop/ar-003-corrupted-promo-poster",
    desktopClassName: "z-[4] left-[31%] top-[6%] h-[70%] w-[34%] rotate-[2deg]",
  },
];

export function InteractiveHeroCollage({ compact = false }: { compact?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = collageItems.map((item) => ({
    ...item,
    asset: assetById[item.assetId],
  }));

  const scrollBy = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({
      behavior: "smooth",
      left: direction * 430,
    });
  };

  if (compact) {
    return (
      <div className="relative mb-6 xl:hidden">
        <div className="mt-5 flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Scroll product rail left"
            onClick={() => scrollBy(-1)}
            className="grid size-9 place-items-center border border-white/20 bg-black/80 text-white transition hover:border-blue-300 hover:text-blue-200"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="Scroll product rail right"
            onClick={() => scrollBy(1)}
            className="grid size-9 place-items-center border border-white/20 bg-black/80 text-white transition hover:border-blue-300 hover:text-blue-200"
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <div
          ref={scrollRef}
          className="-mx-4 mt-2 overflow-x-auto px-4 pb-2 hero-collage-scroll sm:-mx-6 sm:px-6"
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              event.currentTarget.scrollLeft += event.deltaY;
            }
          }}
        >
          <div className="flex w-max gap-3 pr-16">
            {items.map(({ asset, assetId, code, href }) => (
              <Link
                key={assetId}
                href={href}
                className="hero-collage-card group relative grid h-44 w-44 shrink-0 place-items-center overflow-hidden border border-blue-400/35 bg-black/70"
                aria-label="Open live shop"
              >
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="176px"
                  className="object-contain p-4 transition duration-300 group-hover:scale-110"
                />
                <span className="absolute left-2 top-2 border border-white/20 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase text-blue-200">
                  {code}
                </span>
                <span className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2 border border-white/15 bg-black/85 px-2 py-2 font-mono text-[10px] uppercase text-white">
                  {LIVE_SHOP_LABEL}
                  <ArrowUpRight size={12} className="text-blue-300" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-collage-zone pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
      <div className="hero-art-plane absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2">
            {items.map(({ asset, assetId, desktopClassName, code, href }) => (
          <Link
            key={assetId}
            href={href}
            data-collage-item={assetId}
            className={`hero-collage-item group pointer-events-auto absolute ${desktopClassName}`}
            aria-label="Open live shop"
          >
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes="(max-width: 1400px) 24vw, 420px"
              className="object-contain"
            />
            <span className="hero-collage-label">
              <span>{code}</span>
              <span>{LIVE_SHOP_LABEL}</span>
              <ArrowUpRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
