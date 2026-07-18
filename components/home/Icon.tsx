import type { ReactNode } from "react";

export type IconName =
  | "home" | "pin" | "handshake" | "shield"
  | "sell" | "key" | "video" | "book";

const PATHS: Record<IconName, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  handshake: <path d="m8 12 2.5 2.5a2 2 0 0 0 2.8 0l4.2-4.2M3 8l3-3 5 4M21 8l-3-3-3 2" />,
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  sell: <path d="M3 9v11h18V9M3 9l2-5h14l2 5M3 9h18M12 9v11" />,
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8m-3-3 2-2m-4 0 2-2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
  book: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5ZM19 3v16" />,
};

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
