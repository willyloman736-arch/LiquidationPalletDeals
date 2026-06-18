import type { Metadata } from "next";
import { DealTierView } from "@/components/DealTierView";

export const metadata: Metadata = {
  title: "Deals over 90% off",
  description: "Liquidation pallets discounted 90% or more off MSRP.",
};

export default function Page() {
  return <DealTierView slug="90-off" />;
}
