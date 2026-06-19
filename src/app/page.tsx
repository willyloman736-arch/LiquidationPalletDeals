import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { CategoryGrid } from "@/components/CategoryGrid";
import { DealsBanner } from "@/components/DealsBanner";
import { PalletGrid } from "@/components/PalletGrid";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { allPallets, getPalletsByCategory, type PalletWithCategoryName } from "@/data/pallets";

const FEATURED_SKUS = ["G51235", "ARP201", "G51322", "G51326", "G58138", "G51490"];

export default async function HomePage() {
  const all = await allPallets();
  const featured = all.filter((p) => p.sku !== null && FEATURED_SKUS.includes(p.sku));
  const cosmetics = (await getPalletsByCategory("health-beauty")).slice(0, 2);

  return (
    <>
      <Hero />
      <ValueProps />

      {/* Value-proposition band */}
      <section className="bg-brand-700 py-12 text-white">
        <div className="container flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything 82% Off MSRP or More!
            </h2>
            <p className="mt-2 text-white/85">
              Famous &amp; specialty-store brand pallets, priced by the lot. New inventory received daily.
            </p>
          </div>
          <Link href="/deals" className="btn bg-white text-brand-800 hover:bg-ink-50">
            Shop the deals
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured collection: Assorted Cosmetics */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container">
          <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured collection</p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                Assorted cosmetics pallets.
              </h2>
            </div>
            <Link href="/health-beauty" className="link text-sm font-semibold">
              Shop all <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {cosmetics.map((p) => (
              <CosmeticsRow key={p.slug} pallet={p} />
            ))}
          </div>
          </Reveal>
        </div>
      </section>

      {/* Famous & Specialty Store Brand Pallets — warehouse photos */}
      <section className="border-b border-ink-100 bg-ink-900 py-14 text-white">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              Inside the warehouse
            </p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Famous &amp; specialty store brand pallets.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              33 years of B2B reverse-logistics experience behind every lot. We open, sort, and
              condition-grade inventory at our Beacon Falls, Connecticut facility, then list new pallets
              and truckloads daily.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/20"
            >
              Our story <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-pop ring-1 ring-white/10">
              <Image
                src="/images/marketing/hero-warehouse.webp"
                alt="Inside the Liquidation Pallet Deals warehouse in Beacon Falls, Connecticut"
                fill
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src="/images/marketing/pallets.webp"
                alt="Shrink-wrapped liquidation pallets staged for shipment"
                fill
                sizes="(min-width:1024px) 22vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src="/images/marketing/feature-inspection.webp"
                alt="Condition-grading and inspecting incoming branded merchandise"
                fill
                sizes="(min-width:1024px) 22vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">New arrivals</p>
                <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  Fresh lots, listed daily.
                </h2>
              </div>
              <Link href="/deals" className="link text-sm font-semibold">
                All new arrivals <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <PalletGrid pallets={featured} />
          </div>
        </div>
      </section>

      <DealsBanner />
      <CategoryGrid />

      {/* Location statement */}
      <section className="bg-white py-14">
        <div className="container">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-ink-50 ring-1 ring-ink-100 lg:grid-cols-2">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[320px]">
              <Image
                src="/images/marketing/facility.webp"
                alt="Liquidation Pallet Deals warehouse exterior in Beacon Falls, Connecticut"
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <Reveal className="p-8 sm:p-10">
              <p className="eyebrow">Operations</p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                All operations located in Beacon Falls, Connecticut.
              </h2>
              <p className="mt-4 text-ink-600">
                Warehousing, inspection, and shipping all live under one roof at 125 Railroad Ave. Pick up
                free from our dock, or get live LTL freight rates at checkout for delivery nationwide.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/shipping" className="btn-secondary">
                  Shipping &amp; pickup
                </Link>
                <Link href="/contact" className="btn-primary">
                  Contact us <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}

function CosmeticsRow({ pallet }: { pallet: PalletWithCategoryName }) {
  return (
    <Link
      href={`/pallets/${pallet.slug}`}
      className="group grid grid-cols-5 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="relative col-span-2 aspect-square bg-ink-50">
        <Image
          src={pallet.images[0]}
          alt={`${pallet.title} — assorted cosmetics liquidation pallet`}
          fill
          sizes="(min-width:640px) 25vw, 40vw"
          className="object-cover transition group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 badge bg-accent-500 text-brand-950">
          {pallet.discountPct}% off
        </span>
      </div>
      <div className="col-span-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {pallet.categoryName}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-ink-900 group-hover:text-brand-700">
          {pallet.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink-600">{pallet.blurb}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-ink-50 p-2">
            <p className="text-[10px] uppercase text-ink-500">Retail</p>
            <p className="text-sm font-bold text-ink-900">${Math.round(pallet.retailValueUsd).toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-brand-50 p-2">
            <p className="text-[10px] uppercase text-brand-700">Price</p>
            <p className="text-sm font-bold text-brand-700">${Math.round(pallet.priceUsd).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
