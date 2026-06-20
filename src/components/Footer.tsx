import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { Newsletter } from "./Newsletter";

const infoLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shipping", label: "Shipping" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/faq", label: "FAQ" },
];

const paymentMethods = ["Wire Transfer", "Apple Pay", "Chime", "Zelle"];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-50">
      <div className="container py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-ink-600">{site.description}</p>
            <address className="mt-6 space-y-2 text-sm not-italic text-ink-700">
              <p className="flex items-start gap-2">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                <span>
                  {site.address.line1}, {site.address.city}, {site.address.state} {site.address.zip}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4 text-brand-700" />
                <span>{site.hours}</span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-brand-700" />
                <a href={`mailto:${site.email}`} className="hover:text-brand-700">
                  {site.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 shrink-0 text-brand-700" />
                <a href={`tel:+${site.whatsappNumber}`} className="hover:text-brand-700">
                  {site.phone}
                </a>
              </p>
            </address>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <a
                  href={site.social.facebook}
                  aria-label="Liquidation Pallet Deals on Facebook"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-600 hover:text-white"
                >
                  <Icon name="facebook" />
                </a>
                <a
                  href={site.social.tiktok}
                  aria-label="Liquidation Pallet Deals on TikTok"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-brand-600 hover:text-white"
                >
                  <Icon name="tiktok" />
                </a>
              </div>
              <Image
                src="/images/marketing/bbb-accredited.webp"
                alt="BBB Accredited Business"
                width={60}
                height={80}
                className="h-12 w-auto rounded-md bg-white p-1 ring-1 ring-ink-200"
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-ink-900">Shop</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-ink-700 hover:text-brand-700">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-ink-900">Additional Pages</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-700 hover:text-brand-700">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-sm font-semibold text-ink-900">Subscribe to our email list!</h2>
            <p className="mt-4 text-sm text-ink-600">
              Get alerts on new pallets and deeper discounts. New lots listed daily.
            </p>
            <Newsletter compact />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-ink-200 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {paymentMethods.map((p) => (
              <span
                key={p}
                className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-ink-700 ring-1 ring-ink-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
