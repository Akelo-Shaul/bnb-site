"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { bookingMessage, instagramProfileLink, tiktokLink, whatsappLink } from "@/lib/contact";
import { gsap, REDUCED_MOTION } from "@/lib/gsap";

// Top → bottom order in the open stack (the last one sits nearest the toggle).
// `hint` is the instruction shown beside each icon while the menu is open.
const links = [
  { label: "WhatsApp", hint: "Book on WhatsApp", href: whatsappLink(bookingMessage({})), icon: "/icons/whatsapp.svg" },
  { label: "TikTok", hint: "Watch us on TikTok", href: tiktokLink(), icon: "/icons/tiktok.svg" },
  { label: "Instagram", hint: "Follow & DM on Instagram", href: instagramProfileLink(), icon: "/icons/instagram.svg" },
  ...site.socials,
];

// Speech bubble with "?" from the Figma contact-support icon (50×50 viewBox)…
const BUBBLE =
  "M6.25 21.3542C6.25 13.0125 13.0125 6.25 21.3542 6.25H28.6458C36.9875 6.25 43.75 13.0125 43.75 21.3542C43.75 29.6958 36.9875 36.4583 28.6458 36.4583H27.9167V43.75C27.9167 43.75 6.25 40.1042 6.25 21.3542ZM28.8448 13.0021C29.9177 13.7146 30.7271 14.8698 30.7271 16.4187C30.7271 18.0625 30.0635 19.2708 28.9896 20.0104C28.5658 20.2978 28.0978 20.5139 27.6042 20.65V22.2458C27.6042 22.451 27.5637 22.6542 27.4852 22.8438C27.4067 23.0333 27.2916 23.2056 27.1465 23.3507C27.0014 23.4958 26.8292 23.6109 26.6396 23.6894C26.45 23.7679 26.2469 23.8083 26.0417 23.8083C25.8365 23.8083 25.6333 23.7679 25.4437 23.6894C25.2542 23.6109 25.0819 23.4958 24.9368 23.3507C24.7917 23.2056 24.6766 23.0333 24.5981 22.8438C24.5196 22.6542 24.4792 22.451 24.4792 22.2458V19.3323C24.4791 18.9359 24.6297 18.5542 24.9005 18.2647C25.1712 17.9751 25.542 17.7993 25.9375 17.7729C26.5146 17.7344 26.9521 17.6198 27.2167 17.4375C27.3234 17.3667 27.4097 17.2689 27.4667 17.1542C27.5292 17.0292 27.6021 16.8062 27.6021 16.4177C27.6021 16.0927 27.474 15.8427 27.1146 15.6031C26.7062 15.3323 26.05 15.1323 25.2615 15.1073C24.4823 15.0823 23.725 15.2344 23.1677 15.5042C22.6094 15.775 22.4052 16.0792 22.3469 16.3031C22.2996 16.5058 22.2123 16.697 22.0902 16.8655C21.968 17.034 21.8134 17.1764 21.6354 17.2843C21.4575 17.3922 21.2598 17.4635 21.0539 17.4939C20.848 17.5244 20.6381 17.5134 20.4366 17.4617C20.235 17.4099 20.0458 17.3184 19.8801 17.1925C19.7143 17.0666 19.5754 16.9089 19.4715 16.7286C19.3676 16.5483 19.3007 16.349 19.2748 16.1425C19.249 15.936 19.2646 15.7264 19.3208 15.526C19.6792 14.1292 20.725 13.2167 21.8052 12.6927C22.8885 12.1667 24.1625 11.9448 25.3615 11.9833C26.551 12.0208 27.8219 12.3208 28.8448 13.0021ZM26.0417 30.2083C26.5942 30.2083 27.1241 29.9888 27.5148 29.5981C27.9055 29.2074 28.125 28.6775 28.125 28.125C28.125 27.5725 27.9055 27.0426 27.5148 26.6519C27.1241 26.2612 26.5942 26.0417 26.0417 26.0417C25.4891 26.0417 24.9592 26.2612 24.5685 26.6519C24.1778 27.0426 23.9583 27.5725 23.9583 28.125C23.9583 28.6775 24.1778 29.2074 24.5685 29.5981C24.9592 29.9888 25.4891 30.2083 26.0417 30.2083Z";
