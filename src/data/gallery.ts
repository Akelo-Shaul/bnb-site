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
  [image("living-workspace.jpg", "Living room with workspace"), video("bedroom", "Bedroom"), image("city-lounge.jpg", "Lounge with city view")],
  [video("exterior", "Apartment exterior"), image("hero.jpg", "Apartment buildings"), image("garden-study.jpg", "Study with garden view")],
  // Centre tile (portrait): autoplaying videos.
  [video("dining", "Dining nook"), video("living-arch", "Living room")],
  [image("sunset-lounge.jpg", "Lounge at sunset"), video("living-stairs", "Living room with stairs"), image("glass-study.jpg", "Study")],
  [video("hallway", "Hallway"), image("city-lounge.jpg", "Lounge with city view"), image("sunset-lounge.jpg", "Lounge at sunset")],
];

/** Seconds each item stays on screen before the tiles slide. */
export const GALLERY_INTERVAL = 5;
