"use client";

import type { Property } from "@/data/properties";
import { useBooking } from "@/hooks/useBooking";
import { useToday } from "@/hooks/useToday";
import { formatPrice, plural } from "@/lib/format";
import { stayCost, weekdayRateLabel } from "@/lib/pricing";
import { Icon } from "@/components/ui/Icon";
import { InstagramButton, WhatsAppButton } from "./ContactButtons";

export function BookingCard({ property, id }: { property: Property; id?: string }) {
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking();
  const today = useToday() || undefined;
  const { nights, lines, total } = stayCost(property, checkIn, checkOut);
  const weekdayRate = weekdayRateLabel(property);
  const request = {
    property,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests,
  };

  return (
    <div id={id} className="scroll-mt-24 rounded-xl border border-line p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-price text-[22px] font-bold">{formatPrice(property.pricePerNight)}</span>
          <span className="text-muted"> / night</span>
          {weekdayRate && <span className="block text-sm text-muted">{weekdayRate}</span>}
        </p>
        <a href="#reviews" className="flex items-center gap-1 text-sm">
          <Icon name="star" className="size-3.5 text-brand" />
          {property.rating.toFixed(1)}
          <span className="text-muted underline">· {property.reviewCount} reviews</span>
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[#b0b0b0]">
        <div className="grid grid-cols-2">
          <label className="block border-r border-[#b0b0b0] px-3 py-2">
            <span className="block text-[10px] font-bold uppercase">Check-in</span>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <label className="block px-3 py-2">
            <span className="block text-[10px] font-bold uppercase">Checkout</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
        </div>
        <label className="relative block border-t border-[#b0b0b0] px-3 py-2">
          <span className="block text-[10px] font-bold uppercase">Guests</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full appearance-none bg-transparent text-sm outline-none"
          >
            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {plural(n, "guest")}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
        </label>
      </div>

      <WhatsAppButton request={request} className="mt-4" />
      <InstagramButton request={request} className="mt-3" />

      <p className="text-center text-sm text-muted">No payment until the host confirms your booking</p>

      {nights > 0 && (
        <dl className="mt-6 space-y-3 text-[15px]">
          {lines.map((l) => (
            <div key={l.price} className="flex justify-between">
              <dt className="underline">
                {formatPrice(l.price)} × {plural(l.nights, "night")}
              </dt>
              <dd>{formatPrice(l.price * l.nights)}</dd>
            </div>
          ))}
          {property.cleaningFee > 0 && (
            <div className="flex justify-between">
              <dt className="underline">Cleaning fee</dt>
              <dd>{formatPrice(property.cleaningFee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-4 font-semibold">
            <dt>Estimated total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
