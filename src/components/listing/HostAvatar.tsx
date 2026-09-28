import Image from "next/image";
import { site } from "@/data/site";

// Host photo if configured, otherwise the host's initial on the brand colour.
export function HostAvatar({ size }: { size: "md" | "lg" }) {
  const px = size === "md" ? 56 : 64;
  const { avatar, name } = site.host;
  return (
    <div className="relative shrink-0" style={{ width: px, height: px }}>
      {avatar ? (
        <Image src={avatar} alt={name} fill sizes={`${px}px`} className="rounded-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center rounded-full bg-brand text-xl font-semibold text-white">
          {name[0]}
        </span>
      )}
    </div>
  );
}
