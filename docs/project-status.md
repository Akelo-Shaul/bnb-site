# Project status & hand-off

_Last updated: 2026-09-28 · version 0.1.0 + unreleased changes (see CHANGELOG)_

Start here to find out where the project stands. It covers what has been built, what was decided and why, what is still placeholder, and what to do next.

## 1. Goal

A website for **one owner with several short-stay rentals (BnBs) in Kisumu**. Visitors browse the properties and **contact the owner to book, via WhatsApp or Instagram**. There are no online payments, accounts or availability backend. The site is a shop window that funnels guests into a chat.

## 2. Design source

| Item | Value |
| --- | --- |
| Figma file | *Ratatoulie*, file key `LNP8wl0waVCUnO6sGu4FKh` |
| Home page frame | `Desktop - 1`, node `1:1886` (1440 × 2878) |
| Listing page frame | node `7:2044` (1440 × 5221). An Airbnb listing template with "Bordeaux Getaway" placeholder content |
| Folder structure reference | Screenshot supplied by the user (`~/Downloads/Pasted image (2).png`): Next.js App Router layout with `src/{app,components,data,hooks,lib}`, `docs/`, `public/` |

**Figma access notes**
- The file belongs to a different Figma account. The Figma connector (signed in as the site author's account) could only read it after the file was shared and the account was added to the owning team. Sharing only the file wasn't enough: Figma requires the reader to belong to the plan that owns the file.
- The connected Figma account is on the **Starter plan, limited to about 20 MCP tool calls per month**. About 5 successful reads were used in this session (metadata, screenshots, one full design-context export). Fetch only what's needed.
- Exported assets from Figma are in `public/icons/` (SVGs). Figma asset URLs expire after 7 days, so re-export from Figma if an icon is ever needed again.

## 3. What has been built

### Tech setup
- Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, ESLint.
- GSAP 3 + `@gsap/react`, registered once in `src/lib/gsap.ts`.
- Fonts via `next/font/google`: **Iosevka Charon Mono** (wordmark, from Figma), **Inter** (body), **Instrument Sans** (prices).
- Node.js 24 LTS was installed for the local user with **nvm** (`~/.nvm`); Node wasn't previously installed on the machine.
- `npm run build`, `npm run lint` and `tsc` all pass. All pages are statically generated.

### Pages

| Route | Source | Contents |
| --- | --- | --- |
| `/` | Figma `1:1886` | Hero photo with "SHALOM GARDENS" wordmark and orange **Book ↗** (opens WhatsApp); horizontally scrollable **property cards** (one per property); **contact speed dial**: an orange "?" button that morphs into ✕ and slides out WhatsApp, Instagram, YouTube, LinkedIn and X; **Gallery** 5-tile mosaic (centre tile = autoplay video; every tile slides to its next photo/video every 5s); **Contact section** in the dark band; footer |
| `/properties/[slug]` | Figma `7:2044`, adapted | Title, rating, Share/Save; 5-photo grid + "Show all photos" dialog; overview & highlights; description with Show more; "Where you'll sleep"; amenities; 2-month **date picker**; **sticky booking card**; reviews with rating bars; Google map; host section; "Things to know"; sticky mobile booking bar; big tile = **autoplay video**; every tile + "Show all photos" opens an Airbnb-style **photo tour** (`?modal=photo-tour`: slide-up sheet, room thumbnails, per-room sections laid out like Airbnb with photos **and videos**, full-screen lightbox); **Airbnb-style section nav** (Photos · Amenities · Reviews · Location) that slides in once the photos scroll away, underlines the current section, and adds price + Book on WhatsApp once the booking card has scrolled past |

One page is generated per entry in `src/data/properties.ts`. Unknown slugs return 404.

### Booking flow
1. The guest picks dates and a guest count (booking card or calendar; both share state through `useBooking`).
2. **Book on WhatsApp** opens `wa.me/<number>?text=…` with a message such as:
   ```
   Hi Shalom Gardens! I'd like to book *Harmes Apartments, Kisumu, 3 bedroom* (Milimani, Kisumu, Kenya).

   • Check-in: Sat, 3 Oct 2026
   • Check-out: Tue, 6 Oct 2026
   • Duration: 3 nights
   • Guests: 4
   • Estimated total: Ksh 1,500 (Ksh 500 × 3 nights)

   Listing: https://<NEXT_PUBLIC_SITE_URL>/properties/harmes-apartments   ← only when the env var is set

   Is it available for these dates?
   ```
   Only details the guest has filled in are included. With no dates it shows the nightly rate and asks "Which dates are available?". Generic buttons (hero Book, contact section) send a short greeting. Built by `bookingMessage()` in `src/lib/contact.ts`.
3. **Message on Instagram** copies the same text to the clipboard and opens `ig.me/m/<handle>`. Instagram doesn't support pre-filled DMs, so the guest pastes it.
4. With dates selected, the card shows an estimated total (nights × price + cleaning fee).

### Other behaviour
- **Save (heart)** on cards and listing pages is stored in the visitor's browser (`localStorage`) only.
- **Share** uses the phone's native share sheet, or copies the link on desktop.
- **Responsive**: hero always fills exactly one screen (tested at 1818×898, 1366×650, 1440 and 400px wide). On phones the contact speed dial sits right-aligned above the cards (icons at 32px so the stack fits), cards scroll sideways, and listing pages get a fixed bottom booking bar.
- **Reduced motion**: GSAP animations are skipped when the visitor's OS asks for reduced motion.
- **Animations**: see the table in `docs/animations.md` (card intro placeholder, contact speed dial).
- **Footer**: contact links (WhatsApp +254 115 089 122, Instagram, YouTube, LinkedIn, X) and a "CRAFTED BY" credit with the animated robot GIF linking to github.com/Akelo-Shaul, styled after the shaulakelo.com footer.

## 4. Decisions & deviations from Figma

| Decision | Why |
| --- | --- |
| Listing page content rewritten for Kisumu/Ksh; Airbnb branding removed; red "Reserve" → orange **Book on WhatsApp** + **Message on Instagram** | The Figma listing frame is a copied Airbnb template. Bookings happen in chat, not on-site. Orange `#ff6f00` is the brand accent from the home frame. |
| Dark `#3e3e3e` band filled with a "Ready to stay with us?" contact section | It's an empty rectangle in Figma. The contact CTA was the most useful content for it. |
| Footer uses the frame background colour `#6b6666` | The footer strip in Figma is the frame background showing through. |
| Price breakdown shows only nightly total + cleaning fee (no service fee/taxes) | Those were Airbnb platform fees. Direct bookings don't have them. |
| Calendar collects dates only; it doesn't show real availability | There is no availability data. The owner confirms availability in chat. |
| Green card button (Figma "gridicons:sign-out", rotated) = "Ask on WhatsApp" about that property | It's green like WhatsApp and was an unassigned action in the design. |
| Figma "M" letter-spacing quirk in the wordmark was not reproduced | It looked like an accidental kerning edit. |
| Map is a keyless Google Maps embed of the listing's `location` text | No API key needed. Shows the area, not the exact address ("Exact location provided after booking"). |
| "Today" is computed in the browser (`useToday`) | Pages are prebuilt; computing dates on the server would freeze the build date and cause hydration errors. |
| Above-the-fold icons use `loading="eager"` | They're tiny, and lazy-loading made them pop in late. |
| Hero is always exactly `100svh` (not the Figma 1024px), with the wordmark at 22–44px and Book at 20–32px instead of 64/48px | Client request (2026-09-28): the home page must fit the screen. Cards shrink (photo gets shorter, text block stays) down to 260px tall. |
| Card photo inset evenly by 8px with concentric corners (17px inside 25px) | Client request (2026-09-28). |
| Social rail → speed dial (only the contact "?" visible; click morphs to ✕ and reveals the links) | Client request (2026-09-28). |
| Socials = those on shaulakelo.com (Instagram `official_shaul_`, YouTube, LinkedIn, X); TikTok removed; WhatsApp `254115089122` | Client request (2026-09-28). YouTube/LinkedIn/X badge icons were drawn to match the Figma icon style (the Figma file had none). |
| TikTok kept with a placeholder handle; every speed-dial icon has an instruction label | Client request (2026-09-28): don't delete icons without a link, use a placeholder instead. **Lesson: never remove a design element just because its data is missing.** |
| Photo tour state lives in the URL (`?modal=photo-tour&photo=N`) instead of a separate route | Same as Airbnb: shareable, the Back button closes it, and the listing stays underneath. Needs a `<Suspense>` boundary because it reads search params on a static page. |
| Section nav + price bar on listing pages uses CSS transitions and a scroll listener, not GSAP | It's a UI state toggle, not a described animation. Swap to GSAP if the client wants a custom motion. |

## 5. Placeholder content (must be replaced before launch)

- [x] **WhatsApp number & socials.** Set 2026-09-28: WhatsApp `254115089122`, socials from shaulakelo.com (`src/data/site.ts`); TikTok is still a placeholder. Confirm these are the owner's booking contacts and not just the developer's.
- [ ] **All property data** in `src/data/properties.ts`: names, locations, prices (all `Ksh 500`), descriptions, rooms, amenities, rules.
- [ ] **Ratings, review counts and reviews.** Currently sample values and "Sample guest" placeholder reviews. Use real ones only.
- [ ] **Photos.** Only two exist (`hero.jpg` building, `sunset-lounge.jpg` lounge). The third property has none, and gallery/listing slots show "Photo coming soon".
- [ ] **Host details** in `src/data/site.ts`: name ("Shalom" is assumed), bio, "Hosting since", response time, avatar photo.
- [ ] **Property count.** The owner has more than three BnBs, but only three sample entries exist.
- [ ] **Hero image licence.** `hero.jpg` carries a "2023 Rawpixel Ltd." copyright tag. Confirm the licence or replace it with the owner's own photo.
- [ ] **Favicon.** Still the default Next.js `src/app/favicon.ico`.
- [x] **Gallery/listing media.** 6 client videos + 4 interior photos added (2026-09-28). Photos are shared across properties for now; each property should get its own.
- [ ] **Media licences.** The videos look like Pexels stock (filenames like `7239170-uhd_3840_2160_25fps.mp4`) and the photos look like Pinterest saves. Confirm they may be used commercially, or replace them with the owner's own.
- [ ] **TikTok handle.** Placeholder `shalomgardens`. Set `NEXT_PUBLIC_TIKTOK_HANDLE` or `site.tiktokHandle`.
- [ ] **Room photos.** Only "Bedroom 1" cards have a photo (a video frame). Add `sleeping[].image` for the rest.
- Note: `~/Downloads/Pasted image.png` (a university fees statement) and `~/Videos/Screencasts` (personal recordings) were deliberately **not** used.

## 6. Next steps (suggested order)

1. **Animations.** The client will describe these as we go; implement them per `docs/animations.md`.
2. **Real content.** Collect the items in section 5 from the owner and fill in `properties.ts`, `site.ts` and `public/images/`.
3. **Visual check on a real phone.** Desktop behaviour was verified by driving Firefox with puppeteer (section nav, price bar, speed dial, booking message). Check touch devices, especially the speed dial on short phones (with 5 icons, the open stack can reach the header on screens under ~700px tall).
4. **Version control.** `git` isn't installed. Install it (`sudo apt install git`), run `git init` and commit.
5. **Deploy.** See `docs/setup.md`. Vercel is simplest; set the `NEXT_PUBLIC_*` env vars there.
6. **SEO & sharing.** Set `NEXT_PUBLIC_SITE_URL`; add a favicon/app icon, an Open Graph image for the home page, and optionally `sitemap.ts` / `robots.ts` and LodgingBusiness JSON-LD.
7. **Nice-to-haves** (not requested yet):
   - Filter or sort properties once there are many.
   - The contact speed dial on listing pages too (it exists only on the home page).
   - Analytics on WhatsApp/Instagram clicks.
   - An Instagram feed in the gallery.
   - Real availability (e.g. an iCal feed from Airbnb/Booking.com) if the owner lists there too.

## 7. Known issues / housekeeping

- `public/icons/heart.svg` and `line.svg` are unused Figma exports, kept on purpose (don't delete design assets).
- With 6 icons, the open speed dial is ~300px tall on phones and can overlap the header on screens under ~700px tall.
- `public/icons/contact-support.svg` is no longer referenced (the speed dial draws it inline so it can morph). It's kept as the Figma original.
- Testing tip: headless `firefox --screenshot` always captures from the top of the page and before lazy content loads. For scroll/click states, use puppeteer-core with `browser: "firefox"` (installed outside the project; not a dependency).
- The listing frame in Figma still contains "Bordeaux"/"Ghazal" placeholder text. If the designer updates that frame, re-check the listing page against it.
- `next dev` rewrites a block inside `AGENTS.md`; that's expected (see the note in the file).
