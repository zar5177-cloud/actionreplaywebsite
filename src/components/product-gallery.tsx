"use client";

import { useState } from "react";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics/events";

type ProductGalleryProps = {
  category: string;
  images: string[];
  productId: string;
  slug: string;
  stateLabel: string;
  title: string;
};

function shouldContainImage(src: string, slug: string, category: string) {
  if (src.includes("editorial")) return false;

  return (
    category === "tees" ||
    slug.includes("poster") ||
    src.includes("/cutouts/") ||
    src.includes("-cutout")
  );
}

export function ProductGallery({
  category,
  images,
  productId,
  slug,
  stateLabel,
  title,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroImage = images[activeIndex] ?? images[0];

  function trackImage(index: number) {
    trackEvent({
      name: "product_image_click",
      image_index: index,
      product_id: productId,
    });
  }

  function cycleHero() {
    trackImage(activeIndex);
    setActiveIndex((activeIndex + 1) % images.length);
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={cycleHero}
        aria-label={`Cycle product image for ${title}`}
        className="relative min-h-[320px] overflow-hidden border border-blue-400/35 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.28),rgba(0,0,0,0.92)_62%)] text-left sm:min-h-[620px]"
      >
        <Image
          src={heroImage}
          alt={`${title} product artwork`}
          fill
          loading="eager"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className={
            shouldContainImage(heroImage, slug, category)
              ? "object-contain p-2 sm:p-8"
              : "object-cover object-center"
          }
        />
        <div className="absolute left-3 top-3 border border-lime-300/70 bg-black/80 px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-200 sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          {stateLabel}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </button>

      {images.length > 1 ? (
        <div className="grid gap-2 min-[520px]:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                trackImage(index);
              }}
              aria-label={`Open product image ${index + 1} for ${title}`}
              className={`relative h-32 overflow-hidden border bg-zinc-950 text-left transition ${
                activeIndex === index
                  ? "border-lime-300/70"
                  : "border-white/12 hover:border-blue-300/60"
              }`}
            >
              <Image
                src={image}
                alt={`${title} gallery image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className={
                  shouldContainImage(image, slug, category)
                    ? "object-contain p-2"
                    : "object-cover"
                }
              />
              <span className="absolute left-2 top-2 bg-black/75 px-2 py-1 font-mono text-[10px] uppercase text-zinc-200">
                0{index + 1}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
