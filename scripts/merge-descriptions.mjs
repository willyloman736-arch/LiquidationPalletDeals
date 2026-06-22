// Merges per-batch description outputs back into src/data/pallets.json,
// validates coverage, regenerates seed.sql, and writes an UPDATE script
// for Supabase. Run after the description-generation workflow completes.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const batches = JSON.parse(readFileSync("import/desc-batches.json", "utf8"));
const products = JSON.parse(readFileSync("src/data/pallets.json", "utf8"));

const all = [];
const failed = [];
for (const b of batches) {
  const path = `import/desc-out-${b.idx}.json`;
  if (!existsSync(path)) { failed.push({ batch: b.idx, reason: "file missing" }); continue; }
  try {
    const data = JSON.parse(readFileSync(path, "utf8"));
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length !== b.count) {
      failed.push({ batch: b.idx, reason: `expected ${b.count}, got ${items.length}` });
    }
    all.push(...items);
  } catch (e) {
    failed.push({ batch: b.idx, reason: "JSON parse failure: " + e.message });
  }
}

const byHandle = new Map(all.map((x) => [x.handle, x]));
const missing = [];
const wordCounts = [];
const outOfRange = [];

for (const p of products) {
  const item = byHandle.get(p.handle);
  if (!item) { missing.push(p.handle); continue; }
  const words = item.description.trim().split(/\s+/).length;
  wordCounts.push(words);
  if (words < 70 || words > 140) outOfRange.push({ handle: p.handle, words });
  p.summary = item.description.trim();
}

const lengths = wordCounts.length
  ? { min: Math.min(...wordCounts), max: Math.max(...wordCounts), avg: Math.round(wordCounts.reduce((a, n) => a + n, 0) / wordCounts.length) }
  : null;

console.log(`Batches processed: ${batches.length}; failed: ${failed.length}`);
if (failed.length) failed.slice(0, 5).forEach((f) => console.log(`  - batch ${f.batch}: ${f.reason}`));
console.log(`Products with descriptions: ${products.length - missing.length} / ${products.length}`);
if (missing.length) console.log(`MISSING (${missing.length}): ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}`);
console.log(`Word counts — min: ${lengths?.min}, max: ${lengths?.max}, avg: ${lengths?.avg}`);
if (outOfRange.length) console.log(`Out of 70–140 range: ${outOfRange.length}`);

if (missing.length === 0 && failed.length === 0) {
  writeFileSync("src/data/pallets.json", JSON.stringify(products, null, 2) + "\n");
  console.log("✓ Wrote src/data/pallets.json");

  // Supabase UPDATE script — escape single quotes, one statement per row.
  const esc = (s) => s.replace(/'/g, "''");
  const sql = [
    "-- Update product summaries on the live Supabase database.",
    "-- Run this in Supabase → SQL Editor after the code push deploys.",
    "begin;",
    ...products.map((p) => `update public.products set summary = '${esc(p.summary)}' where handle = '${esc(p.handle)}';`),
    "commit;",
    "",
  ].join("\n");
  writeFileSync("import/update-summaries.sql", sql);
  console.log(`✓ Wrote import/update-summaries.sql (${products.length} UPDATE statements)`);
} else {
  console.log("⚠️  Not writing — fix coverage first.");
  process.exit(1);
}
