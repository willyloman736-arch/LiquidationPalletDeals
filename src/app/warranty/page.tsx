import type { Metadata } from "next";
import doc from "@/content/warranty.json";
import { PageHeader } from "@/components/PageHeader";
import { LegalContent, type LegalSection } from "@/components/LegalContent";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Warranty Policy",
  description:
    "Liquidation Pallet Deals' 30-day functional guarantee on pallets and truckloads — what's covered, what isn't, and how to file a warranty claim.",
};

export default function WarrantyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policies"
        title={doc.title}
        description={doc.intro}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/warranty", label: "Warranty" },
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
