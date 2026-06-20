import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Health and beauty pallets",
  description:
    "Cosmetics, skincare, and personal care assortments. Expiry-filtered lots with lot codes available.",
};

export default function Page() {
  return <CategoryPageView slug="health-beauty" />;
}
