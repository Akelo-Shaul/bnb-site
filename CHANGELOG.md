# Changelog

## Unreleased

- Home hero is now always exactly one screen tall (`100svh`). It was 1024px min (the Figma frame height) and overflowed shorter screens.
- Smaller, fluid wordmark (22–44px) and Book link (20–32px) that scale with the viewport.
- Property cards shrink (max 439px, min 260px) by reducing the photo height so they always fit; the social rail's icons and spacing scale too.
- On phones the social icons sit in a row above the cards instead of floating over them.
- Property cards: even 8px gap around the photo (top and sides) and concentric corners (photo radius = card radius 25px − gap = 17px). The tag, heart and WhatsApp button, and the text all align on an 18px inset. Driven by the `--pad`, `--radius` and `--inset` CSS variables in `PropertyCard.tsx`.
- Contact speed dial replaces the hero social rail: only the orange "?" shows; clicking morphs it into ✕ (GSAP MorphSVG) and slides the links up out of it; ✕ or Escape slides them back.
- Socials now match shaulakelo.com (Instagram `official_shaul_`, YouTube, LinkedIn, X); TikTok removed; WhatsApp number set to 254115089122. Unused Figma icons (tiktok, heart, line) deleted.
- Footer: full contact list plus a "CRAFTED BY" credit with the animated robot GIF linking to github.com/Akelo-Shaul.
- Listing pages: Airbnb-style sticky section nav (Photos / Amenities / Reviews / Location) with active underline; the price summary and Book on WhatsApp appear in it once the booking card has scrolled past.
- Booking message now includes everything filled in: location, dates with weekday, number of nights, guests, estimated total (or nightly rate), and a listing link when `NEXT_PUBLIC_SITE_URL` is set.
- Gallery: the centre tile is an autoplaying (muted, looped) video; every 5s each tile slides its current photo/video out to the left and the next one in from the right, within that tile only, rippling tile by tile (GSAP). Pauses when off screen or the tab is hidden. Media per tile is configured in `src/data/gallery.ts`.
- Content: added the client's 4 interior photos and 6 videos (compressed from ~145 MB of 4K to 3.2 MB, 720p/1280p H.264, ≤12s, no audio, with poster frames). Properties now list photos per room (`tour`) and have a hero `video`; the gallery mixes photos and videos.
- Listing pages: the big photo tile is an autoplaying video; every grid tile and "Show all photos" open an Airbnb-style **photo tour** (`?modal=photo-tour`): a sheet slides up with room thumbnails and per-room photo sections, and clicking a photo opens a full-screen lightbox (fade in, photos slide between, ←/→/Esc, counter). Browser Back closes the tour.
- TikTok restored (it had been removed): icon back in the speed dial and footer with a placeholder handle (`NEXT_PUBLIC_TIKTOK_HANDLE`). Deleted Figma icons restored.
- Speed dial: each icon shows an instruction label ("Book on WhatsApp", "Watch us on TikTok", …); the closed "?" shows "Contact & book" on hover.
- Photo tour redesigned to match Airbnb's: 1400px layout, room thumbnails (183×120), per-room sections with a sticky title column (1/3) and media column (2/3) in a repeating [big + two stacked] / [two side by side] pattern. Rooms now include **videos** (autoplay muted while on screen, ▶ badge), which the lightbox also plays (with controls). Placeholder media is reused across rooms.
- Project pushed to GitHub: private repo `Akelo-Shaul/bnb-site`.
- Fix: Vercel build crashed with `ERR_INVALID_URL` when `NEXT_PUBLIC_SITE_URL` was set but empty (`?? ` doesn't catch `""`). New `src/lib/site-url.ts` skips empty/invalid values, adds a missing `https://`, and falls back to Vercel's `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`, then localhost.
- Mobile fix: listing pages were laid out 716px wide on a 390px phone in Chrome (the "Where you'll sleep" scroller stretched the single-column grid), so the page and photo tour were zoomed out with images cut off. The mobile grid column is now `minmax(0,1fr)`. Desktop is unchanged.
- Photo tour on mobile: room titles stick to the top (under the back/Share bar) while their photos scroll, like on desktop; grids keep their layout with tighter gaps and shrink to the screen. Desktop is unchanged.
- **Owner's real media and prices (2026-10-08).** All placeholder photos/videos (stock videos, Pinterest photos, Rawpixel hero) deleted and replaced with the owner's own: 3-bedroom (Harmes) 13 photos, 2-bedroom (Lakeview) 8 photos + a 72s video tour, 1-bedroom 1 video tour plus 7 stills taken from it. Media now lives per property in `public/images/<property>/` and `public/videos/<property>/`; photos were stripped of EXIF (including GPS) and resized to ≤1600px, videos re-encoded for the web (H.264, faststart, 64k audio). New hero `hero-living.jpg` (3-bedroom lounge). Gallery rebuilt from the new media.
- Prices: 1 bedroom Ksh 3,000, 2 bedroom Ksh 4,000, 3 bedroom Ksh 6,000 (Ksh 5,000 for Monday–Wednesday nights). New optional `weekdayRate` on a property; `src/lib/pricing.ts` prices a stay night by night (keyed by each night's start date), and the booking card, section nav, mobile bar, property card and WhatsApp message all show it (e.g. "Ksh 6,000 × 2 nights + Ksh 5,000 × 3 nights").
- The third listing is now a **1 bedroom** ("Garden Suite", slug `garden-suite`, was `garden-studio`).
- Units are shown in the order 3 bedroom, 1 bedroom, 2 bedroom: property cards follow that order, and every gallery tile lists one item per unit in that order, so the gallery always shows one unit at a time (all five tiles slide to the next unit together).
- Next: more client-specified GSAP animations, real content (see `docs/project-status.md`).

## 0.1.0 — 2026-09-28

- Initial site built from the Figma file "Ratatoulie".
- Home page: hero with property cards and social rail, gallery mosaic, contact section, footer.
- Property detail pages (`/properties/[slug]`) with photo grid, booking card, date picker, reviews, map, host and house rules.
- Booking via WhatsApp (pre-filled message) and Instagram (message copied to clipboard).
- GSAP wired up with a placeholder hero intro.
- Docs: project status/hand-off, setup & deployment, architecture, content guide, animations.
