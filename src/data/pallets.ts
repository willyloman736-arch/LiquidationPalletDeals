import { cache } from "react";
import { categories, dealTiers as staticDealTiers } from "./categories";
import palletsData from "./pallets.json";
import { getPublicClient } from "@/lib/supabase";

export type ManifestStatus = "fully" | "partially" | "unmanifested";
export type Condition = "new" | "mos" | "first-quality" | "shelf-pull" | "customer-return";

/** Raw lot/item data (from Supabase, or the static JSON fallback). */
type RawPallet = {
  sku: string | null;
  handle: string;
  title: string;
  categorySlug: string;
  manifest: ManifestStatus;
  condition: Condition;
  retailValueUsd: number;
  priceUsd: number;
  salePriceUsd: number | null;
  units: number;
  costPerUnitUsd: number;
  availability: "in-stock" | "out-of-stock";
  images: string[];
  summary: string | null;
  featured: boolean;
};

export const manifestLabel: Record<ManifestStatus, string> = {
  fully: "Fully manifested",
  partially: "Partially manifested",
  unmanifested: "Unmanifested",
};

export const conditionLabel: Record<Condition, string> = {
  new: "New",
  mos: "Past Season Transfers",
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
  mos: "New, retail-ready inventory pulled from retail stores at the end of a season. Primarily First Quality, with occasional light handling.",
  "first-quality": "Retail-ready merchandise free of any defects that has not been in a retail store.",
  "shelf-pull": "Previous inventory never sold to the consumer; new, but can sometimes show light signs of handling.",
  "customer-return": "Merchandise returned by consumers under the retailer's return policy; quality varies.",
};

const SHIPS_FROM = "Jacksonville, FL";

export type DealTier = {
  slug: string;
  name: string;
  minDiscount: number;
  blurb: string;
  accent: string;
};

export type Pallet = RawPallet & {
  slug: string;
  categoryName: string;
  discountPct: number;
  onSale: boolean;
  listPriceUsd: number; // regular price, shown struck-through when on sale
  isLot: boolean;
  blurb: string;
  details: string[];
  tags: string[];
  shipsFrom: string;
};

/** Back-compat alias used across components. */
export type PalletWithCategoryName = Pallet;

// --- sources -------------------------------------------------------------
const jsonRaw: RawPallet[] = (palletsData as Array<Record<string, unknown>>).map((p) => ({
  sku: (p.sku as string) ?? null,
  handle: p.handle as string,
  title: p.title as string,
  categorySlug: p.categorySlug as string,
  manifest: p.manifest as ManifestStatus,
  condition: p.condition as Condition,
  retailValueUsd: p.retailValueUsd as number,
  priceUsd: p.priceUsd as number,
  salePriceUsd: null,
  units: p.units as number,
  costPerUnitUsd: p.costPerUnitUsd as number,
  availability: p.availability as "in-stock" | "out-of-stock",
  images: (p.images as string[]) ?? [],
  summary: (p.summary as string) ?? null,
  featured: false,
}));

type Row = Record<string, unknown>;
const num = (v: unknown) => (v == null ? null : Number(v));

function fromRow(r: Row): RawPallet {
  const price = Number(r.price_usd);
  const units = Number(r.units) || 1;
  return {
    sku: (r.sku as string) ?? null,
    handle: r.handle as string,
    title: r.title as string,
    categorySlug: r.category_slug as string,
    manifest: r.manifest as ManifestStatus,
    condition: r.condition as Condition,
    retailValueUsd: Number(r.retail_value_usd),
    priceUsd: price,
    salePriceUsd: num(r.sale_price_usd),
    units,
    costPerUnitUsd: r.cost_per_unit_usd == null ? Math.round((price / units) * 100) / 100 : Number(r.cost_per_unit_usd),
    availability: (r.availability as "in-stock" | "out-of-stock") ?? "in-stock",
    images: Array.isArray(r.images) ? (r.images as string[]) : [],
    summary: (r.summary as string) ?? null,
    featured: Boolean(r.featured),
  };
}

