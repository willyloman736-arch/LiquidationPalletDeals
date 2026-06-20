// Restores the previously-removed out-of-stock lots and marks EVERY product
// in-stock. Combined = original catalog + imported lots, all availability=in-stock.
import { readFileSync, writeFileSync } from "node:fs";

const orig = JSON.parse(readFileSync("import/orig-pallets.json", "utf8"));
const cur = JSON.parse(readFileSync("src/data/pallets.json", "utf8"));
const origHandles = new Set(orig.map((p) => p.handle));
const imported = cur.filter((p) => !origHandles.has(p.handle));

const seen = new Set();
const final = [];
for (const p of [...orig, ...imported]) {
  if (seen.has(p.handle)) continue;
  seen.add(p.handle);
  final.push({ ...p, availability: "in-stock" });
}

writeFileSync("src/data/pallets.json", JSON.stringify(final, null, 2) + "\n");
const byCat = {};
final.forEach((p) => (byCat[p.categorySlug] = (byCat[p.categorySlug] || 0) + 1));
console.log(`Wrote ${final.length} products — all in-stock: ${final.every((p) => p.availability === "in-stock")}`);
console.log(`(restored ${orig.length} original + ${imported.length} imported)`);
console.log("by category:", JSON.stringify(byCat));
console.log("any out-of-stock left:", final.filter((p) => p.availability !== "in-stock").length);
