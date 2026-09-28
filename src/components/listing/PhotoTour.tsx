"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { tourMedia, type Property, type TourMedia } from "@/data/properties";
import { TOUR_PARAM, usePhotoTour } from "@/hooks/usePhotoTour";
import { gsap, REDUCED_MOTION } from "@/lib/gsap";
import { Icon } from "@/components/ui/Icon";
import { ListingActions } from "./ListingActions";

const reduced = () => window.matchMedia(REDUCED_MOTION).matches;
const isVideo = (m: TourMedia): m is { video: string; poster: string } => typeof m !== "string";

type Item = { media: TourMedia; index: number };

// Splits a room's media into Airbnb's repeating row pattern:
// [big + two stacked] → [two side by side] → … (leftovers: 2 = pair, 1 = full width).
function rows(items: Item[]) {
  const out: { kind: "trio" | "pair" | "single"; items: Item[] }[] = [];
  let i = 0;
  let trio = true;
  while (i < items.length) {
    const left = items.length - i;
    if (trio && left >= 3) {
      out.push({ kind: "trio", items: items.slice(i, i + 3) });
      i += 3;
    } else if (left >= 2) {
      out.push({ kind: "pair", items: items.slice(i, i + 2) });
      i += 2;
    } else {
      out.push({ kind: "single", items: items.slice(i, i + 1) });
      i += 1;
    }
    trio = !trio;
  }
  return out;
}

