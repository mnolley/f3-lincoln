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
 * Hero media band used by many F3 region sites.
 * Today: crossfading image montage from @F3Lincoln (object-contain so full frame is visible).
 * Later: set site.heroVideoUrl for a real video montage.
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
      <div className="hero-montage w-full border-b border-gloom-border bg-gloom-deep">
        <div className="relative mx-auto flex h-[min(70vh,42rem)] w-full max-w-6xl items-center justify-center bg-black">
          <video
            className="max-h-full max-w-full object-contain"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={images[0]?.src}
          />
        </div>
        <MontageCaption />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="hero-montage flex h-[min(40vh,20rem)] w-full items-center justify-center border-b border-gloom-border bg-gloom-deep">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-dim">
          Montage coming soon
        </p>
      </div>
    );
  }

  return (
    <div className="hero-montage w-full border-b border-gloom-border bg-gloom-deep">
      {/* Stage: full image fits via object-contain (no crop). Portrait & landscape both letterbox. */}
      <div className="relative mx-auto h-[min(72vh,44rem)] w-full max-w-6xl bg-black">
        {images.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1400ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-contain object-center"
            />
          </div>
        ))}
      </div>

      {/* Thumb strip under the stage (does not cover the photo) */}
      <div className="hidden border-t border-gloom-border bg-gloom-panel sm:block">
        <div className="mx-auto flex max-w-6xl gap-1 page-x py-2">
          {images.slice(0, 8).map((slide, i) => (
            <button
              key={slide.src + "-thumb"}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-14 flex-1 overflow-hidden rounded-sm border transition-opacity ${
                i === index % Math.min(8, images.length)
                  ? "border-f3-red opacity-100"
                  : "border-white/10 opacity-50 hover:opacity-80"
              }`}
              aria-label={`Show photo ${i + 1}`}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <MontageCaption />
    </div>
  );
}

function MontageCaption() {
  return (
    <div className="border-t border-gloom-border bg-gloom-panel page-x py-3 sm:py-4">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.18em] text-f3-red sm:text-xs">
          From the gloom · @F3Lincoln
        </p>
        <p className="mt-1 max-w-lg text-sm text-ink-muted sm:text-base">
          Free. Outdoor. Peer-led. Leave no man behind.
        </p>
      </div>
    </div>
  );
}
