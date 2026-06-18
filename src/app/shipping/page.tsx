import type { Metadata } from "next";
import Link from "next/link";
import doc from "@/content/shipping.json";
import { PageHeader } from "@/components/PageHeader";
import { LegalContent, type LegalSection } from "@/components/LegalContent";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Pickup, LTL, and FTL shipping terms for LiquidationsPalletDeals.com — title transfer, costs, restrictions, tracking, and returns.",
};

const highlights = [
  { icon: "pin", title: "Free pickup", body: "Pick up free at 125 Railroad Ave, Beacon Falls, CT — Mon–Fri, 7:00am–3:30pm ET." },
  { icon: "truck", title: "Live LTL rates", body: "In-cart LTL rates via ShipHawk across 250+ carriers. Best for 1–20 pallets." },
  { icon: "boxes", title: '"Invoice Me" (LTL/FTL)', body: "Larger orders ship FTL with a market quote — you're billed once the rate is calculated." },
];

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shipping"
        title={doc.title}
        description="How pickup, LTL, and FTL freight work — and what happens if something arrives damaged."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/shipping", label: "Shipping" },
        ]}
      />
      <section className="border-b border-ink-100 py-12">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon name={h.icon} />
                </span>
                <h2 className="mt-4 text-base font-bold text-ink-900">{h.title}</h2>
                <p className="mt-2 text-sm text-ink-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-3xl">
          <LegalContent sections={doc.sections as LegalSection[]} />
          <p className="mt-8 text-sm text-ink-600">
            Questions about freight on a specific lot?{" "}
            <Link href="/contact" className="link font-semibold">
              Contact us
            </Link>{" "}
            with the SKUs you&rsquo;re considering.
          </p>
        </div>
      </section>
    </>
  );
}
