import type { Metadata } from "next";
import { DealTierView } from "@/components/DealTierView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "Deals over 95% off",
  description: "Deepest-discount liquidation pallets — 95% or more off MSRP.",
};

export default function Page() {
  return <DealTierView slug="95-off" />;
}
