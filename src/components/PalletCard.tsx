import Link from "next/link";
import Image from "next/image";
import { conditionLabel, manifestLabel, type PalletWithCategoryName } from "@/data/pallets";
import { Icon } from "./Icon";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function PalletCard({ pallet }: { pallet: PalletWithCategoryName }) {
  const soldOut = pallet.availability === "out-of-stock";
  return (
    <Link
      href={`/pallets/${pallet.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-pop"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
        <Image
          src={pallet.images[0]}
          alt={`${pallet.title} — ${pallet.categoryName}${pallet.isLot ? ` liquidation pallet, ${pallet.units.toLocaleString("en-US")} units` : ""}`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 badge bg-white/90 text-ink-900 backdrop-blur">
          {pallet.categoryName}
        </span>
        {soldOut ? (
          <span className="absolute right-3 top-3 badge bg-ink-900/85 text-white backdrop-blur">
            Out of stock
          </span>
        ) : pallet.discountPct > 0 ? (
          <span className="absolute right-3 top-3 badge bg-accent-500 text-brand-950">
            {pallet.discountPct}% off
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          {pallet.isLot ? `${manifestLabel[pallet.manifest]} · ${conditionLabel[pallet.condition]}` : conditionLabel[pallet.condition]}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold text-ink-900 group-hover:text-brand-700">
          {pallet.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-600">{pallet.blurb}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 text-center">
          {pallet.discountPct > 0 ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-500">Retail</p>
              <p className="text-sm font-bold text-ink-900">{fmt(pallet.retailValueUsd)}</p>
            </div>
          ) : pallet.isLot ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-500">Per unit</p>
              <p className="text-sm font-bold text-ink-900">${pallet.costPerUnitUsd.toFixed(2)}</p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-500">Condition</p>
              <p className="text-sm font-bold text-ink-900">{conditionLabel[pallet.condition]}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-500">Price</p>
            <p className="text-sm font-bold text-brand-700">{fmt(pallet.priceUsd)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-500">{pallet.isLot ? "Units" : "Qty"}</p>
            <p className="text-sm font-bold text-ink-900">{pallet.units.toLocaleString("en-US")}</p>
          </div>
        </div>
        <div className="mt-4 inline-flex items-center justify-between text-sm font-semibold text-brand-700">
          View {pallet.isLot ? "lot" : "item"} <Icon name="arrowRight" className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
