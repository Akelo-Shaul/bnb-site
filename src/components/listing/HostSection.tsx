import type { Property } from "@/data/properties";
import { site } from "@/data/site";
import { bookingMessage, whatsappLink } from "@/lib/contact";
import { Icon } from "@/components/ui/Icon";
import { HostAvatar } from "./HostAvatar";

export function HostSection({ property }: { property: Property }) {
  const { host } = site;

  return (
    <section className="border-b border-line py-10">
      <div className="flex items-center gap-4">
        <HostAvatar size="lg" />
        <div>
          <h2 className="text-[22px] font-semibold">Hosted by {host.name}</h2>
          <p className="text-sm text-muted">{host.joined}</p>
        </div>
      </div>

      <ul className="mt-6 flex flex-wrap gap-6 text-sm">
        <li className="flex items-center gap-2">
          <Icon name="star" className="size-4 text-brand" />
          {property.reviewCount} reviews
        </li>
        <li className="flex items-center gap-2">
          <Icon name="shield" className="size-4 text-brand" />
          Identity verified
        </li>
      </ul>

      <p className="mt-6 max-w-lg text-[15px] leading-relaxed">{host.about}</p>
      <p className="mt-4 text-muted">Response rate: {host.responseRate}</p>
      <p className="mt-1 text-muted">Response time: {host.responseTime}</p>

      <a
        href={whatsappLink(bookingMessage({ property }))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-lg border border-black px-6 py-3 font-semibold hover:bg-black/5"
      >
        Contact host
      </a>

      <p className="mt-8 flex max-w-sm items-start gap-3 text-xs text-muted">
        <Icon name="shield" className="size-6 shrink-0 text-brand" />
        To protect yourself, only send payment after your booking has been confirmed by us on WhatsApp or Instagram.
      </p>
    </section>
  );
}
