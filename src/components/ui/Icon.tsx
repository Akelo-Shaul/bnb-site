// Line icons used across the listing pages (24×24, stroke-based, inherit currentColor).
const paths = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9" />,
  sparkle: (
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z" />
  ),
  door: <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M14 12h.01" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  wifi: <path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01" />,
  kitchen: <path d="M6 3h12v18H6zM6 10h12M9 6v1M9 13v3" />,
  parking: <path d="M4 4h16v16H4zM10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />,
  tv: <path d="M3 6h18v11H3zM8 21h8M12 17v4" />,
  washer: <path d="M4 3h16v18H4zM4 7h16M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  ac: <path d="M3 5h18v7H3zM7 16c0 2-2 2-2 4M12 16v4M17 16c0 2 2 2 2 4" />,
  fridge: <path d="M6 3h12v18H6zM6 10h12M9 6v2M9 13v3" />,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  camera: <path d="M3 7h13v10H3zM16 10l5-3v10l-5-3" />,
  leaf: <path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15zM5 19l8-8" />,
  water: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6z" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
  key: <path d="M14 10a4 4 0 1 0-3.5 4L4 20.5V21h3v-2h2v-2h2l1.5-1.5A4 4 0 0 0 14 10zM16 8h.01" />,
  noSmoking: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8M7 12h7M16 12h1" />,
  paw: (
    <path d="M12 20c-3 0-5-1.5-5-3.5S9.5 12 12 12s5 2.5 5 4.5-2 3.5-5 3.5zM6 11a1.5 2 0 1 0 0-.01M18 11a1.5 2 0 1 0 0-.01M9 7a1.5 2 0 1 0 0-.01M15 7a1.5 2 0 1 0 0-.01" />
  ),
  party: <path d="M4 20 9 7l8 8zM14 4v2M18 6l-1.5 1.5M20 10h-2" />,
  alarm: <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 13h.01M4 4l3 2M20 4l-3 2" />,
  card: <path d="M3 6h18v12H3zM3 10h18M7 15h3" />,
  bed: <path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M7 11.5h.01" />,
  pin: <path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12zM12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  share: <path d="M12 3v12M7 8l5-5 5 5M5 13v7h14v-7" />,
  heart: <path d="M12 20s-8-4.5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20z" />,
  grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5 9-10" />,
  badge: <path d="M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 14 7 21l5-3 5 3-1.5-7" />,
  star: (
    <path
      d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
      fill="currentColor"
    />
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-6",
  strokeWidth = 1.5,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
