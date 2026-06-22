import type { Metadata } from "next";
import doc from "@/content/refund-return.json";
import { PageHeader } from "@/components/PageHeader";
import { LegalContent, type LegalSection } from "@/components/LegalContent";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Liquidation Pallet Deals' 30-day claim window for shortages, damage in transit, or pallets substantively misrepresented in the Listing — and how to file a claim.",
};

export default function RefundReturnPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policies"
        title={doc.title}
        description={doc.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/refund-return", label: "Refund & Return" },
        ]}
      />
      <section className="py-12">
        <div className="container max-w-3xl">
          <LegalContent sections={doc.sections as LegalSection[]} />
        </div>
      </section>
    </>
  );
}
