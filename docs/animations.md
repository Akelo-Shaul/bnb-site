# Animations (GSAP)

- Import from `@/lib/gsap`, never directly from `gsap`, so plugins (ScrollTrigger, MorphSVGPlugin, useGSAP) are registered once. All GSAP plugins are free since 3.13.
- Animate inside client components with `useGSAP(() => { … }, { scope: ref })`; it cleans up tweens and ScrollTriggers on unmount.
- Wrap motion in `gsap.matchMedia()` with `` `not ${REDUCED_MOTION}` `` so visitors who prefer reduced motion get a static page.
- Target elements with `data-*` hooks (e.g. `[data-property-card]`) rather than styling classes.

## Current animations

| Where | What |
| --- | --- |
| `components/home/Hero.tsx` | Placeholder intro: property cards fade/slide up with a stagger. Replace once the real animation is specified. |
| `components/ui/SocialRail.tsx` | **Contact speed dial** (client request). Closed: only the orange "?" bubble. Click → bubble morphs into ✕ (`MorphSVGPlugin`, 0.4s, plus a 90° spin) and the links (WhatsApp, Instagram, YouTube, LinkedIn, X) slide up out of the button with `back.out` easing, nearest first. Click ✕ or press Escape → they slide back down into it, top one last, and ✕ morphs back. Hidden links are `inert` so they can't be tabbed to. Tweens run from the click handler (not an effect) to satisfy the React compiler lint rules. |
| `components/home/Gallery.tsx` | **Gallery carousel** (client request). Every `GALLERY_INTERVAL` (5s) each tile slides its current item out to the left (`xPercent: -100`) while the next slides in from the right, 0.9s `power3.inOut`, tile *i* delayed by i × 0.12s. The motion stays inside each tile (`overflow-hidden`). Videos restart when they slide in and pause after sliding out. The timer runs only while the gallery is in view and the tab is visible. Tiles with one item stay still. |
| `components/listing/PhotoTour.tsx` | **Photo tour** (Airbnb copy; layout: sticky room title + [big + 2 stacked] / [pair] rows; videos play only while on screen via IntersectionObserver). Sheet slides up from the bottom (`yPercent 100→0`, 0.5s `power3.out`) and back down on close/Back (0.4s `power3.in`). Room thumbnails smooth-scroll to their section. **Lightbox**: fades in (0.3s), photos slide 60px from the direction of travel with a fade (0.35s), fades out on close (0.25s). It's portalled to `<body>` because the sheet's transform would otherwise break `position: fixed`. |

Speed dial labels: each link shows its `hint` in a pill to the left; they ride along with the icon's slide animation.

Non-GSAP motion: the listing page section nav (`components/listing/SectionNav.tsx`) slides in and out with a CSS transition.
