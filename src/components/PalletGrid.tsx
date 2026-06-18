import type { PalletWithCategoryName } from "@/data/pallets";
import { PalletCard } from "./PalletCard";

export function PalletGrid({ pallets }: { pallets: PalletWithCategoryName[] }) {
  if (pallets.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-card ring-1 ring-ink-100">
        <p className="text-base font-semibold text-ink-900">No lots in this view yet.</p>
        <p className="mt-1 text-sm text-ink-600">
          New pallets are listed weekly. Join the newsletter to be notified.
        </p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pallets.map((p) => (
        <PalletCard key={p.slug} pallet={p} />
      ))}
    </div>
  );
}
