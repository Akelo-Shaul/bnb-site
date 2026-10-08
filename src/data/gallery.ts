// Homepage gallery: five tiles, each cycling through its own media.
// Every few seconds each tile slides its current item out to the left and the
// next one in from the right (see components/home/Gallery.tsx).
//
// Photos live in /public/images, videos in /public/videos (web-compressed MP4,
// with a matching `<name>-poster.jpg`). Items may repeat across tiles.
// A tile with a single item just stays still.

export type GalleryMedia =
  | { type: "image"; src: string; alt: string }
  // `src: null` shows a "Video coming soon" tile until the file is added,
  // e.g. { type: "video", src: "/videos/tour.mp4", poster: "/images/hero.jpg", alt: "…" }
  | { type: "video"; src: string | null; poster?: string; alt: string };

const image = (name: string, alt: string): GalleryMedia => ({ type: "image", src: `/images/${name}`, alt });
const video = (name: string, alt: string): GalleryMedia => ({
  type: "video",
  src: `/videos/${name}.mp4`,
  poster: `/images/${name}-poster.jpg`,
  alt,
});

/** Order matches the Figma layout: left top, left bottom, centre (tall), right top, right bottom. */
export const galleryTiles: GalleryMedia[][] = [
  [image("harmes/living-1.jpg", "3-bedroom living room"), image("lakeview/bedroom-1.jpg", "2-bedroom bedroom"), image("garden/kitchen-1.jpg", "1-bedroom kitchen")],
  [image("lakeview/living-1.jpg", "2-bedroom living room"), image("harmes/bedroom-1.jpg", "3-bedroom master bedroom"), image("garden/living-2.jpg", "1-bedroom lounge")],
  // Centre tile (portrait): autoplaying videos.
  [video("lakeview/tour", "2-bedroom video tour"), video("garden/tour", "1-bedroom video tour")],
  [image("harmes/dining-2.jpg", "3-bedroom dining area"), image("garden/bedroom-1.jpg", "1-bedroom bedroom"), image("lakeview/dining-1.jpg", "2-bedroom dining and kitchen")],
  [image("harmes/kitchen-1.jpg", "3-bedroom kitchen"), image("lakeview/living-3.jpg", "2-bedroom lounge"), image("harmes/living-3.jpg", "3-bedroom lounge")],
];

/** Seconds each item stays on screen before the tiles slide. */
export const GALLERY_INTERVAL = 5;
