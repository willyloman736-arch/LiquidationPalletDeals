"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";
import { useCart, type CartItem } from "@/components/cart/CartProvider";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const MAX = 99;
const stepBtn =
  "grid h-10 w-10 place-items-center rounded-lg text-ink-700 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-700";

export function BuyBox({ item, soldOut }: { item: Omit<CartItem, "qty">; soldOut: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);

  const changeQty = (next: number) => {
    setQty(Math.max(1, Math.min(MAX, next)));
    setAdded(0);
  };

  if (soldOut) {
    return (
      <div className="mt-6 flex flex-col gap-2">
        <button type="button" disabled className="btn-primary justify-center">
          Out of stock
        </button>
        <Link href="/contact" className="btn-secondary justify-center">
          Request more info
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-700">Pallets</span>
        <div className="flex items-center gap-1 rounded-xl bg-ink-50 p-1 ring-1 ring-inset ring-ink-200">
          <button type="button" onClick={() => changeQty(qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity" className={stepBtn}>
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="w-10 text-center text-base font-bold tabular-nums text-ink-900">
            {qty}
          </span>
          <button type="button" onClick={() => changeQty(qty + 1)} disabled={qty >= MAX} aria-label="Increase quantity" className={stepBtn}>
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {qty > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-600">Subtotal · {qty} pallets</span>
          <span className="font-bold text-brand-700">{usd(item.priceUsd * qty)}</span>
        </div>
      )}

      <button type="button" onClick={() => { add(item, qty); setAdded(qty); }} className="btn-primary justify-center">
        Add {qty > 1 ? `${qty} pallets` : "to cart"}
        <Icon name="cart" className="h-4 w-4" />
      </button>

      {added > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm ring-1 ring-emerald-200">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800">
            <Icon name="check" className="h-4 w-4" /> Added to cart
          </span>
          <Link href="/cart" className="font-semibold text-emerald-800 underline-offset-2 hover:underline">
            View cart →
          </Link>
        </div>
      )}

      <Link href="/contact" className="btn-secondary justify-center">
        Request more info
      </Link>
    </div>
  );
}
