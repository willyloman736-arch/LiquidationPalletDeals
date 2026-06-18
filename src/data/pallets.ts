import { categories } from "./categories";
import palletsData from "./pallets.json";

export type ManifestStatus = "fully" | "partially" | "unmanifested";
export type Condition = "new" | "mos" | "first-quality" | "shelf-pull" | "customer-return";

/** Raw lot/item data as extracted from the live wholesale101.com catalog. */
type RawPallet = {
  sku: string | null;
  handle: string;
  title: string;
  categorySlug: string;
  manifest: ManifestStatus;
  condition: Condition;
  retailValueUsd: number;
  priceUsd: number;
  units: number;
  costPerUnitUsd: number;
  availability: "in-stock" | "out-of-stock";
  images: string[];
};

const raw = palletsData as unknown as RawPallet[];

export const manifestLabel: Record<ManifestStatus, string> = {
  fully: "Fully manifested",
  partially: "Partially manifested",
  unmanifested: "Unmanifested",
};

export const conditionLabel: Record<Condition, string> = {
  new: "New",
  mos: "Marked Out of Stock",
  "first-quality": "First Quality",
  "shelf-pull": "Shelf Pull",
  "customer-return": "Customer Return",
};

export const manifestDescription: Record<ManifestStatus, string> = {
  fully: "Includes a manifest listing SKUs, retail values, and quantities for every item in the lot.",
  partially: "Includes a manifest for the top SKUs only; the remaining inventory is sold by category.",
  unmanifested:
    "Sold by category, condition, and estimated retail value without a line-item manifest.",
};

export const conditionDescription: Record<Condition, string> = {
  new: "Brand-new, retail-ready inventory.",
  mos: "New, retail-ready inventory marked out of stock from retail stores (Past Season Transfers). Primarily First Quality, with occasional light handling.",
  "first-quality": "Retail-ready merchandise free of any defects that has not been in a retail store.",
  "shelf-pull": "Previous inventory never sold to the consumer; new, but can sometimes show light signs of handling.",
  "customer-return": "Merchandise returned by consumers under the retailer's return policy; quality varies.",
};

const SHIPS_FROM = "Beacon Falls, CT";

export type Pallet = RawPallet & {
  slug: string;
  categoryName: string;
  discountPct: number;
  isLot: boolean;
  blurb: string;
  details: string[];
  tags: string[];
  shipsFrom: string;
};

/** Back-compat alias used across components. */
export type PalletWithCategoryName = Pallet;

const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const productType = (title: string) => title.split(/[:(]/)[0].trim();

function decorate(p: RawPallet): Pallet {
  const discountPct = Math.max(0, Math.round((1 - p.priceUsd / p.retailValueUsd) * 100));
  const isLot = p.units > 1;
  const type = productType(p.title);

  const blurb = isLot
    ? `${type} — ${p.units.toLocaleString("en-US")} units at $${p.costPerUnitUsd.toFixed(2)} per unit, ${discountPct}% off original retail.`
    : `${type} — ${conditionLabel[p.condition]}${discountPct > 0 ? `, ${discountPct}% off retail` : ""}.`;

  const details = isLot
    ? [
        `Estimated retail value ${usd0(p.retailValueUsd)}`,
        `${p.units.toLocaleString("en-US")} units · $${p.costPerUnitUsd.toFixed(2)} cost per unit`,
        `Quality: ${conditionLabel[p.condition]}`,
        manifestLabel[p.manifest],
        `Ships from ${SHIPS_FROM}`,
      ]
    : [
        `Estimated retail value ${usd0(p.retailValueUsd)}`,
        `Quality: ${conditionLabel[p.condition]}`,
        p.availability === "in-stock" ? "In stock" : "Currently out of stock",
        `Ships from ${SHIPS_FROM}`,
      ];

  const tags = Array.from(
    new Set([
      categoryName(p.categorySlug),
      conditionLabel[p.condition],
      isLot ? manifestLabel[p.manifest] : "Single item",
    ])
  );

  return {
    ...p,
    slug: p.handle,
    categoryName: categoryName(p.categorySlug),
    discountPct,
    isLot,
    blurb,
    details,
    tags,
    shipsFrom: SHIPS_FROM,
  };
}

const decorated: Pallet[] = raw.map(decorate);

export function allPallets(): Pallet[] {
  return decorated;
}

export function getPalletsByCategory(slug: string): Pallet[] {
  return decorated.filter((p) => p.categorySlug === slug);
}

export function getPallet(slug: string): Pallet | undefined {
  return decorated.find((p) => p.slug === slug);
}

export function getPalletsByDiscount(minPct: number): Pallet[] {
  return decorated
    .filter((p) => p.discountPct >= minPct)
    .sort((a, b) => b.discountPct - a.discountPct);
}
