import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPallet } from "@/data/pallets";
import { categories } from "@/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = await getPallet(handle);
  if (!p) return notFound();

  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-500 hover:text-brand-700">← Back to products</Link>
      <h1 className="mb-1 mt-2 text-2xl font-extrabold tracking-tight text-ink-900">Edit product</h1>
      <p className="mb-6 text-sm text-ink-500">{p.title}</p>
      <ProductForm
        mode="edit"
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        initial={{
          handle: p.handle,
          title: p.title,
          sku: p.sku,
          categorySlug: p.categorySlug,
          condition: p.condition,
          manifest: p.manifest,
          retailValueUsd: p.retailValueUsd,
          priceUsd: p.listPriceUsd,
          salePriceUsd: p.salePriceUsd,
          units: p.units,
          costPerUnitUsd: p.costPerUnitUsd,
          availability: p.availability,
          featured: p.featured,
          images: p.images,
        }}
      />
    </div>
  );
}
