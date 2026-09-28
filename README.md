# Shalom Gardens

Marketing site for a small collection of short-stay rentals in Kisumu. Guests browse the properties and book directly with the owner on **WhatsApp** or **Instagram**. There is no online payment or booking engine.

Built from the Figma file *Ratatoulie* (frames `Desktop - 1` → home page and `7:2044` → listing page).

## Stack

- Next.js 16 (App Router, static generation), React 19, TypeScript
- Tailwind CSS 4 (design tokens in `src/app/globals.css`)
- GSAP + `@gsap/react` for animations (`src/lib/gsap.ts`)

## Getting started

```bash
cp .env.example .env.local   # set the real WhatsApp number / Instagram handle
npm install
npm run dev                  # http://localhost:3000
```

`npm run build` produces a fully static site (every property page is prerendered).

## Project structure

```
src/
  app/
    page.tsx                    Home: hero + property cards, gallery, contact, footer
    properties/[slug]/page.tsx  Listing detail page (one per property)
  components/
    home/       Hero, PropertyCard, Gallery, ContactSection
    listing/    PhotoGrid, BookingCard, AvailabilityCalendar, Reviews, …
    ui/         Shared pieces: Icon, Wordmark, BookLink, SocialRail, PhotoTile, Footer
  data/
    properties.ts   All listing content (edit this to add/change properties)
    site.ts         Business name, host info, contact handles
  hooks/        useBooking (dates/guests state), useSavedProperties, useToday
  lib/          contact links (WhatsApp/Instagram), formatting, GSAP setup
public/
  images/       Photos and video poster frames
  videos/       Web-compressed MP4s (gallery + listing hero videos)
  icons/        SVG icons (Figma exports + social badges)
docs/           Content and animation guides
```

## Documentation

| Doc | Read it for |
| --- | --- |
| [`docs/project-status.md`](docs/project-status.md) | **Start here.** What's built, design decisions, placeholder content to replace, next steps |
| [`docs/setup.md`](docs/setup.md) | Installing Node, running locally, env vars, deploying |
| [`docs/architecture.md`](docs/architecture.md) | How the code is organised, data flow, design tokens |
| [`docs/content-guide.md`](docs/content-guide.md) | Editing properties, photos and contact details |
| [`docs/animations.md`](docs/animations.md) | GSAP conventions and the list of current animations |
| [`CHANGELOG.md`](CHANGELOG.md) | Version history |

> ⚠️ All listing content (prices, reviews, ratings, contact handles) is **placeholder**. See the checklist in `docs/project-status.md` §5.
