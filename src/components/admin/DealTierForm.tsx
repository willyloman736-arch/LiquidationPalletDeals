"use client";

import { useActionState } from "react";
import { updateDealTiers, type TierState } from "@/app/admin/actions";

export function DealTierForm({ tiers }: { tiers: { slug: string; name: string; minDiscount: number }[] }) {
  const [state, action, pending] = useActionState<TierState, FormData>(updateDealTiers, {});
  return (
    <form action={action} className="card max-w-md space-y-4 p-6">
      {tiers.map((t) => (
        <label key={t.slug} className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-ink-800">{t.name}</span>
          <span className="inline-flex items-center gap-1.5">
            <input
              name={`min_${t.slug}`}
              type="number"
              min={1}
              max={99}
              defaultValue={t.minDiscount}
              className="w-20 rounded-xl border-0 bg-white px-3 py-2 text-right text-sm text-ink-900 ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-brand-600"
            />
            <span className="text-sm text-ink-500">% off+</span>
          </span>
        </label>
      ))}

      {state.ok && <p className="text-sm font-medium text-emerald-700">Saved — the deal pages now use these thresholds.</p>}
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Saving…" : "Save thresholds"}
      </button>
      <p className="text-xs text-ink-500">
        Each tier shows products discounted at least this much off retail. Changing a threshold updates the
        matching /deals page.
      </p>
    </form>
  );
}
