import type { ReactNode } from "react";

export type IconName =
  | "arrow"
  | "book"
  | "bot"
  | "briefcase"
  | "building"
  | "calculator"
  | "chart"
  | "check"
  | "chevron"
  | "close"
  | "document"
  | "home"
  | "menu"
  | "piggy"
  | "plus"
  | "send"
  | "shield"
  | "spark"
  | "wallet"
  | "users"
  | "globe"
  | "logout"
  | "grid"
  | "trend"
  | "eye"
  | "settings"
  | "back"
  | "bold"
  | "italic"
  | "strikethrough"
  | "heading-2"
  | "heading-3"
  | "list-bulleted"
  | "list-numbered"
  | "align-left"
  | "align-center"
  | "align-right"
  | "align-justify"
  | "link"
  | "image";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
      </>
    ),
    bot: (
      <>
        <rect x="4" y="7" width="16" height="13" rx="4" />
        <path d="M9 12h.01M15 12h.01M9 16h6M12 3v4" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V8l8-5 8 5v13M8 21v-4h8v4M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
      </>
    ),
    calculator: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="3" />
        <path d="M8 6h8v4H8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    chevron: (
      <>
        <path d="m9 18 6-6-6-6" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    document: (
      <>
        <path d="M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    piggy: (
      <>
        <path d="M5 11a7 7 0 0 1 13-2h3v5h-2a7 7 0 0 1-3 4v3h-3v-2H9v2H6v-4a7 7 0 0 1-2-3H2v-3h3zM14 9h.01" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4zM22 2 11 13" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </>
    ),
    logout: (
      <>
        <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    back: (
      <>
        <path d="M19 12H5M11 6l-6 6 6 6" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 5h14a2 2 0 0 1 2 2v13H4a2 2 0 0 1-2-2V5a3 3 0 0 1 3-3h11" />
        <path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5z" />
      </>
    ),
    bold: (
      <text
        x="6"
        y="18"
        fill="currentColor"
        stroke="none"
        fontFamily="Arial, sans-serif"
        fontSize="17"
        fontWeight="800"
      >
        B
      </text>
    ),
    italic: (
      <text
        x="8"
        y="18"
        fill="currentColor"
        stroke="none"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontStyle="italic"
        fontWeight="700"
      >
        I
      </text>
    ),
    strikethrough: (
      <>
        <text
          x="6"
          y="18"
          fill="currentColor"
          stroke="none"
          fontFamily="Arial, sans-serif"
          fontSize="17"
          fontWeight="700"
        >
          S
        </text>
        <path d="M4 12h16" />
      </>
    ),
    "heading-2": (
      <text
        x="3"
        y="17"
        fill="currentColor"
        stroke="none"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
      >
        H2
      </text>
    ),
    "heading-3": (
      <text
        x="3"
        y="17"
        fill="currentColor"
        stroke="none"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fontWeight="800"
      >
        H3
      </text>
    ),
    "list-bulleted": (
      <>
        <circle cx="5" cy="6" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="5" cy="18" r="1" fill="currentColor" stroke="none" />
        <path d="M9 6h11M9 12h11M9 18h11" />
      </>
    ),
    "list-numbered": (
      <>
        <text x="2.5" y="8" fill="currentColor" stroke="none" fontSize="6" fontWeight="700">1</text>
        <text x="2.5" y="14" fill="currentColor" stroke="none" fontSize="6" fontWeight="700">2</text>
        <text x="2.5" y="20" fill="currentColor" stroke="none" fontSize="6" fontWeight="700">3</text>
        <path d="M9 6h11M9 12h11M9 18h11" />
      </>
    ),
    "align-left": (
      <>
        <path d="M4 5h16M4 9h11M4 13h16M4 17h11M4 21h16" />
      </>
    ),
    "align-center": (
      <>
        <path d="M4 5h16M7 9h10M4 13h16M7 17h10M4 21h16" />
      </>
    ),
    "align-right": (
      <>
        <path d="M4 5h16M9 9h11M4 13h16M9 17h11M4 21h16" />
      </>
    ),
    "align-justify": (
      <>
        <path d="M4 5h16M4 9h16M4 13h16M4 17h16M4 21h16" />
      </>
    ),
    link: (
      <>
        <path d="m10 13.5 4-4M7.5 15.5l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16.5 8.5l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 15-5-5L5 20" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
