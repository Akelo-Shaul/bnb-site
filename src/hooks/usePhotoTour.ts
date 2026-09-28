"use client";

import { usePathname, useRouter } from "next/navigation";

export const TOUR_PARAM = "photo-tour";

// Whether the current tour entry was pushed by us (so closing can go back
// instead of leaving an extra history entry behind).
let pushedByUs = false;

// Opens/closes the photo tour via the URL (?modal=photo-tour&photo=3), like
// Airbnb, so it can be linked to and the browser Back button closes it.
export function usePhotoTour() {
  const router = useRouter();
  const pathname = usePathname();

  return {
    open(photo?: number) {
      pushedByUs = true;
      const query = `?modal=${TOUR_PARAM}${photo !== undefined ? `&photo=${photo}` : ""}`;
      router.push(`${pathname}${query}`, { scroll: false });
    },
    close() {
      if (pushedByUs) {
        pushedByUs = false;
        router.back();
      } else {
        router.replace(pathname, { scroll: false });
      }
    },
  };
}
