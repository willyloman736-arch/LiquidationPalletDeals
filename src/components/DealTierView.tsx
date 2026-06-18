import { notFound } from "next/navigation";
import { dealTiers } from "@/data/categories";
import { getPalletsByDiscount } from "@/data/pallets";
import { PageHeader } from "./PageHeader";
import { PalletGrid } from "./PalletGrid";

export function DealTierView({ slug }: { slug: string }) {
  const tier = dealTiers.find((d) => d.slug === slug);
  if (!tier) return notFound();
  const pallets = getPalletsByDiscount(tier.minDiscount);

  return (
    <>
      <PageHeader
        eyebrow="Discount tier"
        title={`${tier.minDiscount}%+ off MSRP`}
        description={tier.blurb}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/deals", label: "Deals" },
          { href: `/deals/${tier.slug}`, label: `${tier.minDiscount}%+ off` },
        ]}
      />
      <section className="py-12">
        <div className="container">
          <p className="mb-6 text-sm text-ink-600">
            Showing <span className="font-semibold text-ink-900">{pallets.length}</span> lots at
            {` ${tier.minDiscount}%`} off MSRP or deeper.
          </p>
          <PalletGrid pallets={pallets} />
        </div>
      </section>
    </>
  );
}
