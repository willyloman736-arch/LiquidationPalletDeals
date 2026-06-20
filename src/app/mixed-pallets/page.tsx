import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Mixed pallets",
  description:
    "Cross-category lots blending apparel, electronics, beauty, and houseware. Sample categories in a single lot.",
};

export default function Page() {
  return <CategoryPageView slug="mixed-pallets" />;
}
