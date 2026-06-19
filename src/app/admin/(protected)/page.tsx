import { allPallets } from "@/data/pallets";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ProductTable, type AdminRow } from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic"; // admin always reads fresh data

export default async function AdminDashboard() {
  const pallets = await allPallets();
  const rows: AdminRow[] = pallets.map((p) => ({
    handle: p.handle,
    sku: p.sku,
    title: p.title,
    categoryName: p.categoryName,
    listPriceUsd: p.listPriceUsd,
    priceUsd: p.priceUsd,
    retailValueUsd: p.retailValueUsd,
    discountPct: p.discountPct,
    onSale: p.onSale,
    availability: p.availability,
    units: p.units,
    image: p.images[0] ?? null,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-ink-600">{rows.length} products in the catalog.</p>
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Showing the built-in catalog — Supabase isn&rsquo;t connected in this environment yet. Once the
          database env vars are live, this reads from your database.
        </div>
      )}

      <div className="mb-5 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900 ring-1 ring-brand-100">
        Editing — add / edit / delete products, set discounts &amp; sale prices, manage the deal tiers, and
        upload photos — is being added next. This overview is live now.
      </div>

      <ProductTable products={rows} />
    </div>
  );
}
