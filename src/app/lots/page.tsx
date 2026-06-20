import type { Metadata } from "next";
import { getLots } from "@/data/pallets";
import { PageHeader } from "@/components/PageHeader";
import { PalletGrid } from "@/components/PalletGrid";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Lots",
  description:
    "Multi-unit liquidation lots priced by the piece — bulk apparel, footwear, cosmetics, and general merchandise with clear cost-per-unit.",
};

export default async function LotsPage() {
  const lots = await getLots();
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Lots"
        description="Multi-unit lots priced by the piece — bulk apparel, footwear, cosmetics, and general merchandise with clear cost-per-unit economics."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/lots", label: "Lots" },
        ]}
      />
      <section className="border-b border-ink-100 bg-white py-10">
        <div className="container">
          <p className="mb-6 text-sm text-ink-600">
            Showing <span className="font-semibold text-ink-900">{lots.length}</span> multi-unit lots
          </p>
          <PalletGrid pallets={lots} />
        </div>
      </section>
    </>
  );
}
