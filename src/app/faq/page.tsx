import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTA } from "@/components/CTA";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Buying, packing, shipping, quality grades, and returns — answers to common questions about Liquidation Pallet Deals liquidation pallets.",
};

export default function FAQPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently Asked Questions"
        description="How buying works, how lots are packed and shipped, and what our inventory grades and quality classifications mean."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
      <section className="py-12">
        <div className="container max-w-4xl">
          <FAQAccordion items={faqs} />
        </div>
      </section>
      <CTA />
    </>
  );
}