// Airbnb-style "Photo tour": a full-screen sheet that slides up over the
// listing. Room thumbnails jump to each room; each room has a sticky title on
// the left and its photos/videos on the right. Clicking one opens a
// full-screen lightbox. Open/closed state lives in the URL.
export function PhotoTour({ property }: { property: Property }) {
  const params = useSearchParams();
  const open = params.get("modal") === TOUR_PARAM;
  const startPhoto = params.get("photo");
  const tour = usePhotoTour();
  const sheet = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  // Mount the (media-heavy) content on first open only, then keep it so the
  // close animation still has something to show.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);

  // Slide the sheet up on open and down on close (also on browser Back).
  useEffect(() => {
    const el = sheet.current;
    if (!el) return;
    const d = reduced() ? 0 : 1;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      gsap.fromTo(el, { yPercent: 100, autoAlpha: 1 }, { yPercent: 0, duration: 0.5 * d, ease: "power3.out", overwrite: true });
      el.scrollTop = 0;
      if (startPhoto !== null) {
        el.querySelector(`[data-tour-photo="${startPhoto}"]`)?.scrollIntoView({ block: "center" });
      }
      el.querySelector<HTMLElement>("[data-tour-back]")?.focus({ preventScroll: true });
    } else {
      document.documentElement.style.overflow = "";
      gsap.to(el, {
        yPercent: 100,
        duration: 0.4 * d,
        ease: "power3.in",
        overwrite: true,
        onComplete: () => void gsap.set(el, { autoAlpha: 0 }),
      });
    }
  }, [open, startPhoto, rendered]);

  // Escape closes the tour (the lightbox handles its own Escape).
  useEffect(() => {
    if (!open || lightbox !== null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && tour.close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lightbox, tour]);

  // Global index across rooms, so the lightbox can step through everything.
  let index = 0;
  const rooms = property.tour.map((r) => ({ ...r, items: r.media.map((media) => ({ media, index: index++ })) }));
  const firstPhoto = (items: Item[]) => {
    const m = items[0]?.media;
    return m === undefined ? undefined : isVideo(m) ? m.poster : m;
  };

  const tile = (item: Item, room: string, className: string, sizes: string) => (
    <button
      key={item.index}
      type="button"
      data-tour-photo={item.index}
      onClick={() => setLightbox(item.index)}
      aria-label={`View ${room} ${isVideo(item.media) ? "video" : "photo"}`}
      className={`group relative overflow-hidden bg-tile ${className}`}
    >
      {isVideo(item.media) ? (
        <TourVideo src={item.media.video} poster={item.media.poster} />
      ) : (
        <Image src={item.media} alt={`${room} photo`} fill sizes={sizes} className="object-cover" />
      )}
      <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
    </button>
  );

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo tour of ${property.name}`}
      inert={!open}
      className="invisible fixed inset-0 z-[60] overflow-y-auto bg-white"
    >
      {rendered && (
        <>
          <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between bg-white px-4 md:px-10">
            <button
              type="button"
              data-tour-back
              onClick={tour.close}
              aria-label="Close photo tour"
              className="grid size-9 place-items-center rounded-full hover:bg-black/5"
            >
              <Icon name="chevronLeft" className="size-5" strokeWidth={2} />
            </button>
            <ListingActions slug={property.slug} name={property.name} />
          </header>

          <div className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10">
            <h2 className="mt-6 text-[26px] font-semibold">Photo tour</h2>

            {/* Room thumbnails: jump to that room */}
            <div className="no-scrollbar mt-8 flex gap-5 overflow-x-auto pb-2">
              {rooms.map((room) => (
                <button
                  key={room.room}
                  type="button"
                  onClick={() =>
                    sheet.current
                      ?.querySelector(`[data-tour-room="${room.room}"]`)
                      ?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" })
                  }
                  className="group w-[140px] shrink-0 text-left sm:w-[183px]"
                >
                  <div className="relative aspect-[183/120] overflow-hidden bg-tile shadow-[0_2px_4px_rgba(0,0,0,0.18)]">
                    {firstPhoto(room.items) && (
                      <Image src={firstPhoto(room.items)!} alt="" fill sizes="183px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    )}
                  </div>
                  <p className="mt-3 text-[15px]">{room.room}</p>
                </button>
              ))}
            </div>

            {rooms.map((room) => (
              <section
                key={room.room}
                data-tour-room={room.room}
                className="mt-16 grid scroll-mt-[76px] grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-[1fr_2fr] md:gap-0"
              >
                {/* Title stays pinned while its photos scroll past */}
                <h3 className="sticky top-[76px] z-[5] -mx-6 bg-white px-6 py-3 text-[22px] font-medium md:top-[108px] md:z-auto md:mx-0 md:self-start md:bg-transparent md:px-0 md:py-0 md:text-[26px]">
                  {room.room}
                </h3>
                <div className="flex min-w-0 flex-col gap-1.5 md:gap-2.5">
                  {rows(room.items).map((row) =>
                    row.kind === "trio" ? (
                      <div key={row.items[0].index} className="grid grid-cols-[minmax(0,614fr)_minmax(0,303fr)] gap-1.5 md:gap-2.5">
                        {tile(row.items[0], room.room, "row-span-2 aspect-[614/818]", "(min-width: 768px) 620px, 66vw")}
                        {tile(row.items[1], room.room, "", "(min-width: 768px) 310px, 33vw")}
                        {tile(row.items[2], room.room, "", "(min-width: 768px) 310px, 33vw")}
                      </div>
                    ) : row.kind === "pair" ? (
                      <div key={row.items[0].index} className="grid grid-cols-2 gap-1.5 md:gap-2.5">
                        {row.items.map((it) => tile(it, room.room, "aspect-[458/560]", "(min-width: 768px) 460px, 50vw"))}
                      </div>
                    ) : (
                      tile(row.items[0], room.room, "aspect-[3/2] w-full", "(min-width: 768px) 930px, 100vw")
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Portalled to <body>: the sheet's slide transform would otherwise
              make this "fixed" viewer scroll along with the tour. */}
          {lightbox !== null &&
            createPortal(
              <Lightbox items={tourMedia(property)} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />,
              document.body,
            )}
        </>
      )}
    </div>
  );
}

// Muted looping video that only plays while it's on screen.
function TourVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 size-full object-cover" />
      <span className="pointer-events-none absolute left-3 top-3 grid size-8 place-items-center rounded-full bg-black/50 text-white">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path d="M8 5l11 7-11 7z" fill="currentColor" />
        </svg>
      </span>
    </>
  );
}

// Full-screen black viewer: fades in, items slide/fade between each other.
function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: TourMedia[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  // Which way we last moved (-1 / 1), so the next item slides in from that side.
  const [direction, setDirection] = useState(0);
  const item = items[index];

  const go = (step: number) => {
    const next = index + step;
    if (next < 0 || next >= items.length) return;
    setDirection(step);
    onIndex(next);
  };
  const close = () =>
    gsap.to(root.current, { autoAlpha: 0, duration: reduced() ? 0 : 0.25, ease: "power2.in", onComplete: onClose });

  useEffect(() => {
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced() ? 0 : 0.3, ease: "power2.out" });
  }, []);

  // Keyboard: ← → to step, Esc to close. Listened on window because the
  // viewer is invisible (unfocusable) for the first frame of its fade-in.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!direction) return;
    gsap.fromTo(
      frame.current,
      { x: 60 * direction, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: reduced() ? 0 : 0.35, ease: "power2.out" },
    );
  }, [index, direction]);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="invisible fixed inset-0 z-[70] flex flex-col bg-black text-white"
    >
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <button type="button" onClick={close} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10">
          <Icon name="close" className="size-4" strokeWidth={2} />
          Close
        </button>
        <p className="text-sm">
          {index + 1} / {items.length}
        </p>
        <span className="w-[88px]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-10 md:px-24">
        <div ref={frame} className="relative h-full max-h-[80vh] w-full">
          {isVideo(item) ? (
            <video
              key={item.video}
              src={item.video}
              poster={item.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <Image src={item} alt={`Photo ${index + 1} of ${items.length}`} fill sizes="100vw" className="object-contain" />
          )}
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous"
          className="absolute left-3 grid size-11 place-items-center rounded-full border border-white/40 hover:bg-white/10 disabled:opacity-0 md:left-8"
        >
          <Icon name="chevronLeft" className="size-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === items.length - 1}
          aria-label="Next"
          className="absolute right-3 grid size-11 place-items-center rounded-full border border-white/40 hover:bg-white/10 disabled:opacity-0 md:right-8"
        >
          <Icon name="chevronRight" className="size-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
