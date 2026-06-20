// Merges mapped fields + voice (title/summary) and appends to src/data/pallets.json.
import { readFileSync, writeFileSync } from "node:fs";

const existing = JSON.parse(readFileSync("src/data/pallets.json", "utf8"));
const mapped = JSON.parse(readFileSync("import/mapped.json", "utf8"));
const voice = JSON.parse(readFileSync("import/voice.json", "utf8"));
const vmap = new Map(voice.map((v) => [v.handle, v]));

const newEntries = mapped.map((m) => {
  const v = vmap.get(m.handle);
  if (!v) throw new Error("no voice for " + m.handle);
  if (!m.images || m.images.length === 0) throw new Error("no images for " + m.handle);
  return {
    sku: m.sku,
    handle: m.handle,
    title: v.title.trim(),
    categorySlug: m.categorySlug,
    manifest: m.manifest,
    condition: m.condition,
    retailValueUsd: m.retailValueUsd,
    priceUsd: m.priceUsd,
    units: m.units,
    costPerUnitUsd: m.costPerUnitUsd,
    availability: m.availability,
    images: m.images,
    summary: v.summary.trim(),
  };
});

const combined = existing.concat(newEntries);
const handles = combined.map((e) => e.handle);
const dups = [...new Set(handles.filter((h, i) => handles.indexOf(h) !== i))];
if (dups.length) throw new Error("duplicate handles: " + dups.join(", "));

writeFileSync("src/data/pallets.json", JSON.stringify(combined, null, 2) + "\n");
const byCat = {};
combined.forEach((e) => (byCat[e.categorySlug] = (byCat[e.categorySlug] || 0) + 1));
console.log(`existing ${existing.length} + new ${newEntries.length} = ${combined.length} total products`);
console.log("by category:", JSON.stringify(byCat));
console.log("flat-priced (no discount) new lots:", newEntries.length);
