"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const TAWK_SRC = "https://embed.tawk.to/6a37259116fcef1d436fc2ca/1jrjmlgg4";

/**
 * Loads the Tawk.to live-chat widget after hydration so it never blocks paint
 * or interactivity. Suppressed on /admin so it doesn't overlap dashboard UI.
 */
export function TawkChat() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <Script
      id="tawk-to"
      src={TAWK_SRC}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
