import Image from "next/image";
import { bookingMessage, whatsappLink } from "@/lib/contact";

// The orange "Book ↗" call to action from the Figma header. Opens WhatsApp
// with a generic booking message.
export function BookLink({ size = "lg" }: { size?: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <a
      href={whatsappLink(bookingMessage({}))}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center text-brand transition-colors hover:text-brand-dark ${
        lg ? "gap-[0.35em] text-[clamp(20px,2.2vw,32px)]" : "gap-2 text-xl"
      }`}
    >
      Book
      <Image
        src="/icons/arrow-up-right.svg"
        alt=""
        width={34}
        height={34}
        loading="eager"
        className={`transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
          lg ? "size-[0.7em]" : "size-5"
        }`}
      />
    </a>
  );
}
