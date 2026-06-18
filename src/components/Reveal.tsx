"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals its children with a subtle fade + rise when scrolled into view.
 * The hidden state is gated by the `.js` class + a no-reduced-motion media
 * query (see globals.css), so it degrades to plain visible content for
 * no-JS users and anyone who prefers reduced motion. Transform/opacity only
 * — no layout shift.
 *
 * Triggers: IntersectionObserver (primary) + an immediate in-view check + a
 * passive scroll/resize fallback. A final timer guarantees content is never
 * left hidden even if the viewport can't be measured or the observer never
 * fires in an unusual environment.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    let io: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout>;

    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
      cleanup();
    };

    function check() {
      if (done || !el) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      // Reveal when in view, or when the viewport can't be measured.
      if (vh === 0 || (r.top < vh * 0.92 && r.bottom > 0)) reveal();
    }

    function cleanup() {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      io?.disconnect();
      clearTimeout(timer);
    }

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    }

    check(); // already in view at mount
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    // Fail-safe: never leave content hidden if nothing else fired.
    timer = setTimeout(reveal, 2200);
    return cleanup;
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