/** Per-request memoized raw load: Supabase when configured, else static JSON. */
const loadRaw = cache(async (): Promise<RawPallet[]> => {
  const sb = getPublicClient();
  if (!sb) return jsonRaw;
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data || data.length === 0) return jsonRaw;
  return (data as Row[]).map(fromRow);
});

const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const productType = (title: string) => title.split(/[:(]/)[0].trim();

function decorate(p: RawPallet): Pallet {
  const onSale = p.salePriceUsd != null && p.salePriceUsd < p.priceUsd;
  const effective = onSale ? (p.salePriceUsd as number) : p.priceUsd;
  const discountPct = Math.max(0, Math.round((1 - effective / p.retailValueUsd) * 100));
  const isLot = p.units > 1;
  const type = productType(p.title);

  const hasRetail = discountPct > 0; // flat-priced lots have no separate MSRP to show
  const generatedBlurb = isLot
    ? `${type} — ${p.units.toLocaleString("en-US")} units at $${p.costPerUnitUsd.toFixed(2)} per unit${hasRetail ? `, ${discountPct}% off original retail` : ""}.`
    : `${type} — ${conditionLabel[p.condition]}${hasRetail ? `, ${discountPct}% off retail` : ""}.`;
  const blurb = p.summary && p.summary.trim() ? p.summary.trim() : generatedBlurb;

  const details = isLot
    ? [
        ...(hasRetail ? [`Estimated retail value ${usd0(p.retailValueUsd)}`] : []),
        `${p.units.toLocaleString("en-US")} units · $${p.costPerUnitUsd.toFixed(2)} cost per unit`,
        `Quality: ${conditionLabel[p.condition]}`,
        manifestLabel[p.manifest],
        `Ships from ${SHIPS_FROM}`,
      ]
    : [
        ...(hasRetail
          ? [`Estimated retail value ${usd0(p.retailValueUsd)}`]
          : [`Total pallet price ${usd0(p.priceUsd)}`]),
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
    priceUsd: effective, // displayed/live price
    listPriceUsd: p.priceUsd, // regular price ("was")
    onSale,
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

export async function allPallets(): Promise<Pallet[]> {
  return (await loadRaw()).map(decorate);
}

export async function getPalletsByCategory(slug: string): Promise<Pallet[]> {
  return (await allPallets()).filter((p) => p.categorySlug === slug);
}

export async function getPallet(slug: string): Promise<Pallet | undefined> {
  return (await allPallets()).find((p) => p.slug === slug);
}

export async function getPalletsByDiscount(minPct: number): Promise<Pallet[]> {
  return (await allPallets()).filter((p) => p.discountPct >= minPct).sort((a, b) => b.discountPct - a.discountPct);
}

/** Multi-unit lots — priced by the piece (e.g. 110 pairs, 2,000 pieces). */
export async function getLots(): Promise<Pallet[]> {
  return (await allPallets()).filter((p) => p.units > 1);
}

/** Full-truckload listings (matched by title). Truckloads are mostly quote-based. */
export async function getTruckloads(): Promise<Pallet[]> {
  return (await allPallets()).filter((p) => /truck\s?loads?/i.test(p.title));
}

/** Deal tiers: from Supabase when configured (editable thresholds), else static. */
export const getDealTiers = cache(async (): Promise<DealTier[]> => {
  const sb = getPublicClient();
  if (sb) {
    const { data } = await sb.from("deal_tiers").select("*").order("sort_order", { ascending: true });
    if (data && data.length) {
      return (data as Row[]).map((d, i) => ({
        slug: d.slug as string,
        name: d.name as string,
        minDiscount: Number(d.min_discount),
        blurb: (d.blurb as string) ?? "",
        accent: staticDealTiers[i]?.accent ?? "from-brand-600 to-brand-800",
      }));
    }
  }
  return staticDealTiers.map((d) => ({
    slug: d.slug,
    name: d.name,
    minDiscount: d.minDiscount,
    blurb: d.blurb,
    accent: d.accent,
  }));
});
