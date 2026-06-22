"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/**
 * Floating WhatsApp contact button. Sits in the bottom-right corner
 * just above the Tawk live-chat bubble so users can pick either channel.
 * Suppressed on /admin to keep the dashboard uncluttered.
 */
export function WhatsAppButton() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <a
      href={`https://wa.me/${site.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${site.phone}`}
      className="group fixed bottom-[96px] right-[20px] z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-pop ring-2 ring-white/40 transition hover:scale-105 hover:bg-[#1ebe5d] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-7 w-7"
      >
        {/* Generic outlined chat-bubble glyph — recognizable as "message us" */}
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}
