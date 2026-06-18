import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Icon } from "@/components/Icon";
import { CTA } from "@/components/CTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "LiquidationsPalletDeals.com is backed by NEJ, Inc. and 33 years of B2B reverse-logistics experience. We inspect and grade every lot before it ships from Beacon Falls, Connecticut.",
};

const stats = [
  { label: "Reverse-logistics experience", value: "33 yrs" },
  { label: "NEJ, Inc. founded", value: "1990" },
  { label: "Platform relaunched", value: "2024" },
  { label: "Inspection coverage", value: "100%" },
];

const story = [
  "LiquidationsPalletDeals.com, a B2C e-commerce strategy, was originally established in 2011 as a division of NEJ, Inc. NEJ was founded in 1990 by Ed Mascolo, who became a national leader in purchasing excess inventories of end-of-season branded and specialty stores' apparel, footwear, accessories, and light home goods for resale to global off-price retailers. The synergies were in place for NEJ to grow a B2C platform, but the e-commerce model became a distraction to the core business.",
  "LiquidationsPalletDeals.com transformed into a B2B business to service the ground swell of eBay and Amazon Marketplace resellers. LiquidationsPalletDeals.com was positioned to capitalize on the vast infrastructure NEJ built over its 20 years. Again, the division became an interference to the core business model and went dormant.",
  "A new team was developed in 2024 to create a strong base combined with the muscle of NEJ's 33 years of infrastructure to restart the B2B platform. The straight-talk style of this team aligned well to reintroduce LiquidationsPalletDeals.com.",
  "LiquidationsPalletDeals.com provides bulk inventory offerings of famous and specialty store branded clothing, accessories, general merchandise, light home goods, and more. Our prices and quality of goods will “wow!” you. Inventory offerings are typically at least 82% off MSRP. Pricing is listed by lot. Lots may be fully manifested, partially manifested, or unmanifested. Offerings are by the pallet as well as by the truckload. NEJ performs a quality control inspection on all goods offered. New inventories are received daily, providing the variety you need to be profitable.",
  "Finding the right liquidation partner is crucial in growing a successful business. LiquidationsPalletDeals.com is your trouble-free pallet/bulk goods provider that will make a difference in your business!",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="33 years of B2B reverse-logistics experience."
        description="LiquidationsPalletDeals.com is backed by NEJ, Inc. — inspecting, grading, and shipping famous and specialty-store brand liquidation from Beacon Falls, Connecticut."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
        ]}
      />

      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">Our story</h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-700">
              {story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                If you are looking to purchase individual items in a retail setting, learn more at{" "}
                <a href={site.retailSite} className="link font-semibold">
                  Retail101.com
                </a>
                .
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-ink-100">
              <Image
                src="/images/marketing/facility.webp"
                alt="NEJ / LiquidationsPalletDeals.com warehouse exterior in Beacon Falls, Connecticut"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="card p-4">
                  <dd className="text-2xl font-extrabold text-ink-900">{s.value}</dd>
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
