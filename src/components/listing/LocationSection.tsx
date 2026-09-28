import type { Property } from "@/data/properties";

export function LocationSection({ property }: { property: Property }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&z=14&output=embed`;

  return (
    <section id="location" className="scroll-mt-24 border-b border-line py-10">
      <h2 className="text-[22px] font-semibold">Where you&apos;ll be</h2>
      <div className="relative mt-6 h-[320px] overflow-hidden rounded-xl bg-mist sm:h-[480px]">
        <iframe
          src={mapSrc}
          title={`Map of ${property.location}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full border-0"
        />
        <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-lg bg-white px-4 py-2 text-sm shadow-md">
          Exact location provided after booking
        </p>
      </div>
      <p className="mt-6 font-semibold">{property.location}</p>
      <p className="mt-2 text-[15px] leading-relaxed">{property.neighbourhood}</p>
    </section>
  );
}
