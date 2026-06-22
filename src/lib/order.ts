import { site } from "@/lib/site";

/**
 * Minimum order subtotal in USD. Freight economics on LTL pallets make orders
 * under $650 uneconomical, so checkout is gated at the cart and checkout pages.
 */
export const MIN_ORDER_USD = 650;

/** Dollar shortfall to reach the minimum (0 once subtotal meets or exceeds it). */
export function minOrderShortfall(subtotal: number): number {
  return Math.max(0, MIN_ORDER_USD - subtotal);
}

export const PAYMENT_METHODS = ["Wire Transfer", "Apple Pay", "Chime", "Zelle"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type CheckoutForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  payment: string;
  notes: string;
};

export type OrderLine = { title: string; sku: string | null; priceUsd: number; qty: number };

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

/** Plain-text order summary for the WhatsApp message. */
export function buildOrderText(items: OrderLine[], form: CheckoutForm, subtotal: number): string {
  const lines = items.map(
    (i) =>
      `• ${i.qty} x ${i.title}${i.sku ? ` (SKU ${i.sku})` : ""} — ${money(i.priceUsd)} ea = ${money(
        i.priceUsd * i.qty
      )}`
  );
  const totalPallets = items.reduce((a, i) => a + i.qty, 0);
  const out: (string | null)[] = [
    `New order — ${site.name}`,
    "",
    "ITEMS",
    ...lines,
    `Subtotal: ${money(subtotal)} (${totalPallets} ${totalPallets === 1 ? "pallet" : "pallets"})`,
    "— shipping quoted separately —",
    "",
    "SHIP TO",
    form.name,
    form.company.trim() || null,
    form.address1,
    form.address2.trim() || null,
    `${form.city}, ${form.state} ${form.zip}`,
    form.country,
    `Phone: ${form.phone}`,
    form.email.trim() ? `Email: ${form.email}` : null,
    "",
    `PREFERRED PAYMENT: ${form.payment}`,
    form.notes.trim() ? `\nNOTES: ${form.notes}` : null,
  ];
  return out.filter((l): l is string => l !== null).join("\n");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Order delivered to our inbox via the customer's email client. */
export function orderMailto(text: string, name: string): string {
  const subject = `New order${name.trim() ? ` — ${name.trim()}` : ""} | ${site.name}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
