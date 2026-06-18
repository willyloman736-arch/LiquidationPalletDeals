import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const metadata: Metadata = {
  title: "Apparel pallets",
  description:
    "Brand-name clothing, accessories, and footwear by the pallet. Mixed sizes and styles, condition-graded before shipping.",
};

export default function Page() {
  return <CategoryPageView slug="apparel" />;
}
