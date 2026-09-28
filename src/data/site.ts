// Business-wide settings. Contact handles can be overridden per environment
// via NEXT_PUBLIC_* variables (see .env.example).
export const site = {
  name: "Shalom Gardens",
  tagline: "Short stays in Kisumu, booked directly with the host.",
  description:
    "Fully furnished apartments and homes in Kisumu. Browse our places and book directly on WhatsApp or Instagram.",
  // International format, digits only (no +, spaces or leading 0).
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254115089122",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "official_shaul_",
  // PLACEHOLDER: no TikTok on shaulakelo.com yet; replace with the real handle.
  tiktokHandle: process.env.NEXT_PUBLIC_TIKTOK_HANDLE ?? "shalomgardens",
  // Other profiles shown in the contact menu and footer (from shaulakelo.com).
  socials: [
    { label: "YouTube", hint: "Watch on YouTube", href: "https://www.youtube.com/@shaulakelo", icon: "/icons/youtube.svg" },
    { label: "LinkedIn", hint: "Connect on LinkedIn", href: "https://www.linkedin.com/in/shaul-akelo/", icon: "/icons/linkedin.svg" },
    { label: "X", hint: "Follow on X", href: "https://x.com/AkeloShaul21681", icon: "/icons/x.svg" },
  ],
  // "Crafted by" credit in the footer.
  credit: { name: "Shaul Akelo", href: "https://github.com/Akelo-Shaul", image: "/images/crafted-by.gif" },
  currency: "Ksh",
  host: {
    name: "Shalom",
    joined: "Hosting since 2021",
    avatar: null as string | null,
    about:
      "We manage a small collection of homes around Kisumu and look after every guest personally, from the first message to checkout.",
    responseRate: "100%",
    responseTime: "within an hour",
  },
} as const;
