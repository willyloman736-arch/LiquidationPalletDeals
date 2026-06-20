import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPallet,
  allPallets,
  conditionLabel,
  manifestLabel,
  conditionDescription,
  manifestDescription,
} from "@/data/pallets";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { PalletGrid } from "@/components/PalletGrid";
import { Icon } from "@/components/Icon";
import { BuyBox } from "@/components/BuyBox";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export async function generateStaticParams() {
  return (await allPallets()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPallet(slug);
  if (!p) return { title: "Pallet not found" };
  return {
    title: p.title,
    description: p.blurb,
    openGraph: { images: [p.images[0]] },
  };
}

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function PalletPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pallet = await getPallet(slug);
  if (!pallet) return notFound();

  const related = (await allPallets())
    .filter((p) => p.categorySlug === pallet.categorySlug && p.slug !== pallet.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pallet.title,
    sku: pallet.sku ?? undefined,
    category: pallet.categoryName,
    image: pallet.images.map((i) => `${site.url}${i}`),
    description: pallet.blurb,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: pallet.priceUsd.toFixed(2),
      availability:
        pallet.availability === "in-stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.legalName },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow={pallet.categoryName}
        title={pallet.title}
        description={pallet.blurb}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: `/${pallet.categorySlug}`, label: pallet.categoryName },
          { href: `/pallets/${pallet.slug}`, label: pallet.sku ?? "Item" },
        ]}
      />

      <section className="border-b border-ink-100 bg-white py-12">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-50 ring-1 ring-ink-100">
                <Image
                  src={pallet.images[0]}
                  alt={`${pallet.title} — full lot photo`}
                  fill
                  priority
                  sizes="(min-width:1024px) 56vw, 100vw"
                  className="object-cover"
                />
                {pallet.availability === "out-of-stock" ? (
                  <span className="absolute left-4 top-4 badge bg-ink-900/85 text-white backdrop-blur">
                    Out of stock
                  </span>
                ) : pallet.discountPct > 0 ? (
                  <span className="absolute left-4 top-4 badge bg-accent-500 text-brand-950">
                    {pallet.discountPct}% off original retail
                  </span>
                ) : null}
              </div>

              {pallet.images.length > 1 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {pallet.images.slice(1).map((img, i) => (
                    <div
                      key={img}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100"
                    >
                      <Image
                        src={img}
                        alt={`${pallet.title} — additional view ${i + 2}`}
                        fill
                        sizes="(min-width:640px) 18vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10">
                <h2 className="text-lg font-bold text-ink-900">Lot details</h2>
                <ul className="mt-4 space-y-2 text-sm text-ink-700">
                  {pallet.details.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Icon name="check" className="mt-0.5 h-4 w-4 text-brand-700" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`mt-10 grid gap-6 ${pallet.isLot ? "sm:grid-cols-2" : ""}`}>
                {pallet.isLot && (
                  <div className="card p-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">Manifest</h3>
                    <p className="mt-1 text-sm font-semibold text-ink-900">{manifestLabel[pallet.manifest]}</p>
                    <p className="mt-2 text-sm text-ink-700">{manifestDescription[pallet.manifest]}</p>
                  </div>
                )}
                <div className="card p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">Quality</h3>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{conditionLabel[pallet.condition]}</p>
                  <p className="mt-2 text-sm text-ink-700">{conditionDescription[pallet.condition]}</p>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 card p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    {pallet.isLot ? "Total lot price" : "Price"}
                  </p>
                  {pallet.sku && (
                    <span className="badge bg-brand-50 text-brand-700">SKU {pallet.sku}</span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <p className="text-4xl font-extrabold text-brand-700">{usd(pallet.priceUsd)}</p>
                  {pallet.discountPct > 0 && (
                    <p className="text-sm text-ink-500 line-through">{usd(pallet.retailValueUsd)}</p>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {pallet.isLot
                    ? `$${pallet.costPerUnitUsd.toFixed(2)} per unit · ${pallet.units.toLocaleString("en-US")} units`
                    : conditionLabel[pallet.condition]}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  {pallet.discountPct > 0 && (
                    <Stat label="Est. retail value" value={usd(pallet.retailValueUsd)} />
                  )}
                  {pallet.isLot ? (
                    <>
                      <Stat label="Units" value={pallet.units.toLocaleString("en-US")} />
                      <Stat label="Cost / unit" value={`$${pallet.costPerUnitUsd.toFixed(2)}`} />
                    </>
                  ) : (
                    <>
                      <Stat label="Quality" value={conditionLabel[pallet.condition]} />
                      <Stat
                        label="Availability"
                        value={pallet.availability === "in-stock" ? "In stock" : "Out of stock"}
                      />
                    </>
                  )}
                  <Stat label="Ships from" value={pallet.shipsFrom} />
                </dl>

                <BuyBox
                  item={{
                    handle: pallet.handle,
                    title: pallet.title,
                    sku: pallet.sku,
                    image: pallet.images[0],
                    priceUsd: pallet.priceUsd,
                  }}
                  soldOut={pallet.availability === "out-of-stock"}
                />

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink-100 pt-5 text-center text-xs text-ink-600">
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="shield" className="h-4 w-4 text-brand-700" />
                    100% inspected
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="truck" className="h-4 w-4 text-brand-700" />
                    Live LTL rates
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="info" className="h-4 w-4 text-brand-700" />
                    All sales final
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {pallet.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink-50 px-3 py-1 text-xs font-semibold text-ink-700 ring-1 ring-ink-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-ink-50 py-14">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                More in {pallet.categoryName}
              </h2>
              <Link href={`/${pallet.categorySlug}`} className="link text-sm font-semibold">
                See all <Icon name="arrowRight" className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-8">
              <PalletGrid pallets={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ink-50 p-3 ring-1 ring-ink-100">
      <dt className="text-[10px] uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-ink-900">{value}</dd>
    </div>
  );
}
