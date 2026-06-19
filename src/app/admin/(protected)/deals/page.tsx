import type { Metadata } from "next";
import Link from "next/link";
import { getDealTiers } from "@/data/pallets";
import { DealTierForm } from "@/components/admin/DealTierForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Deal tiers" };

export default async function AdminDealsPage() {
  const tiers = await getDealTiers();
  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-500 hover:text-brand-700">← Back to products</Link>
      <h1 className="mb-1 mt-2 text-2xl font-extrabold tracking-tight text-ink-900">Deal tiers</h1>
      <p className="mb-6 text-sm text-ink-600">Set the minimum discount for each deal page.</p>
      <DealTierForm tiers={tiers.map((t) => ({ slug: t.slug, name: t.name, minDiscount: t.minDiscount }))} />
    </div>
  );
}
