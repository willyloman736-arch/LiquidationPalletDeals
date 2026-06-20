import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "How to buy",
  description:
    "How buying liquidation pallets from Liquidation Pallet Deals works — browse, order, freight quote, payment, and delivery.",
};

const steps = [
  { icon: "boxes", title: "1. Browse the catalog", body: "Shop pallets, lots, and truckloads by category. New inventory is listed daily — first come, first served." },
  { icon: "cart", title: "2. Add to cart & send", body: "Add the lots you want, enter your shipping address, pick a payment method, and send your order on WhatsApp." },
  { icon: "truck", title: "3. Get your freight quote", body: "We reply with live LTL/FTL freight to your address — or free dock pickup in Jacksonville, FL." },
  { icon: "shield", title: "4. Pay & ship", body: "Pay by Wire, Apple Pay, Chime, or Zelle. Orders ship within 3–5 business days, plastic-wrapped on pallets." },
];

export default function HowToBuyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="How to buy"
        description="Buying by the pallet is simple. Here's exactly how it works, from browse to delivery."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/how-to-buy", label: "How to Buy" },
        ]}
      />
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/pallets" className="btn-primary">
              Shop pallets <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
            <Link href="/faq" className="btn-secondary">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
