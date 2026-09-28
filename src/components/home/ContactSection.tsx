import Image from "next/image";
import { site } from "@/data/site";
import { bookingMessage, instagramDmLink, whatsappLink } from "@/lib/contact";

// The dark #3e3e3e band is empty in Figma; it holds the booking contact CTA.
export function ContactSection() {
  return (
    <section id="contact" className="bg-charcoal px-6 py-20 text-white md:px-[78px] lg:flex lg:h-[873px] lg:items-center">
      <div className="mx-auto grid w-full max-w-[1135px] gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.2em] text-brand">Book direct</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-[56px]">
            Ready to stay with us?
          </h2>
          <p className="mt-6 max-w-md text-lg text-white/75">
            Send us your dates and number of guests. We&apos;ll confirm availability and payment details, usually{" "}
            {site.host.responseTime}.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href={whatsappLink(bookingMessage({}))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 transition-colors hover:bg-white/10"
          >
            <Image src="/icons/whatsapp.svg" alt="" width={50} height={50} />
            <span>
              <span className="block text-xl font-semibold">Chat on WhatsApp</span>
              <span className="text-white/70">Fastest way to book</span>
            </span>
          </a>
          <a
            href={instagramDmLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 transition-colors hover:bg-white/10"
          >
            <Image src="/icons/instagram.svg" alt="" width={50} height={50} />
            <span>
              <span className="block text-xl font-semibold">Message on Instagram</span>
              <span className="text-white/70">@{site.instagramHandle}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
