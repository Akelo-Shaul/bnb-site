import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { properties } from "@/data/properties";
import { instagramProfileLink, tiktokLink, whatsappDisplay, whatsappLink } from "@/lib/contact";

const linkClass = "hover:text-white hover:underline";

export function Footer() {
  const contacts = [
    { label: `WhatsApp ${whatsappDisplay()}`, href: whatsappLink() },
    { label: `Instagram @${site.instagramHandle}`, href: instagramProfileLink() },
    { label: `TikTok @${site.tiktokHandle}`, href: tiktokLink() },
    ...site.socials.map((s) => ({ label: s.label, href: s.href })),
  ];

  return (
    <footer className="bg-footer px-6 py-10 text-white md:px-[78px]">
      <div className="mx-auto flex max-w-[1284px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-2xl font-bold uppercase">{site.name}</p>
          <p className="mt-2 max-w-xs text-sm text-white/75">{site.tagline}</p>
        </div>
        <nav aria-label="Properties" className="text-sm">
          <p className="mb-3 font-semibold">Our places</p>
          <ul className="space-y-2 text-white/80">
            {properties.map((p) => (
              <li key={p.slug}>
                <Link href={`/properties/${p.slug}`} className={linkClass}>
                  {p.name.split(",")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Social" className="text-sm">
          <p className="mb-3 font-semibold">Get in touch</p>
          <ul className="space-y-2 text-white/80">
            {contacts.map((c) => (
              <li key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1284px] flex-col-reverse items-start gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        {/* Attribution, styled after the footer on shaulakelo.com */}
        <a
          href={site.credit.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Crafted by ${site.credit.name}`}
          className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white"
        >
          Crafted by
          <Image
            src={site.credit.image}
            alt=""
            width={28}
            height={28}
            unoptimized
            className="size-7 transition-transform group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
