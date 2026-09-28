"use client";

import { useState } from "react";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { Icon } from "@/components/ui/Icon";

export function ListingActions({ slug, name }: { slug: string; name: string }) {
  const { isSaved, toggle } = useSavedProperties();
  const [shared, setShared] = useState(false);
  const saved = isSaved(slug);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch {
      // User dismissed the share sheet.
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <button type="button" onClick={share} className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 underline hover:bg-black/5">
        <Icon name="share" className="size-4" />
        {shared ? "Link copied" : "Share"}
      </button>
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 underline hover:bg-black/5"
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path
            d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20z"
            stroke="currentColor"
            strokeWidth="1.8"
            fill={saved ? "#ff385c" : "none"}
          />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
