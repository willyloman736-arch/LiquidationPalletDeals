import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Furniture pallets and truckloads",
  description:
    "Bedroom, living room, and office furniture. Pallets and full truckloads, dock pickup or LTL delivery.",
};

export default function Page() {
  return <CategoryPageView slug="furniture" />;
}
