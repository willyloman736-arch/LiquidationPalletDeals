import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ReviewCard } from "@/components/ReviewCard";
import { CTA } from "@/components/CTA";
import { reviews } from "@/data/reviews";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Customer reviews",
  description:
    "Read what resellers, bin store operators, and marketplace sellers say about buying liquidation pallets and truckloads from Liquidation Pallet Deals.",
};

export default function ReviewsPage() {
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="What our customers say."
        description="Resellers, bin store operators, and marketplace sellers — here’s how their pallets and truckloads performed."
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "/reviews", label: "Reviews" },
        ]}
      />
      <section className="border-b border-ink-100 bg-ink-50 py-12">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <p className="text-sm text-ink-600">
              <span className="font-bold text-ink-900">{avg.toFixed(1)}</span> average across{" "}
              <span className="font-bold text-ink-900">{reviews.length}</span> reviews
            </p>
            <p className="text-xs text-ink-500">Verified post-shipment</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard key={r.name + r.title} review={r} />
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
