import { site } from "@/data/site";
import { formatPrice, nightsBetween, plural } from "@/lib/format";
import { costBreakdown, stayCost, weekdayRateLabel } from "@/lib/pricing";
import { publicSiteUrl } from "@/lib/site-url";
import type { Property } from "@/data/properties";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Instagram has no way to pre-fill a DM, so callers copy the message to the
// clipboard before opening this link.
export function instagramDmLink() {
  return `https://ig.me/m/${site.instagramHandle}`;
}

export function instagramProfileLink() {
  return `https://www.instagram.com/${site.instagramHandle}/`;
}

export function tiktokLink() {
  return `https://www.tiktok.com/@${site.tiktokHandle}`;
}

/** Human-readable WhatsApp number, e.g. "+254 115 089 122". */
export function whatsappDisplay() {
  const n = site.whatsappNumber;
  return `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`.trim();
}

export type BookingRequest = {
  property?: Pick<Property, "name" | "slug"> &
    Partial<Pick<Property, "location" | "pricePerNight" | "cleaningFee" | "weekdayRate">>;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

// Builds the pre-filled WhatsApp / Instagram message. Every detail the guest
// has filled in on the site is included; anything missing is simply left out.
// *text* renders bold in WhatsApp.
export function bookingMessage({ property, checkIn, checkOut, guests }: BookingRequest) {
  const lines: string[] = [];

  if (property) {
    lines.push(`Hi ${site.name}! I'd like to book *${property.name}*${property.location ? ` (${property.location})` : ""}.`);
  } else {
    lines.push(`Hi ${site.name}! I'd like to make a booking.`);
  }

  const nights = nightsBetween(checkIn, checkOut);
  const details: string[] = [];
  if (checkIn) details.push(`Check-in: ${formatDate(checkIn, true)}`);
  if (checkOut) details.push(`Check-out: ${formatDate(checkOut, true)}`);
  if (nights > 0) details.push(`Duration: ${plural(nights, "night")}`);
  if (guests) details.push(`Guests: ${guests}`);
  if (property?.pricePerNight) {
    if (nights > 0) {
      const { lines, total } = stayCost({ ...property, pricePerNight: property.pricePerNight }, checkIn, checkOut);
      const fee = property.cleaningFee ? ` + ${formatPrice(property.cleaningFee)} cleaning` : "";
      details.push(`Estimated total: ${formatPrice(total)} (${costBreakdown(lines)}${fee})`);
    } else {
      const weekdayRate = weekdayRateLabel(property);
      details.push(`Rate: ${formatPrice(property.pricePerNight)} / night${weekdayRate ? ` (${weekdayRate})` : ""}`);
    }
  }
  if (details.length) lines.push("", ...details.map((d) => `• ${d}`));

  const base = publicSiteUrl();
  if (property && base) lines.push("", `Listing: ${base}/properties/${property.slug}`);

  lines.push("", checkIn && checkOut ? "Is it available for these dates?" : "Which dates are available?");
  return lines.join("\n");
}

export function formatDate(iso: string, withWeekday = false) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    ...(withWeekday && { weekday: "short" }),
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
