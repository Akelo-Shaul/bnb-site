// The public base URL of the site, used for social previews (metadataBase)
// and the listing link in booking messages.
//
// Order: NEXT_PUBLIC_SITE_URL → the production domain Vercel injects
// automatically → localhost. Empty values are skipped and a missing
// "https://" is added, so a blank or bare-domain env var can't break the build.
const FALLBACK = "http://localhost:3000";

export function siteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    } catch {
      // Not a usable URL; try the next candidate.
    }
  }
  return new URL(FALLBACK);
}

/** Base URL for links shared outside the site, or null when only localhost is known. */
export function publicSiteUrl(): string | null {
  const url = siteUrl();
  return url.hostname === "localhost" ? null : url.origin;
}
