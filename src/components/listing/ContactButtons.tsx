"use client";

import { useState } from "react";
import Image from "next/image";
import { bookingMessage, instagramDmLink, whatsappLink, type BookingRequest } from "@/lib/contact";

export function WhatsAppButton({ request, className = "" }: { request: BookingRequest; className?: string }) {
  return (
    <a
      href={whatsappLink(bookingMessage(request))}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark ${className}`}
    >
      <Image src="/icons/whatsapp.svg" alt="" width={22} height={22} className="rounded-full bg-white" />
      Book on WhatsApp
    </a>
  );
}

// Instagram DMs can't be pre-filled, so copy the request first and tell the
// guest to paste it.
export function InstagramButton({ request, className = "" }: { request: BookingRequest; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(bookingMessage(request));
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard blocked; still open Instagram.
    }
  }

  return (
    <div className={className}>
      <a
        href={instagramDmLink()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 rounded-lg border border-black px-5 py-3 font-semibold transition-colors hover:bg-black/5"
      >
        <Image src="/icons/instagram.svg" alt="" width={20} height={20} />
        Message on Instagram
      </a>
      <p aria-live="polite" className="mt-2 min-h-4 text-center text-xs text-muted">
        {copied ? "Booking details copied. Paste them into the DM." : ""}
      </p>
    </div>
  );
}
