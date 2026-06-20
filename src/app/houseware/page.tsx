import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Houseware pallets",
  description:
    "Decor, bedding, kitchenware, lighting, and rugs at liquidation prices.",
};

export default function Page() {
  return <CategoryPageView slug="houseware" />;
}
