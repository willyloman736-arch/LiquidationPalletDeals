// Slices src/data/pallets.json into per-batch input files for the description
// generation workflow. Each agent reads ONE batch file (prevents the slice
// hallucinations we saw in the original Save More rewrite).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const BATCH_SIZE = 15;
const products = JSON.parse(readFileSync("src/data/pallets.json", "utf8"));

const CATEGORY_NAMES = {
  apparel: "Apparel",
  electronics: "Consumer Electronics",
  furniture: "Furniture",
  "general-merchandise": "General Merchandise",
  "health-beauty": "Health & Beauty",
  houseware: "Houseware",
  "mixed-pallets": "Mixed Pallets",
};
const CONDITION_NAMES = {
  new: "New",
  mos: "Past Season Transfers",
  "first-quality": "First Quality",
  "shelf-pull": "Shelf Pull",
  "customer-return": "Customer Return",
};
const MANIFEST_NAMES = {
  fully: "Fully manifested",
  partially: "Partially manifested",
  unmanifested: "Unmanifested",
};

const slimmed = products.map((p) => ({
  handle: p.handle,
  title: p.title,
  category: CATEGORY_NAMES[p.categorySlug] ?? p.categorySlug,
  condition: CONDITION_NAMES[p.condition] ?? p.condition,
  manifest: MANIFEST_NAMES[p.manifest] ?? p.manifest,
  units: p.units,
  retailValue: p.retailValueUsd,
  price: p.priceUsd,
  costPerUnit: p.costPerUnitUsd,
  hasDiscount: p.retailValueUsd > p.priceUsd,
  existingSummary: p.summary ?? null,
}));

mkdirSync("import", { recursive: true });

const batches = [];
for (let i = 0; i < slimmed.length; i += BATCH_SIZE) {
  const batch = slimmed.slice(i, i + BATCH_SIZE);
  const idx = batches.length;
  writeFileSync(`import/desc-batch-${idx}.json`, JSON.stringify(batch, null, 1));
  batches.push({ idx, start: i, end: i + batch.length, count: batch.length });
}

writeFileSync("import/desc-batches.json", JSON.stringify(batches, null, 2));
console.log(`Wrote ${batches.length} batch files; ${slimmed.length} products total.`);
