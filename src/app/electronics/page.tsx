import type { Metadata } from "next";
import { CategoryPageView } from "@/components/CategoryPageView";

export const metadata: Metadata = {
  title: "Consumer electronics pallets",
  description:
    "Audio, smart home, and tech accessory pallets for resellers. Manifests with model numbers and MSRP where available.",
};

export default function Page() {
  return <CategoryPageView slug="electronics" />;
}
