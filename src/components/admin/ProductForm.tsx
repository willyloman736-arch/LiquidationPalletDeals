"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveProduct, deleteProduct, type SaveState } from "@/app/admin/actions";
import { ImageUploader } from "./ImageUploader";

export type ProductFormValues = {
  handle: string;
  title: string;
  sku: string | null;
  categorySlug: string;
  condition: string;
  manifest: string;
  retailValueUsd: number;
  priceUsd: number;
  salePriceUsd: number | null;
  units: number;
  costPerUnitUsd: number;
  availability: string;
  featured: boolean;
  images: string[];
};

const CONDITIONS: [string, string][] = [
  ["mos", "Past Season Transfers"],
  ["first-quality", "First Quality"],
  ["new", "New"],
  ["shelf-pull", "Shelf Pull"],
  ["customer-return", "Customer Return"],
];
const MANIFESTS: [string, string][] = [
  ["unmanifested", "Unmanifested"],
  ["partially", "Partially manifested"],
  ["fully", "Fully manifested"],
];

const field = "mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-brand-600";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-ink-800">{children}</span>;
}

export function ProductForm({
  mode,
  initial,
  categories,
}: {
  mode: "create" | "edit";
  initial?: Partial<ProductFormValues>;
  categories: { slug: string; name: string }[];
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveProduct, {});
  const v = initial ?? {};

  return (
    <form action={action} className="card max-w-3xl space-y-5 p-6">
      <input type="hidden" name="mode" value={mode} />
      {mode === "edit" && <input type="hidden" name="handle" value={v.handle ?? ""} />}

      <label className="block">
        <Label>Title</Label>
        <input name="title" required defaultValue={v.title ?? ""} className={field} placeholder="Assorted Cosmetics: 92% Off Original Retail" />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Label>SKU</Label>
          <input name="sku" defaultValue={v.sku ?? ""} className={field} placeholder="G51777" />
        </label>
        <label className="block">
          <Label>Category</Label>
          <select name="category_slug" defaultValue={v.categorySlug ?? "general-merchandise"} className={field}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <Label>Condition / quality</Label>
          <select name="condition" defaultValue={v.condition ?? "mos"} className={field}>
            {CONDITIONS.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>Manifest</Label>
          <select name="manifest" defaultValue={v.manifest ?? "unmanifested"} className={field}>
            {MANIFESTS.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
          </select>
        </label>
        <label className="block">
          <Label>Estimated retail value (USD)</Label>
          <input name="retail_value_usd" type="number" step="0.01" min="0" required defaultValue={v.retailValueUsd ?? ""} className={field} />
        </label>
        <label className="block">
          <Label>Price (USD)</Label>
          <input name="price_usd" type="number" step="0.01" min="0" required defaultValue={v.priceUsd ?? ""} className={field} />
        </label>
        <label className="block">
          <Label>Sale price (USD) — optional discount</Label>
          <input name="sale_price_usd" type="number" step="0.01" min="0" defaultValue={v.salePriceUsd ?? ""} className={field} placeholder="Leave blank for no sale" />
        </label>
        <label className="block">
          <Label>Units</Label>
          <input name="units" type="number" step="1" min="1" defaultValue={v.units ?? 1} className={field} />
        </label>
        <label className="block">
          <Label>Cost per unit (USD) — optional</Label>
          <input name="cost_per_unit_usd" type="number" step="0.01" min="0" defaultValue={v.costPerUnitUsd ?? ""} className={field} placeholder="Auto-calculated if blank" />
        </label>
        <label className="block">
          <Label>Availability</Label>
          <select name="availability" defaultValue={v.availability ?? "in-stock"} className={field}>
            <option value="in-stock">In stock</option>
            <option value="out-of-stock">Out of stock</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="featured" defaultChecked={v.featured ?? false} className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-600" />
        <Label>Featured</Label>
      </label>

      <div>
        <Label>Photos</Label>
        <div className="mt-2">
          <ImageUploader initial={v.images ?? []} />
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{state.error}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <Link href="/admin" className="btn-secondary">Cancel</Link>
        {mode === "edit" && (
          <button
            type="submit"
            formAction={deleteProduct}
            formNoValidate
            onClick={(e) => {
              if (!confirm("Delete this product permanently? This can't be undone.")) e.preventDefault();
            }}
            className="ml-auto rounded-xl px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-50"
          >
            Delete product
          </button>
        )}
      </div>
    </form>
  );
}
