import Image from "next/image";

// Shows a photo, or a neutral grey tile (the Figma placeholder colour) while
// a listing is still missing that photo.
export function PhotoTile({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-tile ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-sm text-white/80">Photo coming soon</span>
      )}
    </div>
  );
}
