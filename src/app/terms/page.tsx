import type { Metadata } from "next";
import doc from "@/content/terms.json";
import { PageHeader } from "@/components/PageHeader";
import { LegalContent, type LegalSection } from "@/components/LegalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions that govern purchases and use of Wholesale101.com.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/terms", label: "Terms & Conditions" },
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
