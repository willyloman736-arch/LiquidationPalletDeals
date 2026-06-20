type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

const paths: Record<string, React.ReactNode> = {
  shirt: (
    <path d="M6 4l4-2 2 2 2-2 4 2 2 4-3 1v11H7V9L4 8l2-4z" />
  ),
  headphones: (
    <>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M4 14v3a2 2 0 0 0 2 2h1v-7H6a2 2 0 0 0-2 2zM20 14v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2z" />
    </>
  ),
  sofa: (
    <>
      <path d="M3 12a3 3 0 0 1 6 0v3h6v-3a3 3 0 0 1 6 0v6H3v-6z" />
      <path d="M6 18v2M18 18v2" />
    </>
  ),
  boxes: (
    <>
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M3 8v8l9 4 9-4V8" />
      <path d="M12 12v8" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5L12 3z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9h5v-6h4v6h5v-9" />
    </>
  ),
  shuffle: (
    <>
      <path d="M16 3h5v5" />
      <path d="M21 3l-7 7" />
      <path d="M16 21h5v-5" />
      <path d="M21 21l-7-7" />
      <path d="M3 4l4 4" />
      <path d="M3 20l18-16" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="M5 12l4 4 10-10" />,
  star: (
    <path d="M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.6L12 18l-5.9 3.1 1.2-6.6L2.5 9.9 9.1 9 12 3z" />
  ),
  truck: (
    <>
      <path d="M3 16V6h11v10" />
      <path d="M14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
    </>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  facebook: <path d="M14 8h3V5h-3a4 4 0 0 0-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9a1 1 0 0 1 1-1z" />,
  tiktok: (
    <path d="M14 4v9a3 3 0 1 1-3-3v3a6 6 0 1 0 6 6V9a6 6 0 0 0 4 1V7a4 4 0 0 1-4-3h-3z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.75 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  );
}
