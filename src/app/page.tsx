import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { CategoryGrid } from "@/components/CategoryGrid";
import { PalletGrid } from "@/components/PalletGrid";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { allPallets, getPalletsByCategory, type PalletWithCategoryName } from "@/data/pallets";
import { featuredReviews } from "@/data/reviews";
import { ReviewCard } from "@/components/ReviewCard";
import { site } from "@/lib/site";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

const FEATURED_SKUS = ["G51235", "ARP201", "G51322", "G51326", "G58138", "G51490"];

const BANNERS = [
  {
    eyebrow: "Sold by the pallet",
    title: "Famous-brand pallets, condition-graded",
    body: "Apparel, electronics, beauty, houseware and more — condition-graded before they ship from Jacksonville, FL.",
    href: "/pallets",
    cta: "Shop all pallets",
    image: "/images/marketing/hero-warehouse.webp",
  },
  {
    eyebrow: "Priced by the piece",
    title: "Bulk lots with clear cost-per-unit",
    body: "Multi-unit lots — hundreds to thousands of pieces — with transparent per-unit economics for resellers.",
    href: "/lots",
    cta: "Shop lots",
    image: "/images/marketing/pallets.webp",
  },
  {
    eyebrow: "By the trailer",
    title: "Truckload quotes, nationwide freight",
    body: "The lowest cost per unit we offer. Single-category or mixed FTL, quoted to your destination.",
    href: "/truckloads",
    cta: "Request a quote",
    image: "/images/marketing/aerial-yard.webp",
  },
];

const SHOP_TYPES = [
  { href: "/pallets", title: "Pallets", body: "Sold by the pallet, condition-graded.", image: "/images/marketing/hero-warehouse.webp", icon: "boxes" },
  { href: "/lots", title: "Lots", body: "Bulk lots priced by the piece.", image: "/images/marketing/pallets.webp", icon: "shuffle" },
  { href: "/truckloads", title: "Truckloads", body: "FTL by the trailer — by quote.", image: "/images/marketing/aerial-yard.webp", icon: "truck" },
];

const DEEP_DIVES = [
  { slug: "health-beauty", name: "Health & Beauty", blurb: "Prestige & mass-market cosmetics at 90%+ off original retail." },
  { slug: "apparel", name: "Apparel", blurb: "Brand-name clothing, footwear, and accessories by the lot." },
  { slug: "houseware", name: "Houseware", blurb: "Décor, bedding, kitchenware — everyday-turn inventory." },
];

export default async function HomePage() {
  const all = await allPallets();
  const featured = all.filter((p) => p.sku !== null && FEATURED_SKUS.includes(p.sku));
  const dives = await Promise.all(
    DEEP_DIVES.map(async (d) => ({ ...d, items: (await getPalletsByCategory(d.slug)).slice(0, 4) }))
  );

  return (
    <>
      <Hero />

      {BANNERS.map((b) => (
        <BannerBand key={b.href} {...b} />
      ))}

      <ValueProps />

      {/* Featured loads */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Fresh inventory</p>
                <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  Featured loads this week.
                </h2>
              </div>
              <Link href="/pallets" className="link text-sm font-semibold">
                Shop all pallets <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10">
            <PalletGrid pallets={featured} />
          </div>
        </div>
      </section>

      {/* Shop by type */}
      <section className="bg-white pt-14">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Shop by type</p>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Pallets, lots, or truckloads.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {SHOP_TYPES.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-pop"
                >
                  <div className="relative aspect-[16/10] bg-ink-100">
                    <Image src={t.image} alt="" fill sizes="(min-width:640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-transparent" aria-hidden="true" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 backdrop-blur">
                          <Icon name={t.icon} className="h-4 w-4" />
                        </span>
                        <h3 className="text-lg font-bold">{t.title}</h3>
                        <Icon name="arrowRight" className="ml-auto h-5 w-5 text-white/70 transition group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                      <p className="mt-2 text-sm text-white/85">{t.body}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CategoryGrid />

      {dives.map((d, i) => (
        <DeepDive key={d.slug} dive={d} reverse={i % 2 === 1} />
      ))}

      {/* Customer reviews */}
      <section className="border-b border-ink-100 bg-ink-50 py-14">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Customer reviews</p>
                <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  Resellers who&rsquo;ve bought from us.
                </h2>
              </div>
              <Link href="/reviews" className="link text-sm font-semibold">
                Read all reviews <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredReviews.map((r) => (
                <ReviewCard key={r.name + r.title} review={r} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote CTA */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        <Image src="/images/marketing/facility.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="container relative py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">Talk to a buyer</p>
          <h2 className="mx-auto mt-2 max-w-2xl text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Open a quote, anywhere.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Message us your categories and destination — we&rsquo;ll send pricing, live freight, and payment
            options. Free dock pickup in Jacksonville, FL.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-accent">
              Message us on WhatsApp <Icon name="arrowRight" className="h-4 w-4" />
            </a>
            <Link href="/contact" className="btn bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BannerBand({
  eyebrow, title, body, href, cta, image,
}: {
  eyebrow: string; title: string; body: string; href: string; cta: string; image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-ink-100">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/70 to-ink-900/30" aria-hidden="true" />
      <div className="container relative py-16 lg:py-20">
        <Reveal className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">{eyebrow}</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-white/85">{body}</p>
          <Link href={href} className="btn-accent mt-6">
            {cta} <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function DeepDive({
  dive, reverse,
}: {
  dive: { slug: string; name: string; blurb: string; items: PalletWithCategoryName[] };
  reverse: boolean;
}) {
  if (dive.items.length === 0) return null;
  return (
    <section className="border-b border-ink-100 bg-white py-14">
      <div className="container">
        <Reveal>
          <div className="grid items-stretch gap-8 lg:grid-cols-12">
            <div className={`lg:col-span-4 ${reverse ? "lg:order-last" : ""}`}>
              <div className="relative h-64 overflow-hidden rounded-2xl ring-1 ring-ink-100 lg:h-full">
                <Image
                  src={`/images/categories/${dive.slug}.webp`}
                  alt={`${dive.name} liquidation`}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h2 className="text-2xl font-bold text-white">{dive.name}</h2>
                  <p className="mt-1 text-sm text-white/85">{dive.blurb}</p>
                  <Link href={`/${dive.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-300 hover:text-white">
                    Shop {dive.name} <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {dive.items.map((p) => (
                <MiniProduct key={p.slug} p={p} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MiniProduct({ p }: { p: PalletWithCategoryName }) {
  const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
  return (
    <Link
      href={`/pallets/${p.slug}`}
      className="group flex gap-4 rounded-2xl bg-white p-3 shadow-card ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-50">
        <Image src={p.images[0]} alt="" fill sizes="96px" className="object-cover transition group-hover:scale-105" />
        {p.discountPct > 0 && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-brand-950">
            {p.discountPct}%
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">{p.categoryName}</p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-ink-900 group-hover:text-brand-700">{p.title}</h3>
        <div className="mt-auto pt-2">
          <span className="text-sm font-bold text-brand-700">{usd(p.priceUsd)}</span>
          {p.units > 1 && <span className="ml-1 text-xs text-ink-500">· {p.units.toLocaleString("en-US")} units</span>}
        </div>
      </div>
    </Link>
  );
}
