"use client";

import { useRef } from "react";
import Image from "next/image";
import { properties } from "@/data/properties";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { Wordmark } from "@/components/ui/Wordmark";
import { BookLink } from "@/components/ui/BookLink";
import { SocialRail } from "@/components/ui/SocialRail";
import { PropertyCard } from "./PropertyCard";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // Placeholder intro so GSAP is wired end-to-end. Swap in the real
  // animations here once they're described.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`not ${REDUCED_MOTION}`, () => {
        gsap.from("[data-property-card]", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate flex h-svh flex-col overflow-hidden">
      {/* Always exactly one screen tall; the cards shrink to fit shorter screens. */}
      <Image
        src="/images/hero-living.jpg"
        alt="Living room in a Shalom Gardens apartment"
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <header className="flex shrink-0 items-center justify-between gap-4 px-6 pt-[clamp(20px,5svh,56px)] md:px-[78px] lg:pr-[48px]">
        <Wordmark className="text-[clamp(22px,3vw,44px)]" />
        <BookLink />
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-4 pb-[clamp(16px,4svh,46px)] pt-6 md:flex-row md:items-end md:gap-6">
        {/* On phones the contact toggle sits just above the cards, on the right */}
        <div className="flex justify-end px-6 md:hidden">
          <SocialRail />
        </div>
        <div
          id="properties"
          className="no-scrollbar flex min-h-0 max-h-[439px] min-w-0 flex-1 items-end md:h-full snap-x snap-mandatory scroll-px-6 gap-[15px] overflow-x-auto px-6 pb-2 md:scroll-px-[38px] md:px-[38px]"
        >
          {properties.map((p) => (
            <PropertyCard key={p.slug} property={p} />
          ))}
        </div>
        <div className="hidden shrink-0 pr-[48px] md:block">
          <SocialRail />
        </div>
      </div>
    </section>
  );
}
