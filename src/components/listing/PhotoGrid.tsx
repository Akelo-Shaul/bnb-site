"use client";

import { tourMedia, type Property } from "@/data/properties";
import { usePhotoTour } from "@/hooks/usePhotoTour";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { Icon } from "@/components/ui/Icon";

// Big tile (autoplay video when the listing has one, else the cover photo) +
// four photos. Every tile and "Show all photos" opens the photo tour.
export function PhotoGrid({ property }: { property: Property }) {
  const tour = usePhotoTour();
  const { images, name, video } = property;
  // With a video in the big tile, the small tiles start at the first photo.
  const small = video ? images.slice(0, 4) : images.slice(1, 5);
  // Photo tour URLs index into all tour media (photos and videos).
  const media = tourMedia(property);
  const tourIndex = (src?: string) => (src ? media.indexOf(src) : -1);

  return (
    <div className="relative grid h-[260px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[400px] lg:h-[460px]">
      <button
        type="button"
        onClick={() => tour.open()}
        aria-label={`Open photo tour of ${name}`}
        className="group relative col-span-4 row-span-2 overflow-hidden bg-tile sm:col-span-2"
      >
        {video ? (
          <video
            src={video.src}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <PhotoTile src={images[0]} alt={name} priority sizes="(min-width: 1024px) 560px, 100vw" className="size-full" />
        )}
        <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
      </button>

      {[0, 1, 2, 3].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => tour.open(tourIndex(small[i]) >= 0 ? tourIndex(small[i]) : undefined)}
          aria-label={`Open photo ${i + 2} of ${name}`}
          className="group relative hidden overflow-hidden sm:block"
        >
          <PhotoTile src={small[i]} alt="" sizes="280px" className="size-full" />
          <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </button>
      ))}

      {images.length > 0 && (
        <button
          type="button"
          onClick={() => tour.open()}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-1.5 text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <Icon name="grid" className="size-4" />
          Show all photos
        </button>
      )}
    </div>
  );
}
