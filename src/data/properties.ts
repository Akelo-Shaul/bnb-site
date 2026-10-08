import type { IconName } from "@/components/ui/Icon";

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER CONTENT: names, prices, descriptions, ratings and reviews below
// are sample data. Replace them with the owner's real listings before launch.
// To add a property, copy an entry, give it a unique `slug`, and drop its
// photos into /public/images (videos into /public/videos). Media is listed
// per room in `tour` (photos as paths, videos via `vid()`); the first photo is
// the card cover. Missing photos render as grey placeholders.
// MEDIA: the owner's own photos/videos (Oct 2026), one folder per property.
// The 1-bedroom only came as a video, so its photos are stills from it.
// ─────────────────────────────────────────────────────────────────────────────

export type Review = {
  author: string;
  date: string;
  text: string;
};

/** A photo path, or a video with its poster frame. */
export type TourMedia = string | { video: string; poster: string };

export type Property = {
  slug: string;
  name: string;
  /** Short tag shown on the card, e.g. the town. */
  town: string;
  /** Full location line, also used for the map. */
  location: string;
  type: string;
  pricePerNight: number;
  /** Different nightly rate on some weekdays (0 = Sunday … 6 = Saturday), keyed by the night's start date. */
  weekdayRate?: { days: number[]; price: number; label: string };
  cleaningFee: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  guestsLabel: string;
  bedrooms: number;
  beds: number;
  baths: number;
  /** Quick features listed on the card after the room counts. */
  perks: string[];
  /** Autoplaying video shown in the big tile at the top of the listing page. */
  video?: { src: string; poster: string };
  /** Photos and videos grouped by room, shown in the photo tour. */
  tour: { room: string; media: TourMedia[] }[];
  /** All photos (not videos) in tour order, derived from `tour`. */
  images: string[];
  description: string;
  highlights: { icon: IconName; title: string; text: string }[];
  sleeping: { room: string; beds: string; image?: string }[];
  amenities: { icon: IconName; label: string }[];
  ratings: { label: string; score: number }[];
  reviews: Review[];
  neighbourhood: string;
  houseRules: { icon: IconName; label: string }[];
  safety: { icon: IconName; label: string }[];
  cancellation: string;
};

const commonRules: Property["houseRules"] = [
  { icon: "clock", label: "Check-in: after 2:00 PM" },
  { icon: "clock", label: "Checkout: 10:00 AM" },
  { icon: "key", label: "Self check-in with the caretaker" },
  { icon: "noSmoking", label: "No smoking indoors" },
  { icon: "paw", label: "No pets" },
  { icon: "party", label: "No parties or events" },
];

const commonSafety: Property["safety"] = [
  { icon: "shield", label: "24/7 gated security" },
  { icon: "camera", label: "Security cameras at the entrance" },
  { icon: "alarm", label: "Smoke alarm" },
  { icon: "card", label: "Refundable damage deposit may apply" },
];

const sampleRatings = [
  { label: "Cleanliness", score: 5.0 },
  { label: "Accuracy", score: 5.0 },
  { label: "Communication", score: 5.0 },
  { label: "Location", score: 4.9 },
  { label: "Check-in", score: 5.0 },
  { label: "Value", score: 4.8 },
];

// Fills in `images` from the tour so photos are only listed once.
const define = (p: Omit<Property, "images">): Property => ({
  ...p,
  images: p.tour.flatMap((r) => r.media).filter((m): m is string => typeof m === "string"),
});

const img = (name: string) => `/images/${name}`;
const vid = (name: string): TourMedia => ({ video: `/videos/${name}.mp4`, poster: img(`${name}-poster.jpg`) });

/** Every tour item in order; photo tour URLs (?photo=N) index into this. */
export function tourMedia(p: Property) {
  return p.tour.flatMap((r) => r.media);
}

