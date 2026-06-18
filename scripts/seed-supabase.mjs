// Seeds Supabase from the static catalog (src/data/pallets.json) + deal tiers.
// Run once after creating the project and the schema:
//   node --env-file=.env.local scripts/seed-supabase.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "Missing env. Run: node --env-file=.env.local scripts/seed-supabase.mjs\n" +
      "Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const products = JSON.parse(readFileSync(join(ROOT, "src/data/pallets.json"), "utf8"));
const rows = products.map((p, i) => ({
  sku: p.sku ?? null,
  handle: p.handle,
  title: p.title,
  category_slug: p.categorySlug,
  manifest: p.manifest,
  condition: p.condition,
  retail_value_usd: p.retailValueUsd,
  price_usd: p.priceUsd,
  sale_price_usd: null,
  units: p.units,
  cost_per_unit_usd: p.costPerUnitUsd ?? null,
  availability: p.availability,
  images: p.images ?? [],
  featured: false,
  sort_order: i,
}));

const dealTiers = [
  { slug: "80-off", name: "Deals Over 80% Off", min_discount: 80, blurb: "Strong-margin lots for resellers building inventory at scale.", sort_order: 0 },
  { slug: "90-off", name: "Deals Over 90% Off", min_discount: 90, blurb: "Deeper discounts on overstock and shelf-pulls — limited quantities.", sort_order: 1 },
  { slug: "95-off", name: "Deals Over 95% Off", min_discount: 95, blurb: "Our deepest-discount tier. First come, first served, no holds.", sort_order: 2 },
];

const { error: dtErr } = await sb.from("deal_tiers").upsert(dealTiers, { onConflict: "slug" });
if (dtErr) {
  console.error("deal_tiers error:", dtErr.message);
  process.exit(1);
}

const { error: pErr } = await sb.from("products").upsert(rows, { onConflict: "handle" });
if (pErr) {
  console.error("products error:", pErr.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} products and ${dealTiers.length} deal tiers into Supabase.`);
