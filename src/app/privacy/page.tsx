import type { Metadata } from "next";
import doc from "@/content/privacy.json";
import { PageHeader } from "@/components/PageHeader";
import { LegalContent, type LegalSection } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LiquidationsPalletDeals.com collects, uses, shares, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/privacy", label: "Privacy Policy" },
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
