import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const revalidate = 120; // ISR — reflect DB changes without a redeploy

export const metadata: Metadata = {
  title: "General merchandise pallets",
  description:
    "Assorted high-velocity SKUs at a low cost per unit. Big-box overstock and shelf pulls across departments.",
};

export default function Page() {
  return <CategoryPageView slug="general-merchandise" />;
}
