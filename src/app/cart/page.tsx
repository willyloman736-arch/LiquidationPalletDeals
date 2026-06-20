"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/Icon";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const MAX = 99;
const stepBtn =
  "grid h-9 w-9 place-items-center rounded-lg text-ink-700 transition hover:bg-white hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export default function CartPage() {
  const { items, ready, subtotal, count, setQty, remove } = useCart();

  return (
    <section className="py-12">
      <div className="container max-w-5xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Your cart</h1>

        {!ready ? (
          <p className="mt-6 text-sm text-ink-500">Loading your cart…</p>
        ) : items.length === 0 ? (
          <div className="card mt-8 p-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink-50 text-ink-400">
              <Icon name="cart" className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-bold text-ink-900">Your cart is empty</h2>
            <p className="mt-1 text-sm text-ink-600">Browse pallets and add a few lots to get started.</p>
            <Link href="/deals" className="btn-primary mt-6 inline-flex">
              Shop deals <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              {items.map((it) => (
                <div key={it.handle} className="card flex gap-4 p-4">
                  <Link
                    href={`/pallets/${it.handle}`}
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100"
                  >
                    {it.image && <Image src={it.image} alt="" fill sizes="96px" className="object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/pallets/${it.handle}`}
                        className="line-clamp-2 font-semibold text-ink-900 hover:text-brand-700"
                      >
                        {it.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(it.handle)}
                        aria-label={`Remove ${it.title}`}
                        className="shrink-0 text-ink-400 hover:text-red-600"
                      >
                        <Icon name="close" className="h-4 w-4" />
                      </button>
                    </div>
                    {it.sku && <p className="text-xs text-ink-500">SKU {it.sku}</p>}
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center gap-1 rounded-xl bg-ink-50 p-1 ring-1 ring-inset ring-ink-200">
                        <button type="button" onClick={() => setQty(it.handle, it.qty - 1)} disabled={it.qty <= 1} aria-label="Decrease quantity" className={stepBtn}>
                          <Icon name="minus" className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold tabular-nums">{it.qty}</span>
                        <button type="button" onClick={() => setQty(it.handle, it.qty + 1)} disabled={it.qty >= MAX} aria-label="Increase quantity" className={stepBtn}>
                          <Icon name="plus" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-700">{usd(it.priceUsd * it.qty)}</p>
                        <p className="text-xs text-ink-500">{usd(it.priceUsd)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="card sticky top-28 p-6">
                <h2 className="text-lg font-bold text-ink-900">Order summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Pallets</dt>
                    <dd className="font-semibold text-ink-900">{count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Subtotal</dt>
                    <dd className="font-semibold text-ink-900">{usd(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-600">Shipping</dt>
                    <dd className="text-ink-500">Quoted after order</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                  <span className="font-bold text-ink-900">Total</span>
                  <span className="text-xl font-extrabold text-brand-700">{usd(subtotal)}</span>
                </div>
                <Link href="/checkout" className="btn-primary mt-6 w-full justify-center">
                  Proceed to checkout <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                <Link href="/deals" className="mt-2 block text-center text-sm font-semibold text-brand-700 hover:underline">
                  Continue shopping
                </Link>
                <p className="mt-4 text-xs text-ink-500">
                  Subtotal excludes freight. You&rsquo;ll send your order on the next step and we&rsquo;ll reply with a shipping quote and payment instructions.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
