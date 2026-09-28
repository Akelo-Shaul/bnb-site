"use client";

import type { Property } from "@/data/properties";
import { useBooking } from "@/hooks/useBooking";
import { formatDate } from "@/lib/contact";
import { formatPrice } from "@/lib/format";
import { WhatsAppButton } from "./ContactButtons";

// Sticky footer on small screens, where the booking card sits far down the page.
export function MobileBookingBar({ property }: { property: Property }) {
  const { checkIn, checkOut, guests } = useBooking();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-white px-6 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 lg:hidden">
      <div>
        <p>
          <span className="font-semibold">{formatPrice(property.pricePerNight)}</span> night
        </p>
        <a href="#booking" className="text-sm underline">
          {checkIn && checkOut ? `${formatDate(checkIn)} – ${formatDate(checkOut)}` : "Choose dates"}
        </a>
      </div>
      <WhatsAppButton
        request={{ property, checkIn: checkIn || undefined, checkOut: checkOut || undefined, guests }}
        className="text-sm"
      />
    </div>
  );
}
