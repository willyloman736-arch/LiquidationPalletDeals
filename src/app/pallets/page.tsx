import type { Metadata } from "next";
import Link from "next/link";
import { allPallets } from "@/data/pallets";
import { categories } from "@/data/categories";
import { PageHeader } from "@/components/PageHeader";
import { PalletGrid } from "@/components/PalletGrid";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Shop all pallets",
  description:
    "Every available liquidation pallet — famous & specialty-store brands, sold by the pallet, 100% inspected. New lots listed daily.",
};

export default async function PalletsPage() {
  const pallets = await allPallets();
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="All pallets"
        description="Every available lot, sold by the pallet. New inventory listed daily — first come, first served."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/pallets", label: "Pallets" },
        ]}
      />
      <section className="border-b border-ink-100 bg-white py-10">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-700">Shop by category:</span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-100 hover:text-brand-700"
              >
                {c.name}
              </Link>
            ))}
          </div>
          <p className="mb-6 text-sm text-ink-600">
            Showing <span className="font-semibold text-ink-900">{pallets.length}</span> available lots
          </p>
          <PalletGrid pallets={pallets} />
        </div>
      </section>
    </>
  );
}
