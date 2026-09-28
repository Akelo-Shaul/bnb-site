# Content guide

## Contact details

Set these in `.env.local` (or the hosting provider's environment variables):

| Variable | Example | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254115089122` (default) | Every "Book" / WhatsApp link (digits only, country code, no leading 0) |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE` | `official_shaul_` (default) | Instagram profile + DM links |
| `NEXT_PUBLIC_TIKTOK_HANDLE` | `shalomgardens` (**placeholder**) | TikTok icon in the speed dial and footer |
| `NEXT_PUBLIC_SITE_URL` | `https://shalomgardens.co.ke` | Social share previews |

Speed-dial order: WhatsApp, TikTok, Instagram, then the `socials` list. Each entry has a `hint` (the instruction label shown beside the icon). Other social profiles (YouTube, LinkedIn, X) are the `socials` list in `src/data/site.ts`: add, remove or reorder entries there and both the speed dial and footer update. Icons live in `public/icons/` (50×50 SVG). The footer "Crafted by" credit is `site.credit`.

Host name, bio and response time also live in `src/data/site.ts`. Add a host photo to `public/images/` and set `host.avatar` to its path (e.g. `"/images/host.jpg"`).

## Properties

All listings are in `src/data/properties.ts`. **The current content is placeholder data** (sample reviews, ratings and prices). Replace it before launch.

To add a property:

1. Copy an existing entry and give it a unique `slug`. It becomes the URL: `/properties/<slug>`.
2. Put its photos in `public/images/` and list them **per room** in `tour` (`{ room: "Bedroom", media: [img("bed.jpg"), vid("bedroom")] }`). `vid("name")` expects `/videos/name.mp4` plus `/images/name-poster.jpg`. The rooms become the photo tour's thumbnails and sections. `images` is derived from `tour`: the first photo is the card cover and the next ones fill the listing grid. Missing slots show a grey "Photo coming soon" tile.
   - Optional `video: { src: "/videos/x.mp4", poster: "/images/x-poster.jpg" }` plays in the big tile at the top of the listing (muted, looped).
   - `sleeping[].image` sets the photo on each "Where you'll sleep" card. Without it the card shows a placeholder.
3. `icon` values must be names from `src/components/ui/Icon.tsx` (TypeScript will flag typos).

## Homepage gallery

`src/data/gallery.ts` lists the media for each of the five tiles (left top, left bottom, centre, right top, right bottom). Each tile cycles through its own list, sliding to the next item every `GALLERY_INTERVAL` seconds.

- Images: `{ type: "image", src: "/images/…", alt: "…" }`
- Videos: put the file in `public/videos/` (MP4/H.264, ideally under ~10 MB and 10–30s) and use `{ type: "video", src: "/videos/tour.mp4", poster: "/images/…", alt: "…" }`. Videos autoplay muted and loop, as browsers only allow autoplay without sound.
- The centre tile (portrait) cycles two videos. Other tiles mix photos and landscape videos.

## Preparing videos

Raw phone/stock videos are far too big for the web (the originals were 12–56 MB each). Compress them first, e.g. with ffmpeg:

```bash
# landscape → 1280px wide (use scale=720:-2 for portrait), max 12s, no audio
ffmpeg -i input.mp4 -t 12 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -preset slow -crf 28 \
  -pix_fmt yuv420p -movflags +faststart public/videos/name.mp4
# poster frame shown before the video loads
ffmpeg -ss 0.5 -i public/videos/name.mp4 -frames:v 1 -q:v 4 public/images/name-poster.jpg
```

ffmpeg isn't installed system-wide on the dev machine; `npx ffmpeg-static` or `sudo apt install ffmpeg` both work.

## How booking works

- **WhatsApp:** buttons open `wa.me/<number>` with a pre-filled message containing everything the guest filled in: property and location, check-in/out (with weekday), number of nights, guests and estimated total. Also a listing link if `NEXT_PUBLIC_SITE_URL` is set.
- **Instagram:** Instagram doesn't allow pre-filled DMs, so the button copies the same message to the clipboard and opens the DM. The guest pastes it.
- Availability isn't tracked on the site. The calendar only collects the guest's preferred dates.
