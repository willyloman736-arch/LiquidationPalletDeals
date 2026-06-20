import type { Metadata } from "next";
import { DealTierView } from "@/components/DealTierView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Deals over 80% off",
  description: "Liquidation pallets discounted 80% or more off MSRP.",
};

export default function Page() {
  return <DealTierView slug="80-off" />;
}
