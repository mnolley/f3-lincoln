"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MontageSlide } from "@/content/montage";

type Props = {
  images: MontageSlide[];
  /** When set, plays as full-bleed hero media (image montage remains fallback). */
  videoUrl?: string;
};

/**
 * Full-bleed hero media band used by many F3 region sites.
 * Today: crossfading image montage from @F3Lincoln.
 * Later: drop in site.heroVideoUrl for a real video montage.
 */
export function HeroMontage({ images, videoUrl }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (videoUrl || images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [images.length, videoUrl]);

  if (videoUrl) {
    return (
      <div className="hero-montage relative h-[min(52vh,28rem)] w-full overflow-hidden border-b border-gloom-border bg-gloom-deep sm:h-[min(58vh,34rem)]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={images[0]?.src}
        />
        <div className="hero-montage-overlay pointer-events-none absolute inset-0" />
        <MontageCaption />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="hero-montage relative flex h-[min(40vh,20rem)] w-full items-center justify-center border-b border-gloom-border bg-gloom-deep">
        <div className="hero-montage-overlay absolute inset-0" />
        <p className="relative z-10 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
          Montage coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="hero-montage relative h-[min(52vh,28rem)] w-full overflow-hidden border-b border-gloom-border bg-gloom-deep sm:h-[min(58vh,34rem)]">
      {/* Crossfade slides */}
      {images.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Collage strip of thumbs (desktop) — shows “montage” even mid-fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] hidden h-24 bg-gradient-to-t from-gloom-deep via-gloom-deep/80 to-transparent sm:block">
        <div className="mx-auto flex h-full max-w-6xl items-end gap-1 page-x pb-3">
          {images.slice(0, 8).map((slide, i) => (
            <div
              key={slide.src + "-thumb"}
              className={`relative h-14 flex-1 overflow-hidden rounded-sm border transition-opacity ${
                i === index % Math.min(8, images.length)
                  ? "border-f3-red opacity-100"
                  : "border-white/10 opacity-60"
              }`}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="hero-montage-overlay pointer-events-none absolute inset-0 z-[1]" />
      <MontageCaption />
    </div>
  );
}

function MontageCaption() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[2] page-x pb-4 sm:pb-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-f3-red sm:text-xs">
          From the gloom · @F3Lincoln
        </p>
        <p className="mt-1 max-w-lg text-sm text-white/85 sm:text-base">
          Free. Outdoor. Peer-led. Leave no man behind.
        </p>
      </div>
    </div>
  );
}
