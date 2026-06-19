import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin" className="text-sm text-ink-500 hover:text-brand-700">← Back to products</Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold tracking-tight text-ink-900">Add product</h1>
      <ProductForm mode="create" categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  );
}
