"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/data/properties";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { bookingMessage, whatsappLink } from "@/lib/contact";
import { plural } from "@/lib/format";
import { PhotoTile } from "@/components/ui/PhotoTile";

// Glass listing card from Figma ("Component 3"), 330 × 439.
export function PropertyCard({ property }: { property: Property }) {
  const { isSaved, toggle } = useSavedProperties();
  const saved = isSaved(property.slug);
  const features = [
    property.guestsLabel,
    property.type,
    plural(property.beds, "bed"),
    plural(property.baths, "bath"),
    ...property.perks,
  ].join(" · ");

  // --pad is the even gap around the photo; the photo's radius is derived
  // from it so both curves stay concentric (outer radius = inner + pad).
  // Overlays and text sit at --inset from the card edge so they line up.
  return (
    <article
      data-property-card
      style={{ "--pad": "8px", "--radius": "25px", "--inset": "18px" } as CSSProperties}
      className="relative flex h-full max-h-[439px] min-h-[260px] w-[330px] shrink-0 snap-start flex-col rounded-[var(--radius)] bg-white/79 p-[var(--pad)] pb-0 backdrop-blur-sm transition-shadow hover:shadow-xl"
    >
      <PhotoTile
        src={property.images[0]}
        alt={property.name}
        sizes="330px"
        className="min-h-0 flex-1 rounded-t-[calc(var(--radius)-var(--pad))]"
      />

      {/* Top overlay: town tag, save, quick WhatsApp enquiry */}
      <span className="absolute left-[var(--inset)] top-[var(--inset)] rounded-[5px] bg-mist px-[11px] py-[2px] text-[14px] tracking-[0.02em]">
        {property.town}
      </span>
      <div className="absolute right-[var(--inset)] top-[var(--inset)] z-10 flex h-[27px] items-center gap-4">
        <button
          type="button"
          onClick={() => toggle(property.slug)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          className="grid size-6 place-items-center transition-transform hover:scale-110"
        >
          <svg viewBox="0 0 22 19.163" className="h-[17px] w-5" aria-hidden="true">
            <path
              d="M6.5 1C3.4625 1 1 3.4625 1 6.5C1 12 7.5 17 11 18.163C14.5 17 21 12 21 6.5C21 3.4625 18.5375 1 15.5 1C13.64 1 11.995 1.9235 11 3.337C10.4928 2.61469 9.81897 2.0252 9.03568 1.61841C8.25238 1.21162 7.38263 0.999502 6.5 1Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={saved ? "#ff385c" : "none"}
            />
          </svg>
        </button>
        <a
          href={whatsappLink(bookingMessage({ property }))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ask about ${property.name} on WhatsApp`}
          title="Ask on WhatsApp"
          className="grid size-6 place-items-center rounded-[4px] bg-whatsapp transition-transform hover:scale-110"
        >
          <Image src="/icons/sign-out.svg" alt="" width={21} height={18} loading="eager" className="h-[15px] w-auto -rotate-90" />
        </a>
      </div>

      <div className="flex shrink-0 flex-col px-[calc(var(--inset)-var(--pad))] pt-[14px]">
        <h3 className="text-[14px] font-semibold leading-tight">
          {/* Stretched link: the whole card opens the listing */}
          <Link href={`/properties/${property.slug}`} className="after:absolute after:inset-0 after:rounded-[var(--radius)]">
            {property.name}
          </Link>
        </h3>
        <span className="mt-[8px] block h-px w-[53px] bg-[#383838]/70" />
        <p className="mt-[6px] line-clamp-2 text-[12px] text-ink-soft">{features}</p>
        <span className="mt-[10px] block h-px w-[53px] bg-[#383838]/70" />
        <div className="flex items-center justify-between pb-[14px] pt-[6px]">
          <p className="flex items-center gap-[6px] text-[12px]">
            {property.rating.toFixed(1)}
            <Image src="/icons/star.svg" alt="" width={13} height={11} loading="eager" />
            <span>({property.reviewCount} reviews)</span>
          </p>
          <p className="text-[12px]">
            <span className="font-price text-[20px] font-bold">Ksh {property.pricePerNight.toLocaleString("en-KE")}</span>{" "}
            /night
          </p>
        </div>
      </div>
    </article>
  );
}
