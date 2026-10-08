import type { Property } from "@/data/properties";
import { formatPrice, plural } from "@/lib/format";

type Priced = Pick<Property, "pricePerNight"> & Partial<Pick<Property, "cleaningFee" | "weekdayRate">>;

/** Nightly price for the night starting on `iso` (a check-in date or any date in the stay). */
export function nightlyPrice(property: Priced, iso: string) {
  const day = new Date(`${iso}T00:00:00`).getDay();
  const rate = property.weekdayRate;
  return rate && rate.days.includes(day) ? rate.price : property.pricePerNight;
}

/**
 * Cost of a stay, night by night. `lines` groups nights by price, e.g.
 * [{ price: 6000, nights: 2 }, { price: 5000, nights: 1 }].
 */
export function stayCost(property: Priced, checkIn?: string, checkOut?: string) {
  const lines: { price: number; nights: number }[] = [];
  let nights = 0;
  if (checkIn && checkOut) {
    const d = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);
    while (d < end) {
      const price = nightlyPrice(property, localIso(d));
      const line = lines.find((l) => l.price === price);
      if (line) line.nights++;
      else lines.push({ price, nights: 1 });
      nights++;
      d.setDate(d.getDate() + 1);
    }
  }
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.nights, 0);
  const cleaningFee = property.cleaningFee ?? 0;
  return { nights, lines, subtotal, cleaningFee, total: subtotal + cleaningFee };
}

/** "Ksh 5,000 Mon–Wed", or undefined when the property has a single rate. */
export function weekdayRateLabel(property: Partial<Pick<Property, "weekdayRate">>) {
  const rate = property.weekdayRate;
  return rate ? `${formatPrice(rate.price)} ${rate.label}` : undefined;
}

/** "Ksh 6,000 × 2 nights + Ksh 5,000 × 1 night" */
export function costBreakdown(lines: { price: number; nights: number }[]) {
  return lines.map((l) => `${formatPrice(l.price)} × ${plural(l.nights, "night")}`).join(" + ");
}

function localIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
