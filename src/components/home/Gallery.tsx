"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { galleryTiles, GALLERY_INTERVAL, type GalleryMedia } from "@/data/gallery";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";

// Five-tile mosaic from Figma: 331 | 331 | 445 columns, 588px tall.
// Left column 289/282, middle full height (video), right column 380/190.
// Every GALLERY_INTERVAL seconds each tile slides its current item out to the
// left and the next one in from the right, inside that tile only.
export function Gallery() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  // Advance only while the gallery is on screen and the tab is visible.
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      timer = setInterval(() => setStep((s) => s + 1), GALLERY_INTERVAL * 1000);
    };
    let inView = false;
    const sync = () => (inView && !document.hidden ? start() : stop());
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    if (section.current) io.observe(section.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const tile = (i: number, className: string, sizes: string) => (
    <GalleryTile media={galleryTiles[i] ?? []} step={step} order={i} sizes={sizes} className={className} />
  );

  return (
    <section ref={section} id="gallery" className="bg-mist px-6 py-16 md:px-[78px] lg:h-[873px] lg:py-0 lg:pt-[87px]">
      <div className="mx-auto max-w-[1135px]">
        <h2 className="text-[28px] font-semibold text-ink md:ml-[115px] md:text-[36px]">Gallery</h2>

        <div className="mt-8 grid grid-cols-2 gap-[13px] md:mt-[46px] md:h-[588px] md:grid-cols-[331fr_331fr_445fr]">
          <div className="flex flex-col gap-[17px]">
            {tile(0, "aspect-[331/289] md:aspect-auto md:flex-[289]", "(min-width: 768px) 30vw, 50vw")}
            {tile(1, "aspect-[331/282] md:aspect-auto md:flex-[282]", "(min-width: 768px) 30vw, 50vw")}
          </div>
          {tile(2, "min-h-[300px] md:h-full", "(min-width: 768px) 30vw, 50vw")}
          <div className="col-span-2 flex flex-col gap-[18px] md:col-span-1">
            {tile(3, "aspect-[445/380] md:aspect-auto md:flex-[380]", "(min-width: 768px) 40vw, 100vw")}
            {tile(4, "aspect-[445/190] md:aspect-auto md:flex-[190]", "(min-width: 768px) 40vw, 100vw")}
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryTile({
  media,
  step,
  order,
  sizes,
  className,
}: {
  media: GalleryMedia[];
  step: number;
  order: number;
  sizes: string;
  className: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const current = useRef(0);

  // On each step: current item slides out left, next slides in from the
  // right. Tiles start one after another (order × 0.12s) for a ripple.
  useGSAP(
    () => {
      if (step === 0 || media.length < 2) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-slide]", root.current);
      const outgoing = items[current.current];
      current.current = (current.current + 1) % items.length;
      const incoming = items[current.current];
      const reduced = window.matchMedia(REDUCED_MOTION).matches;

      const video = incoming.querySelector("video");
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }

      gsap
        .timeline({
          delay: reduced ? 0 : order * 0.12,
          defaults: { duration: reduced ? 0 : 0.9, ease: "power3.inOut" },
          onComplete: () => outgoing.querySelector("video")?.pause(),
        })
        .fromTo(incoming, { xPercent: 100, autoAlpha: 1 }, { xPercent: 0 }, 0)
        .to(outgoing, { xPercent: -100 }, 0);
    },
    { dependencies: [step], scope: root },
  );

  return (
    <div ref={root} className={`relative overflow-hidden bg-tile ${className}`}>
      {media.map((m, i) => (
        <div
          key={i}
          data-slide
          // Everything but the first item stays hidden until it slides in.
          className={`absolute inset-0 ${i > 0 ? "invisible" : ""}`}
        >
          <Slide media={m} sizes={sizes} autoPlay={i === 0} />
        </div>
      ))}
    </div>
  );
}

function Slide({ media, sizes, autoPlay }: { media: GalleryMedia; sizes: string; autoPlay: boolean }) {
  if (media.type === "image") {
    return <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />;
  }
  if (!media.src) {
    return (
      <div className="relative size-full">
        {media.poster && <Image src={media.poster} alt="" fill sizes={sizes} className="object-cover opacity-40" />}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white">
          <svg viewBox="0 0 24 24" className="size-12" aria-hidden="true">
            <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)" />
            <path d="M10 8l6 4-6 4z" fill="white" />
          </svg>
          Video coming soon
        </span>
      </div>
    );
  }
  return (
    <video
      src={media.src}
      poster={media.poster}
      aria-label={media.alt}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      preload="metadata"
      className="size-full object-cover"
    />
  );
}
