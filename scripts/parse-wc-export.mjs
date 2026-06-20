// Parses a WooCommerce product-export CSV into structured JSON.
// Usage: node scripts/parse-wc-export.mjs "<path-to-csv>"
import { readFileSync, writeFileSync } from "node:fs";

const path = process.argv[2];
if (!path) { console.error("Pass the CSV path."); process.exit(1); }

let text = readFileSync(path, "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM

// RFC-4180-ish parser: handles quotes, "" escapes, embedded commas/newlines.
function parseCSV(s) {
  const rows = []; let row = [], field = "", inQ = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* skip */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCSV(text);
const header = rows[0].map((h) => h.trim());
const idx = (name) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());

const col = {
  id: idx("ID"), type: idx("Type"), sku: idx("SKU"), name: idx("Name"),
  published: idx("Published"), featured: idx("Is featured?"),
  shortDesc: idx("Short description"), desc: idx("Description"),
  inStock: idx("In stock?"), stock: idx("Stock"),
  sale: idx("Sale price"), regular: idx("Regular price"),
  categories: idx("Categories"), tags: idx("Tags"), images: idx("Images"),
};

const products = rows.slice(1).filter((r) => r.length > 1 && (r[col.name] || "").trim()).map((r) => ({
  id: r[col.id], type: r[col.type], sku: (r[col.sku] || "").trim(),
  name: (r[col.name] || "").trim(),
  published: r[col.published], featured: r[col.featured],
  shortDesc: (r[col.shortDesc] || "").trim(),
  desc: (r[col.desc] || "").trim(),
  inStock: (r[col.inStock] || "").trim(),
  stock: (r[col.stock] || "").trim(),
  salePrice: (r[col.sale] || "").trim(),
  regularPrice: (r[col.regular] || "").trim(),
  categories: (r[col.categories] || "").trim(),
  tags: (r[col.tags] || "").trim(),
  images: (r[col.images] || "").split(",").map((s) => s.trim()).filter(Boolean),
}));

writeFileSync("import/wc-parsed.json", JSON.stringify(products, null, 2));

const strip = (h) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
console.log("Total products parsed:", products.length);
console.log("Types:", JSON.stringify(products.reduce((a, p) => ((a[p.type] = (a[p.type] || 0) + 1), a), {})));
console.log("In-stock values:", JSON.stringify(products.reduce((a, p) => ((a[p.inStock || "(blank)"] = (a[p.inStock || "(blank)"] || 0) + 1), a), {})));
const cats = {}; products.forEach((p) => p.categories.split(",").map((c) => c.trim()).filter(Boolean).forEach((c) => (cats[c] = (cats[c] || 0) + 1)));
console.log("Categories:", JSON.stringify(cats, null, 0));
console.log("With >=1 image:", products.filter((p) => p.images.length).length, " total images:", products.reduce((a, p) => a + p.images.length, 0));
console.log("\n=== sample (first 4) ===");
for (const p of products.slice(0, 4)) {
  console.log(`\n• [${p.type}] SKU=${p.sku || "—"}  ${p.name}`);
  console.log(`  price: regular=${p.regularPrice || "—"} sale=${p.salePrice || "—"}  stock=${p.stock || "—"} inStock=${p.inStock}`);
  console.log(`  cats: ${p.categories || "—"}  | tags: ${p.tags || "—"}`);
  console.log(`  imgs(${p.images.length}): ${p.images[0] || "—"}`);
  console.log(`  shortDesc: ${strip(p.shortDesc).slice(0, 160)}`);
  console.log(`  desc: ${strip(p.desc).slice(0, 220)}`);
}
