"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Full-bleed hero background: a muted, looping video. Falls back to a still
 *  poster frame for visitors who prefer reduced motion. */
export function HeroVideo() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {reduced ? (
        <Image
          src="/images/marketing/hero-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/marketing/hero-poster.webp"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
