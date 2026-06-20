"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { useCart } from "@/components/cart/CartProvider";

const utilityLinks = [{ href: "/deals", label: "All Deals" }];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur transition-shadow duration-300 supports-[backdrop-filter]:bg-white/75 ${
        elevated ? "header-elevated" : ""
      }`}
    >
      {/* Announcement bar — free shipping promo */}
      <div className="bg-brand-700 text-white">
        <div className="container flex h-9 items-center justify-center gap-2 overflow-hidden text-center text-xs font-medium">
          <Icon name="truck" className="h-4 w-4 shrink-0 text-accent-300" />
          <span>
            Free shipping on orders over <span className="font-bold">$650</span>
          </span>
        </div>
      </div>

      {/* Utility strip */}
      <div className="bg-ink-900 text-ink-100">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">All operations in Jacksonville, Florida</span>
            <span className="sm:hidden">Jacksonville, FL</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Mon–Fri 7:00am–3:30pm ET</span>
            <span>English / Español</span>
          </div>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="hidden max-w-md flex-1 md:block">
          <label className="relative block">
            <span className="sr-only">Search pallets</span>
            <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              placeholder="Search pallets, brands, or categories"
              className="w-full rounded-xl border-0 bg-ink-50 py-2.5 pl-9 pr-4 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:bg-white focus:ring-2 focus:ring-brand-600"
            />
          </label>
        </div>

        <div className="flex items-center gap-1">
          <Link href="/deals" className="btn-primary hidden sm:inline-flex">
            <Icon name="bolt" className="h-4 w-4" />
            <span>Shop deals</span>
          </Link>
          <CartButton />
          <button
            type="button"
            className="btn-ghost lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-ink-100 lg:block" aria-label="Primary">
        <div className="container">
          <ul className="flex items-center gap-1">
            {utilityLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center px-3 py-3 text-sm font-semibold text-ink-700 hover:text-brand-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {categories
              .filter((c) => c.slug !== "mixed-pallets")
              .map((c) => (
                <li
                  key={c.slug}
                  className="relative"
                  onMouseEnter={() => setOpen(c.slug)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <Link
                    href={`/${c.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-3 text-sm font-semibold text-ink-700 hover:text-brand-700"
                  >
                    {c.name}
                    {c.subcategories.length > 0 && (
                      <Icon name="chevronDown" className="h-4 w-4 text-ink-500" />
                    )}
                  </Link>
                  {open === c.slug && c.subcategories.length > 0 && (
                    <div className="absolute left-0 top-full z-50 w-64 animate-fade-in pt-2">
                      <div className="rounded-2xl bg-white p-3 shadow-card ring-1 ring-ink-100">
                        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink-500">
                          {c.name}
                        </p>
                        <ul className="space-y-0.5">
                          {c.subcategories.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={s.slug === "all" ? `/${c.slug}` : `/${c.slug}#${s.slug}`}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-800 hover:bg-ink-50 hover:text-brand-700"
                              >
                                {s.name}
                                <Icon name="chevronRight" className="h-4 w-4 text-ink-400" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            <li>
              <Link
                href="/mixed-pallets"
                className="inline-flex items-center px-3 py-3 text-sm font-semibold text-ink-700 hover:text-brand-700"
              >
                Mixed Pallets
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container py-4">
            <label className="relative mb-3 block">
              <span className="sr-only">Search pallets</span>
              <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              <input
                type="search"
                placeholder="Search pallets, brands, or categories"
                className="w-full rounded-xl border-0 bg-ink-50 py-2.5 pl-9 pr-4 text-sm text-ink-900 ring-1 ring-inset ring-ink-200"
              />
            </label>
            <ul className="space-y-1">
              {utilityLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {categories
                .filter((c) => c.slug !== "mixed-pallets")
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/${c.slug}`}
                      className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/mixed-pallets"
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Mixed Pallets
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

function CartButton() {
  const { count, ready } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={ready && count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="relative grid h-10 w-10 place-items-center rounded-lg text-ink-700 hover:bg-ink-50 hover:text-brand-700"
    >
      <Icon name="cart" className="h-5 w-5" />
      {ready && count > 0 && (
        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold leading-none text-brand-950">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
