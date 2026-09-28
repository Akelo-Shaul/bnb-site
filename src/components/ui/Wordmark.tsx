import Link from "next/link";
import { site } from "@/data/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display font-bold uppercase leading-none tracking-[0.02em] whitespace-nowrap ${className}`}
    >
      {site.name}
    </Link>
  );
}
