"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = { article: string; label: string; image: string; href: string };

// Real catalog products (image + link). Buyer/time/location are sampled.
const PRODUCTS: Product[] = [
  { article: "a", label: "Cosmetics pallet", image: "/images/products/G51777-1.webp", href: "/pallets/assorted-cosmetics-90-off-original-retail-g51777" },
  { article: "an", label: "iPhone Cases pallet", image: "/images/products/G51322-1.webp", href: "/pallets/assorted-phone-cases-90-off-original-retail-g51322" },
  { article: "a", label: "Bedding pallet", image: "/images/products/G59754-1.webp", href: "/pallets/assorted-bedding-82-off-original-retail-g59754" },
  { article: "a", label: "Books pallet", image: "/images/products/G51326-1.webp", href: "/pallets/assorted-books-90-off-original-retail-g51326" },
  { article: "a", label: "Dish Towels pallet", image: "/images/products/G58497-1.webp", href: "/pallets/assorted-dish-towels-82-off-original-retail-g58497" },
  { article: "a", label: "Garden Products pallet", image: "/images/products/G51712-1.webp", href: "/pallets/assorted-garden-products-90-off-original-retail-g51712" },
  { article: "a", label: "Comforters pallet", image: "/images/products/G59757-1.webp", href: "/pallets/assorted-comforters-82-off-original-retail-g59757" },
  { article: "a", label: "Clothing pallet", image: "/images/products/ARP201-1.webp", href: "/pallets/assorted-clothing-82-off-original-retail-arp201" },
  { article: "a", label: "Candles pallet", image: "/images/products/G51337-1.webp", href: "/pallets/assorted-candles-90-off-original-retail-g51337" },
  { article: "a", label: "Picture Frames pallet", image: "/images/products/G51490-1.webp", href: "/pallets/4x4-picture-frames-90-off-original-retail-g51490" },
  { article: "a", label: "Floral Garlands pallet", image: "/images/products/G50763-1.webp", href: "/pallets/assorted-floral-garlands-82-off-original-retail-g50763" },
];

const NAMES = [
  "Marcus", "Aisha", "Daniel", "Priya", "Jordan", "Sofia", "Liam", "Maria", "Andre", "Chloe",
  "Devin", "Hannah", "Carlos", "Nina", "Tyler", "Grace", "Omar", "Bella", "Jared", "Elena",
  "Brandon", "Tasha", "Victor", "Rosa", "Kevin", "Mia", "Derek", "Lauren", "Mateo", "Jasmine",
];
const INITIALS = "ABCDEFGHJKLMNPRSTW".split("");
const ACTIONS = [
  "just ordered", "just bought", "just purchased", "just grabbed",
  "just reserved", "recently bought", "just paid for", "just secured",
];
const CITIES = [
  "Dallas, TX", "Atlanta, GA", "Houston, TX", "Chicago, IL", "Phoenix, AZ", "Miami, FL",
  "Charlotte, NC", "Columbus, OH", "Newark, NJ", "Detroit, MI", "Memphis, TN", "Tampa, FL",
  "Brooklyn, NY", "Las Vegas, NV", "San Antonio, TX", "Orlando, FL", "Nashville, TN", "Cleveland, OH",
];

type Note = { name: string; action: string; product: Product; time: string; city: string };

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

function timePhrase() {
  const r = Math.random();
  if (r < 0.12) return "just now";
  if (r < 0.24) return "about an hour ago";
  return `${2 + Math.floor(Math.random() * 44)} minutes ago`;
}

function makeNote(): Note {
  return {
    name: `${pick(NAMES)} ${pick(INITIALS)}.`,
    action: pick(ACTIONS),
    product: pick(PRODUCTS),
    time: timePhrase(),
    city: pick(CITIES),
  };
}

export function SocialProof() {
  const [note, setNote] = useState<Note | null>(null);
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const stop = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("lpd_sp_dismissed")) {
        setDismissed(true);
        return;
      }
    } catch {}

    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((res) => timers.push(window.setTimeout(res, ms)));

    (async () => {
      await wait(4500);
      while (!stop.current) {
        setNote(makeNote());
        setShown(true);
        await wait(6000);
        if (stop.current) break;
        setShown(false);
        await wait(11000);
      }
    })();

    return () => {
      stop.current = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  function close() {
    stop.current = true;
    try {
      sessionStorage.setItem("lpd_sp_dismissed", "1");
    } catch {}
    setShown(false);
    setDismissed(true);
  }

  if (dismissed || !note) return null;

  return (
    <div
      role="status"
      aria-live="off"
      className={`pointer-events-none fixed bottom-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs transition-all duration-500 ease-out motion-reduce:transition-opacity motion-reduce:translate-y-0 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="pointer-events-auto relative flex items-center gap-3 rounded-2xl bg-white p-2.5 pr-9 shadow-pop ring-1 ring-ink-100">
        <Link href={note.product.href} className="flex min-w-0 items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-100">
            <Image src={note.product.image} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-snug text-ink-700">
              <span className="font-semibold text-ink-900">{note.name}</span> {note.action} {note.product.article}{" "}
              <span className="font-semibold text-brand-700">{note.product.label}</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {note.time} · {note.city}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Dismiss notification"
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
