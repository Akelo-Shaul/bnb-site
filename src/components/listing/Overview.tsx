import type { Property } from "@/data/properties";
import { site } from "@/data/site";
import { plural } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { PhotoTile } from "@/components/ui/PhotoTile";
import { HostAvatar } from "./HostAvatar";
import { ShowMore } from "./ShowMore";

export function Overview({ property }: { property: Property }) {
  return (
    <>
      <section className="flex items-start justify-between gap-6 border-b border-line pb-6">
        <div>
          <h2 className="text-[22px] font-semibold">
            {property.type} hosted by {site.host.name}
          </h2>
          <p className="mt-1 text-muted">
            {[
              plural(property.maxGuests, "guest"),
              plural(property.bedrooms, "bedroom"),
              plural(property.beds, "bed"),
              plural(property.baths, "bath"),
            ].join(" · ")}
          </p>
        </div>
        <HostAvatar size="md" />
      </section>

      <section className="space-y-6 border-b border-line py-8">
        {property.highlights.map((h) => (
          <div key={h.title} className="flex gap-6">
            <Icon name={h.icon} className="size-6 shrink-0" />
            <div>
              <p className="font-semibold">{h.title}</p>
              <p className="text-sm text-muted">{h.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="border-b border-line py-8 leading-relaxed">
        <ShowMore>
          <p>{property.description}</p>
        </ShowMore>
      </section>

      <section className="border-b border-line py-10">
        <h2 className="text-[22px] font-semibold">Where you&apos;ll sleep</h2>
        <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto">
          {property.sleeping.map((room) => (
            <div key={room.room} className="w-[220px] shrink-0">
              <PhotoTile
                src={room.image}
                alt={room.room}
                sizes="220px"
                className="aspect-[4/3] rounded-xl"
              />
              <p className="mt-3 font-semibold">{room.room}</p>
              <p className="text-sm text-muted">{room.beds}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="amenities" className="scroll-mt-24 border-b border-line py-10">
        <h2 className="text-[22px] font-semibold">What this place offers</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {property.amenities.map((a) => (
            <li key={a.label} className="flex items-center gap-4">
              <Icon name={a.icon} className="size-6 shrink-0" />
              {a.label}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
