import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Liquidation Pallet Deals is a B2B reseller of inspected, condition-graded liquidation pallets and truckloads, shipping daily from Jacksonville, Florida.",
};

const stats = [
  { label: "Hundreds of lots in stock", value: "289+" },
  { label: "Departments covered", value: "7" },
  { label: "Claim window", value: "30 days" },
  { label: "Ships from", value: "Jacksonville, FL" },
];

const story = [
  "Liquidation Pallet Deals is a B2B reseller built for resellers. We source pallets, lots, and truckloads of famous and specialty-store brand merchandise from established liquidation channels, condition-grade every lot at our Jacksonville facility, and list new inventory daily.",
  "Our customers are bin store operators, marketplace sellers, swap meet vendors, FBA preppers, and independent wholesalers. The model is simple: transparent per-unit pricing, honest condition grading, live LTL freight, and free dock pickup for buyers who want to handle their own logistics.",
  "We don't try to be all things to everyone. We're a wholesale operation — by the pallet or the truckload — and we back every shipment with a 30-day claim window for shortages, transit damage, or pallets substantively misrepresented in the Listing. Outside of that, merchandise is sold as is, where is, the way the industry has always worked.",
  "New lots come in every week across apparel, electronics, furniture, general merchandise, health & beauty, houseware, and mixed pallets. If you're a serious reseller looking for a straight-talk supplier, this is the right place to start.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Liquidation done straight."
        description="A B2B reseller of inspected, condition-graded liquidation pallets and truckloads — sourced, graded, and shipped from Jacksonville, Florida."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
      />

      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Who we are</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-700">
              {story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-ink-100">
              <Image
                src="/images/marketing/facility.webp"
                alt="Liquidation Pallet Deals warehouse exterior in Jacksonville, Florida"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="card p-4">
                  <dd className="text-xl font-extrabold text-ink-900">{s.value}</dd>
                  <dt className="mt-1 text-xs uppercase tracking-wider text-ink-500">{s.label}</dt>
                </div>
              ))}
            </dl>
            <Link
              href="/contact"
              className="mt-4 inline-flex w-full items-center justify-center gap-1 btn-primary"
            >
              Talk to our team <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      <CTA />
    </>
  );
}
