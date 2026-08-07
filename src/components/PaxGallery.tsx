"use client";

import Image from "next/image";
import { PaxAuthGate } from "./PaxAuthGate";
import type { GalleryPhoto } from "@/content/gallery";
import { site } from "@/lib/site";

type Props = {
  photos: GalleryPhoto[];
};

export function PaxGallery({ photos }: Props) {
  return (
    <PaxAuthGate blurb="The gloom photo roll is for the pack. Enter the password to continue.">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-ink-dim">
            {photos.length} real photo{photos.length === 1 ? "" : "s"} from{" "}
            <a
              href={site.twitterUrl}
              className="text-f3-red hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {site.twitterHandle}
            </a>
            {" · "}
            AI art and logos excluded
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="card-panel p-8 text-center text-sm text-ink-muted">
            No photos in the gallery yet.
          </div>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {photos.map((photo) => (
              <figure
                key={photo.src}
                className="card-panel mb-4 break-inside-avoid overflow-hidden"
              >
                <div className="relative w-full bg-black">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={900}
                    height={1200}
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <figcaption className="space-y-1 px-4 py-3">
                  <p className="text-sm font-medium text-ink">{photo.caption}</p>
                  <div className="flex flex-wrap items-center gap-x-2 text-xs text-ink-dim">
                    {photo.postedAt ? <time dateTime={photo.postedAt}>{photo.postedAt}</time> : null}
                    {photo.sourceUrl ? (
                      <a
                        href={photo.sourceUrl}
                        className="text-f3-red hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on X ↗
                      </a>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </PaxAuthGate>
  );
}
