"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/Icon";
import { PAYMENT_METHODS, buildOrderText, orderMailto, type CheckoutForm } from "@/lib/order";
import { site } from "@/lib/site";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const EMPTY: CheckoutForm = {
  name: "", company: "", phone: "", email: "",
  address1: "", address2: "", city: "", state: "", zip: "", country: "USA",
  payment: "", notes: "",
};

const field =
  "mt-1 w-full rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-brand-600";

export default function CheckoutPage() {
  const { items, subtotal, count, ready, clear } = useCart();
  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const formEl = useRef<HTMLFormElement>(null);

  const set = (k: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitOrder = () => {
    if (!formEl.current?.reportValidity()) return; // run native validation first
    const text = buildOrderText(
      items.map((i) => ({ title: i.title, sku: i.sku, priceUsd: i.priceUsd, qty: i.qty })),
      form,
      subtotal
    );
    const url = orderMailto(text, form.name);
    window.location.href = url;
    setSentUrl(url);
  };

  // ---- order sent confirmation ----
  if (sentUrl) {
    return (
      <section className="py-16">
        <div className="container max-w-xl text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-700">
            <Icon name="check" className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900">Your order is ready to send</h1>
          <p className="mt-2 text-ink-600">
            We opened your email app with your order addressed to {site.email} — just press send. We&rsquo;ll reply
            with a freight quote and payment instructions for your chosen method.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a href={sentUrl} className="btn-primary">
              Didn&rsquo;t open? Email your order <Icon name="arrowRight" className="h-4 w-4" />
            </a>
            <button type="button" onClick={() => clear()} className="text-sm font-semibold text-ink-500 hover:text-brand-700">
              Clear my cart
            </button>
            <Link href="/deals" className="text-sm font-semibold text-brand-700 hover:underline">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ---- empty cart guard ----
  if (ready && items.length === 0) {
    return (
      <section className="py-16">
        <div className="container max-w-xl text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Your cart is empty</h1>
          <p className="mt-2 text-ink-600">Add a pallet or two before checking out.</p>
          <Link href="/deals" className="btn-primary mt-6 inline-flex">
            Shop deals <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container max-w-5xl">
        <Link href="/cart" className="text-sm text-ink-500 hover:text-brand-700">← Back to cart</Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">Checkout</h1>
        <p className="mt-1 text-sm text-ink-600">
          We don&rsquo;t charge cards here — submit your order and we&rsquo;ll reply with a shipping quote and payment
          instructions for your chosen method.
        </p>

        <form ref={formEl} onSubmit={(e) => e.preventDefault()} className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <fieldset>
              <legend className="text-lg font-bold text-ink-900">Shipping address</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Label className="sm:col-span-2" text="Full name" req>
                  <input name="name" required autoComplete="name" value={form.name} onChange={set("name")} className={field} />
                </Label>
                <Label className="sm:col-span-2" text="Business name (optional)">
                  <input name="company" autoComplete="organization" value={form.company} onChange={set("company")} className={field} />
                </Label>
                <Label text="Phone" req>
                  <input name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={set("phone")} className={field} placeholder="(555) 555-5555" />
                </Label>
                <Label text="Email (optional)">
                  <input name="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={field} />
                </Label>
                <Label className="sm:col-span-2" text="Street address" req>
                  <input name="address1" required autoComplete="address-line1" value={form.address1} onChange={set("address1")} className={field} />
                </Label>
                <Label className="sm:col-span-2" text="Apt, suite, unit (optional)">
                  <input name="address2" autoComplete="address-line2" value={form.address2} onChange={set("address2")} className={field} />
                </Label>
                <Label text="City" req>
                  <input name="city" required autoComplete="address-level2" value={form.city} onChange={set("city")} className={field} />
                </Label>
                <Label text="State" req>
                  <input name="state" required autoComplete="address-level1" value={form.state} onChange={set("state")} className={field} placeholder="FL" />
                </Label>
                <Label text="ZIP" req>
                  <input name="zip" required autoComplete="postal-code" inputMode="numeric" value={form.zip} onChange={set("zip")} className={field} />
                </Label>
                <Label text="Country" req>
                  <input name="country" required autoComplete="country-name" value={form.country} onChange={set("country")} className={field} />
                </Label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-lg font-bold text-ink-900">Payment method</legend>
              <p className="mt-1 text-sm text-ink-600">Pick how you&rsquo;d like to pay — we&rsquo;ll send instructions after your order.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-0 p-4 ring-1 ring-inset transition ${
                      form.payment === m ? "bg-brand-50 ring-2 ring-brand-600" : "bg-white ring-ink-200 hover:ring-brand-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m}
                      required
                      checked={form.payment === m}
                      onChange={set("payment")}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-600"
                    />
                    <span className="text-sm font-semibold text-ink-900">{m}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-lg font-bold text-ink-900">Order notes (optional)</legend>
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={set("notes")}
                className={field}
                placeholder="Delivery instructions, dock/liftgate needs, questions…"
              />
            </fieldset>
          </div>

          <aside className="lg:col-span-5">
            <div className="card sticky top-28 p-6">
              <h2 className="text-lg font-bold text-ink-900">Your order</h2>
              <ul className="mt-4 space-y-3">
                {items.map((it) => (
                  <li key={it.handle} className="flex items-start justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="font-semibold text-ink-900">{it.qty}×</span>{" "}
                      <span className="text-ink-700">{it.title}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-ink-900">{usd(it.priceUsd * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-600">Subtotal · {count} pallets</dt>
                  <dd className="font-semibold text-ink-900">{usd(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-600">Shipping</dt>
                  <dd className="text-ink-500">Quoted after order</dd>
                </div>
              </dl>

              <p className="mt-6 border-t border-ink-100 pt-4 text-center text-xs text-ink-500">
                Questions first? <a href={`mailto:${site.email}`} className="link">Email us</a> or{" "}
                <a href={`tel:+${site.whatsappNumber}`} className="link">call/text {site.phone}</a>.
              </p>
            </div>
          </aside>
        </form>

        {/* Checkout button lives BELOW the order summary block, not inside it */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:items-end">
          <button
            type="button"
            onClick={submitOrder}
            className="btn-primary w-full justify-center px-10 py-3 text-base sm:w-auto"
          >
            Checkout <Icon name="arrowRight" className="h-4 w-4" />
          </button>
          <p className="text-center text-xs text-ink-500 sm:text-right">
            Emails your order to {site.email}. We reply with a freight quote and payment instructions. No card is charged.
          </p>
        </div>
      </div>
    </section>
  );
}

function Label({
  text, req = false, className = "", children,
}: {
  text: string; req?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="font-medium text-ink-800">
        {text}
        {req && <span className="ml-0.5 text-accent-600">*</span>}
      </span>
      {children}
    </label>
  );
}