export const properties: Property[] = [
  define({
    slug: "harmes-apartments",
    name: "Harmes Apartments, Kisumu, 3 bedroom",
    town: "Kisumu",
    location: "Milimani, Kisumu, Kenya",
    type: "Entire home",
    pricePerNight: 6000,
    weekdayRate: { days: [1, 2, 3], price: 5000, label: "Mon–Wed" },
    cleaningFee: 0,
    rating: 5.0,
    reviewCount: 318,
    maxGuests: 6,
    guestsLabel: "4-6 guests",
    bedrooms: 3,
    beds: 5,
    baths: 3,
    perks: ["WiFi", "Kitchen", "Free Parking"],
    tour: [
      { room: "Living room", media: [img("harmes/living-2.jpg"), img("harmes/living-1.jpg"), img("harmes/living-3.jpg")] },
      { room: "Dining area", media: [img("harmes/dining-2.jpg"), img("harmes/dining-1.jpg")] },
      { room: "Full kitchen", media: [img("harmes/kitchen-1.jpg"), img("harmes/kitchen-2.jpg")] },
      { room: "Bedrooms", media: [img("harmes/bedroom-1.jpg"), img("harmes/bedroom-5.jpg"), img("harmes/bedroom-4.jpg"), img("harmes/bedroom-3.jpg"), img("harmes/bedroom-2.jpg")] },
      { room: "Bathroom", media: [img("harmes/bathroom-1.jpg")] },
    ],
    description:
      "A bright three-bedroom apartment with floor-to-ceiling windows and sunset views over the city. The open-plan lounge flows into a fully equipped kitchen, and every bedroom has fresh linen and plenty of storage. Close to shops, restaurants and the lakefront, with secure parking on site.",
    highlights: [
      { icon: "home", title: "Entire home", text: "You'll have the apartment to yourself." },
      { icon: "sparkle", title: "Professionally cleaned", text: "Cleaned and restocked before every stay." },
      { icon: "door", title: "Easy check-in", text: "Our caretaker meets you and hands over the keys." },
      { icon: "calendar", title: "Flexible dates", text: "Message us to confirm availability for your dates." },
    ],
    sleeping: [
      { room: "Bedroom 1", beds: "1 king bed", image: img("harmes/bedroom-1.jpg") },
      { room: "Bedroom 2", beds: "2 single beds", image: img("harmes/bedroom-4.jpg") },
      { room: "Bedroom 3", beds: "1 queen bed, 1 sofa bed", image: img("harmes/bedroom-2.jpg") },
    ],
    amenities: [
      { icon: "wifi", label: "Fast WiFi" },
      { icon: "kitchen", label: "Kitchen" },
      { icon: "parking", label: "Free parking on premises" },
      { icon: "tv", label: "Smart TV" },
      { icon: "washer", label: "Washing machine" },
      { icon: "fridge", label: "Refrigerator" },
      { icon: "water", label: "Hot water" },
      { icon: "bolt", label: "Backup power" },
      { icon: "shield", label: "24/7 security" },
      { icon: "leaf", label: "Balcony with city view" },
    ],
    ratings: sampleRatings,
    reviews: [
      { author: "Sample guest", date: "August 2026", text: "Placeholder review — replace with a real guest review." },
      { author: "Sample guest", date: "July 2026", text: "Placeholder review — replace with a real guest review." },
      { author: "Sample guest", date: "June 2026", text: "Placeholder review — replace with a real guest review." },
      { author: "Sample guest", date: "May 2026", text: "Placeholder review — replace with a real guest review." },
    ],
    neighbourhood:
      "Milimani is one of Kisumu's quietest residential areas, a short drive from the CBD, Mega Plaza and the Lake Victoria waterfront.",
    houseRules: commonRules,
    safety: commonSafety,
    cancellation: "Free cancellation up to 48 hours before check-in.",
  }),
  define({
    slug: "lakeview-suite",
    name: "Lakeview Suite, Kisumu, 2 bedroom",
    town: "Kisumu",
    location: "Riat Hills, Kisumu, Kenya",
    type: "Entire apartment",
    pricePerNight: 4000,
    cleaningFee: 0,
    rating: 4.9,
    reviewCount: 124,
    maxGuests: 4,
    guestsLabel: "2-4 guests",
    bedrooms: 2,
    beds: 3,
    baths: 2,
    perks: ["WiFi", "Kitchen", "Lake view"],
    video: { src: "/videos/lakeview/tour.mp4", poster: img("lakeview/tour-poster.jpg") },
    tour: [
      { room: "Living room", media: [img("lakeview/living-1.jpg"), vid("lakeview/tour"), img("lakeview/living-2.jpg"), img("lakeview/living-3.jpg")] },
      { room: "Dining area", media: [img("lakeview/dining-1.jpg"), img("lakeview/dining-2.jpg")] },
      { room: "Bedroom", media: [img("lakeview/bedroom-1.jpg")] },
      { room: "Full kitchen", media: [img("lakeview/kitchen-1.jpg")] },
      { room: "Bathroom", media: [img("lakeview/bathroom-1.jpg")] },
    ],
    description:
      "A calm two-bedroom apartment with views towards Lake Victoria. Ideal for couples, small families or work trips, with a dedicated workspace and fast WiFi.",
    highlights: [
      { icon: "home", title: "Entire apartment", text: "You'll have the apartment to yourself." },
      { icon: "wifi", title: "Great for remote work", text: "Fast WiFi and a dedicated workspace." },
      { icon: "door", title: "Easy check-in", text: "Our caretaker meets you and hands over the keys." },
    ],
    sleeping: [
      { room: "Bedroom 1", beds: "1 queen bed", image: img("lakeview/bedroom-1.jpg") },
      { room: "Bedroom 2", beds: "2 single beds" },
    ],
    amenities: [
      { icon: "wifi", label: "Fast WiFi" },
      { icon: "kitchen", label: "Kitchen" },
      { icon: "parking", label: "Free parking" },
      { icon: "tv", label: "Smart TV" },
      { icon: "water", label: "Hot water" },
      { icon: "leaf", label: "Lake view" },
    ],
    ratings: sampleRatings,
    reviews: [
      { author: "Sample guest", date: "August 2026", text: "Placeholder review — replace with a real guest review." },
      { author: "Sample guest", date: "July 2026", text: "Placeholder review — replace with a real guest review." },
    ],
    neighbourhood: "Riat Hills overlooks the city and the lake, about 15 minutes from Kisumu CBD.",
    houseRules: commonRules,
    safety: commonSafety,
    cancellation: "Free cancellation up to 48 hours before check-in.",
  }),
  define({
    slug: "garden-suite",
    name: "Garden Suite, Kisumu, 1 bedroom",
    town: "Kisumu",
    location: "Tom Mboya, Kisumu, Kenya",
    type: "Entire apartment",
    pricePerNight: 3000,
    cleaningFee: 0,
    rating: 4.8,
    reviewCount: 86,
    maxGuests: 2,
    guestsLabel: "1-2 guests",
    bedrooms: 1,
    beds: 1,
    baths: 1,
    perks: ["WiFi", "Kitchen", "Smart TV"],
    video: { src: "/videos/garden/tour.mp4", poster: img("garden/tour-poster.jpg") },
    tour: [
      { room: "Living room", media: [img("garden/living-1.jpg"), vid("garden/tour"), img("garden/living-2.jpg"), img("garden/living-3.jpg"), img("garden/entrance-1.jpg")] },
      { room: "Bedroom", media: [img("garden/bedroom-1.jpg")] },
      { room: "Kitchen", media: [img("garden/kitchen-1.jpg")] },
      { room: "Bathroom", media: [img("garden/bathroom-1.jpg")] },
    ],
    description:
      "A cosy one-bedroom apartment with a bright living room. Everything you need for a short stay, with a kitchen, a comfortable queen bed and fast WiFi.",
    highlights: [
      { icon: "home", title: "Entire apartment", text: "You'll have the apartment to yourself." },
      { icon: "leaf", title: "Garden access", text: "Relax outside in the shared garden." },
    ],
    sleeping: [{ room: "Bedroom", beds: "1 queen bed", image: img("garden/bedroom-1.jpg") }],
    amenities: [
      { icon: "wifi", label: "Fast WiFi" },
      { icon: "kitchen", label: "Kitchen" },
      { icon: "parking", label: "Free parking" },
      { icon: "tv", label: "Smart TV" },
    ],
    ratings: sampleRatings,
    reviews: [
      { author: "Sample guest", date: "August 2026", text: "Placeholder review — replace with a real guest review." },
    ],
    neighbourhood: "Tom Mboya is a lively estate close to shops, matatu routes and the city centre.",
    houseRules: commonRules,
    safety: commonSafety,
    cancellation: "Free cancellation up to 48 hours before check-in.",
  }),
];

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}
