# Architecture

## Rendering

- Everything is prerendered at build time. `/properties/[slug]` uses `generateStaticParams` over `properties`, with `dynamicParams = false`, so unknown slugs 404.
- Server components by default. Client components (`"use client"`) only where there's interactivity: `Hero` (GSAP), `PropertyCard` (save), `SocialRail` (speed dial), `Gallery` (carousel timer + GSAP), and in `listing/` the `BookingCard`, `AvailabilityCalendar`, `PhotoGrid` (dialog), `ListingActions`, `ShowMore`, `ContactButtons`, `MobileBookingBar`, `SectionNav`, `PhotoTour` (+ `Lightbox`).
- Listing pages are wrapped in `BookingProvider` (`hooks/useBooking.tsx`), which shares check-in, checkout and guests between the calendar, booking card and mobile bar.

## Data

| File | Holds |
| --- | --- |
| `src/data/site.ts` | Business name/tagline, contact handles (env-overridable), host profile, currency |
| `src/data/properties.ts` | `Property` type, all listings (photos/videos per room in `tour`, optional hero `video`; `images` = photos only, derived via `define()`; `tourMedia()` = everything in order, used for `?photo=N`), `getProperty(slug)` |
| `src/data/gallery.ts` | Homepage gallery tiles (images/videos per tile) and `GALLERY_INTERVAL` |

No database or API. Editing these files and rebuilding updates the site.

## Components

```
components/
  ui/        Icon (inline SVG set + IconName type), Wordmark, BookLink, SocialRail,
             PhotoTile (image or grey placeholder), Footer
  home/      Hero, PropertyCard, Gallery, ContactSection
  listing/   PhotoGrid, ListingActions, Overview, HostAvatar, ShowMore,
             AvailabilityCalendar, BookingCard, ContactButtons, MobileBookingBar,
             Reviews, LocationSection, HostSection, ThingsToKnow, SectionNav, PhotoTour
```

## Helpers

| File | Purpose |
| --- | --- |
| `lib/contact.ts` | `whatsappLink`, `whatsappDisplay`, `instagramDmLink`, `instagramProfileLink`, `bookingMessage` (detailed booking text), `formatDate` |
| `lib/format.ts` | `formatPrice` (Ksh), `nightsBetween`, `plural` |
| `lib/gsap.ts` | Registers GSAP plugins; exports `gsap`, `ScrollTrigger`, `MorphSVGPlugin`, `useGSAP`, `REDUCED_MOTION` |
| `hooks/useSavedProperties.ts` | Hearted properties in `localStorage`, synced across components/tabs |
| `hooks/usePhotoTour.ts` | `open(photo?)` / `close()` for the photo tour via `?modal=photo-tour` (Back-button aware) |
| `hooks/useToday.ts` | Visitor-local today (`YYYY-MM-DD`), empty on the server to avoid hydration mismatches |

## Styling

Tailwind 4 with design tokens in `src/app/globals.css` (`@theme`), taken from Figma:

| Token | Value | Use |
| --- | --- | --- |
| `brand` | `#ff6f00` | Book CTA, accents |
| `whatsapp` | `#06a215` | Card enquiry button |
| `ink` / `ink-soft` / `charcoal` | `#323232` / `#3e3e3e` / `#3e3e3e` | Text, contact band |
| `mist` / `tile` | `#d9d9d9` / `#b0b0b0` | Gallery band, photo placeholders, tags |
| `footer` | `#6b6666` | Footer |
| `font-display` / `font-sans` / `font-price` | Iosevka Charon Mono / Inter / Instrument Sans | Wordmark / body / prices |

Key Figma measurements kept: cards 330 × 439 (max; they shrink to fit short screens because the hero is locked to `100svh`) with 25px radius and 79% white glass (photo inset evenly by 8px with a concentric 17px radius; change `--pad`/`--radius`/`--inset` in `PropertyCard.tsx` and the rest follows), 15px card gap, gallery columns 331/331/445 at 588px tall.
