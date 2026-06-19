// Generates supabase/seed.sql from the static catalog so it can be pasted
// straight into the Supabase SQL Editor (no terminal/keys needed).
// Run: node scripts/generate-seed-sql.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const products = JSON.parse(readFileSync(join(ROOT, "src/data/pallets.json"), "utf8"));

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const arr = (a) => (a && a.length ? "array[" + a.map(q).join(",") + "]" : "array[]::text[]");
const numOrNull = (v) => (v == null ? "null" : Number(v));

const productRows = products.map(
  (p, i) =>
    `(${p.sku ? q(p.sku) : "null"}, ${q(p.handle)}, ${q(p.title)}, ${q(p.categorySlug)}, ` +
    `${q(p.manifest)}, ${q(p.condition)}, ${Number(p.retailValueUsd)}, ${Number(p.priceUsd)}, ` +
    `${Number(p.units)}, ${numOrNull(p.costPerUnitUsd)}, ${q(p.availability)}, ${arr(p.images)}, ${i})`
);

const dealTiers = [
  ["80-off", "Deals Over 80% Off", 80, "Strong-margin lots for resellers building inventory at scale.", 0],
  ["90-off", "Deals Over 90% Off", 90, "Deeper discounts on overstock and shelf-pulls — limited quantities.", 1],
  ["95-off", "Deals Over 95% Off", 95, "Our deepest-discount tier. First come, first served, no holds.", 2],
];
const tierRows = dealTiers.map(([slug, name, md, blurb, so]) => `(${q(slug)}, ${q(name)}, ${md}, ${q(blurb)}, ${so})`);

const sql = `-- Seed data for Liquidation Pallet Deals.
-- Run this in Supabase → SQL Editor AFTER running schema.sql. Safe to re-run.

insert into public.deal_tiers (slug, name, min_discount, blurb, sort_order) values
${tierRows.join(",\n")}
on conflict (slug) do nothing;

insert into public.products
  (sku, handle, title, category_slug, manifest, condition, retail_value_usd, price_usd, units, cost_per_unit_usd, availability, images, sort_order)
values
${productRows.join(",\n")}
on conflict (handle) do nothing;
`;

writeFileSync(join(ROOT, "supabase/seed.sql"), sql);
console.log(`Wrote supabase/seed.sql: ${products.length} products + ${dealTiers.length} deal tiers.`);
