"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type AdminRow = {
  handle: string;
  sku: string | null;
  title: string;
  categoryName: string;
  listPriceUsd: number;
  priceUsd: number;
  retailValueUsd: number;
  discountPct: number;
  onSale: boolean;
  availability: "in-stock" | "out-of-stock";
  units: number;
  image: string | null;
};

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function ProductTable({ products }: { products: AdminRow[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const rows = needle
    ? products.filter((p) => `${p.title} ${p.sku ?? ""} ${p.categoryName}`.toLowerCase().includes(needle))
    : products;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 p-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, SKU, or category…"
          className="w-full max-w-sm rounded-xl border-0 bg-ink-50 px-3 py-2 text-sm ring-1 ring-inset ring-ink-200 focus:bg-white focus:ring-2 focus:ring-brand-600"
        />
        <p className="text-sm text-ink-500">
          {rows.length} of {products.length}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Product</th>
              <th className="px-4 py-2.5 font-semibold">Category</th>
              <th className="px-4 py-2.5 font-semibold">Price</th>
              <th className="px-4 py-2.5 font-semibold">Off</th>
              <th className="px-4 py-2.5 font-semibold">Stock</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((p) => (
              <tr key={p.handle} className="hover:bg-ink-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ink-100 ring-1 ring-ink-100">
                      {p.image && (
                        <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{p.title}</p>
                      <p className="text-xs text-ink-500">
                        {p.sku ?? "—"} · {p.units.toLocaleString("en-US")} units
                      </p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-700">{p.categoryName}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="font-semibold text-brand-800">{fmt(p.priceUsd)}</span>
                  {p.onSale && (
                    <span className="ml-1.5 text-xs text-ink-400 line-through">{fmt(p.listPriceUsd)}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {p.discountPct > 0 ? (
                    <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-xs font-semibold text-accent-700">
                      {p.discountPct}%
                    </span>
                  ) : (
                    <span className="text-ink-400">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {p.availability === "in-stock" ? (
                    <span className="text-xs font-semibold text-emerald-600">In stock</span>
                  ) : (
                    <span className="text-xs font-semibold text-ink-400">Out</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.handle}`}
                    className="text-sm font-semibold text-brand-700 hover:text-accent-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-500">
                  No products match “{q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
