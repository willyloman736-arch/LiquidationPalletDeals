import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PalletGrid } from "@/components/PalletGrid";
import { allPallets, getDealTiers } from "@/data/pallets";
import { Icon } from "@/components/Icon";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "All deals",
  description: "Browse every live liquidation pallet across categories and discount tiers.",
};

export default async function DealsPage() {
  const pallets = (await allPallets()).sort(
    (a, b) => b.priceUsd / b.retailValueUsd - a.priceUsd / a.retailValueUsd
  );
  const dealTiers = await getDealTiers();

  return (
    <>
      <PageHeader
        eyebrow="Live inventory"
        title="All deals"
        description="Every available lot, sortable by discount and category. Pallets are first-come, first-served — no holds."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/deals", label: "All deals" },
        ]}
      />

      <section className="border-b border-ink-100 bg-white py-10">
        <div className="container">
          <div className="grid gap-3 md:grid-cols-3">
            {dealTiers.map((d) => (
              <Link
                key={d.slug}
                href={`/deals/${d.slug}`}
                className={`flex items-center justify-between rounded-2xl bg-gradient-to-br ${d.accent} p-5 text-white shadow-card transition hover:-translate-y-0.5`}
              >
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/80">{d.name}</p>
                  <p className="mt-1 text-2xl font-extrabold">{d.minDiscount}%+ off</p>
                </div>
                <Icon name="arrowRight" className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <PalletGrid pallets={pallets} />
        </div>
      </section>
    </>
  );
}
