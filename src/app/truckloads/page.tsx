import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getTruckloads } from "@/data/pallets";
import { PageHeader } from "@/components/PageHeader";
import { PalletGrid } from "@/components/PalletGrid";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Truckloads",
  description:
    "Full-truckload (FTL) liquidation by the trailer — the lowest cost per unit we offer. Apparel, general merchandise, and more, priced by quote.",
};

const highlights = [
  "Lowest cost per unit we offer",
  "Single-category or mixed FTL",
  "Live LTL/FTL freight nationwide",
  "Dock or liftgate delivery",
];

export default async function TruckloadsPage() {
  const loads = await getTruckloads();
  const wa = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'd like a truckload (FTL) quote. Categories I'm interested in: "
  )}`;

  return (
    <>
      <PageHeader
        eyebrow="Bulk"
        title="Truckloads"
        description="Full-truckload (FTL) liquidation by the trailer — the lowest cost per unit we offer. Priced by quote."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/truckloads", label: "Truckloads" },
        ]}
      />
      <section className="border-b border-ink-100 bg-white py-12">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-ink-100">
            <Image
              src="/images/marketing/aerial-yard.webp"
              alt="Truckload liquidation loading at the Jacksonville facility"
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Request a truckload quote
            </h2>
            <p className="mt-3 text-ink-600">
              Truckloads are priced by quote based on category, condition, and destination. Tell us what
              you&rsquo;re after and we&rsquo;ll send pricing and live freight.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-ink-700">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-700" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Request a quote <Icon name="arrowRight" className="h-4 w-4" />
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
      {loads.length > 0 && (
        <section className="py-12">
          <div className="container">
            <h2 className="mb-6 text-xl font-bold text-ink-900">Available truckloads</h2>
            <PalletGrid pallets={loads} />
          </div>
        </section>
      )}
    </>
  );
}