// …and the ✕ it morphs into.
const CROSS =
  "M14.4 18 18 14.4 25 21.4 32 14.4 35.6 18 28.6 25 35.6 32 32 35.6 25 28.6 18 35.6 14.4 32 21.4 25Z";

const ICON_SIZE = "size-8 md:size-[clamp(34px,5svh,50px)]";

// Contact "speed dial": only the orange contact button shows by default.
// Clicking it morphs the "?" bubble into an ✕ and slides the social links up
// out of it; clicking ✕ (or pressing Escape) slides them back in.
export function SocialRail({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const listId = useId();

  // Runs from event handlers only (never during render).
  function animate(toOpen: boolean) {
    const d = window.matchMedia(REDUCED_MOTION).matches ? 0 : 1;
    const items = gsap.utils.toArray<HTMLElement>("[data-social-item]", root.current);
    const morph = root.current!.querySelector("[data-morph]");
    const morphSvg = root.current!.querySelector("[data-morph-svg]");
    // Distance from an icon's resting spot down to the toggle. offsetTop
    // ignores transforms, so this stays correct mid-animation.
    const tucked = (_: number, el: HTMLElement) =>
      toggle.current!.offsetTop - (nav.current!.offsetTop + el.offsetTop);

    gsap.to(morph, { morphSVG: toOpen ? CROSS : BUBBLE, duration: 0.4 * d, ease: "power2.inOut" });
    gsap.to(morphSvg, { rotation: toOpen ? 90 : 0, duration: 0.4 * d, ease: "power2.inOut" });

    if (toOpen) {
      // Start tucked behind the toggle and slide up; nearest icon leaves first.
      gsap.fromTo(
        items,
        { y: tucked, scale: 0.5, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.45 * d,
          ease: "back.out(1.6)",
          stagger: { each: 0.06 * d, from: "end" },
          overwrite: true,
        },
      );
    } else {
      // Slide back down into the toggle; the top icon goes last.
      gsap.to(items, {
        y: tucked,
        scale: 0.5,
        autoAlpha: 0,
        duration: 0.3 * d,
        ease: "power2.in",
        stagger: { each: 0.05 * d, from: "start" },
        overwrite: true,
      });
    }
  }

  function setOpenAnimated(next: boolean) {
    setOpen(next);
    animate(next);
  }

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenAnimated(false);
      toggle.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Stop any running tweens if the component unmounts mid-animation.
  useEffect(() => {
    const el = root.current;
    return () => gsap.killTweensOf(el ? el.querySelectorAll("*") : []);
  }, []);

  return (
    <div ref={root} className={`relative flex flex-col items-center ${className}`}>
      <nav
        ref={nav}
        id={listId}
        aria-label="Contact and social links"
        inert={!open}
        className="absolute bottom-full mb-2.5 flex flex-col items-center gap-2.5 md:mb-[clamp(12px,2.5svh,24px)] md:gap-[clamp(12px,2.5svh,24px)]"
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            aria-label={l.label}
            target="_blank"
            rel="noopener noreferrer"
            data-social-item
            // Hidden until opened; GSAP's autoAlpha takes over from here.
            className="group/item invisible relative grid place-items-center opacity-0"
          >
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink shadow-md transition-colors group-hover/item:bg-white md:text-sm">
              {l.hint}
            </span>
            <Image
              src={l.icon}
              alt=""
              width={50}
              height={50}
              loading="eager"
              className={`${ICON_SIZE} object-contain transition-transform hover:scale-110`}
            />
          </a>
        ))}
      </nav>

      <button
        ref={toggle}
        type="button"
        onClick={() => setOpenAnimated(!open)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? "Close contact links" : "Open contact links"}
        className="group/toggle relative z-10 rounded-full transition-transform hover:scale-110"
      >
        {/* Hint beside the closed "?" button */}
        <span
          className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-ink shadow-md transition-opacity md:text-sm ${
            open ? "opacity-0" : "opacity-0 group-hover/toggle:opacity-100 group-focus-visible/toggle:opacity-100"
          }`}
        >
          Contact &amp; book
        </span>
        <svg data-morph-svg viewBox="0 0 50 50" className={`${ICON_SIZE} block`} aria-hidden="true">
          <rect width="50" height="50" rx="25" fill="#FF6F00" />
          <path data-morph d={BUBBLE} fillRule="evenodd" clipRule="evenodd" fill="black" />
        </svg>
      </button>
    </div>
  );
}
