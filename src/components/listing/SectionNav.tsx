"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/data/properties";
import { useBooking } from "@/hooks/useBooking";
import { formatPrice, nightsBetween, plural } from "@/lib/format";
import { stayCost } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppButton } from "./ContactButtons";

const SECTIONS = [
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
];

const NAV_HEIGHT = 80;

// Airbnb-style bar that slides in once the photo grid has scrolled away, with
// jump links to each section (the current one underlined). The price summary
// and Book button join it once the booking card has scrolled out of view.
export function SectionNav({ property }: { property: Property }) {
  const { checkIn, checkOut, guests } = useBooking();
  const [visible, setVisible] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [active, setActive] = useState("photos");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const photos = document.getElementById("photos");
      const card = document.getElementById("booking-card-desktop");
      if (photos) setVisible(photos.getBoundingClientRect().bottom <= 0);
      // offsetParent is null while the desktop card is hidden (small screens).
      if (card) setShowPrice(card.offsetParent !== null && card.getBoundingClientRect().bottom <= NAV_HEIGHT);

      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= NAV_HEIGHT + 24) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const nights = nightsBetween(checkIn, checkOut);

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      style={{ height: NAV_HEIGHT }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-line bg-white transition-[translate,opacity] duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between gap-6 px-6 xl:px-0">
        <nav aria-label="Listing sections" className="no-scrollbar flex h-full gap-6 overflow-x-auto">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`flex h-full shrink-0 items-center border-b-4 pt-1 text-sm font-semibold transition-colors ${
                active === s.id ? "border-black" : "border-transparent text-ink-soft hover:text-black"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div
          className={`hidden items-center gap-6 transition-opacity duration-300 lg:flex ${
            showPrice ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="text-sm leading-tight">
            {nights > 0 ? (
              <p>
                <span className="font-semibold underline">{formatPrice(stayCost(property, checkIn, checkOut).total)}</span>{" "}
                <span className="text-ink-soft">for {plural(nights, "night")}</span>
              </p>
            ) : (
              <p>
                <span className="font-semibold">{formatPrice(property.pricePerNight)}</span>{" "}
                <span className="text-ink-soft">/ night</span>
              </p>
            )}
            <p className="mt-1 flex items-center gap-1 text-xs">
              <Icon name="star" className="size-3" />
              <span className="font-semibold">{property.rating.toFixed(1)}</span>
              <span className="text-muted">· {property.reviewCount} reviews</span>
            </p>
          </div>
          <WhatsAppButton
            request={{ property, checkIn: checkIn || undefined, checkOut: checkOut || undefined, guests }}
            className="rounded-full px-6"
          />
        </div>
      </div>
    </div>
  );
}
