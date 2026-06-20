// Maps parsed WooCommerce products (import/wc-parsed.json) to our catalog schema.
// Deterministic fields only; title + summary are rewritten in-voice later.
import { readFileSync, writeFileSync } from "node:fs";

const ps = JSON.parse(readFileSync("import/wc-parsed.json", "utf8"));
const existing = JSON.parse(readFileSync("src/data/pallets.json", "utf8"));

const strip = (h) =>
  h.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#8217;|&#039;|&rsquo;/g, "'")
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, "-").replace(/&quot;/g, '"')
    .replace(/\s+/g, " ").trim();
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

function mapCategory(catStr) {
  const c = catStr.toLowerCase();
  const has = (s) => c.includes(s);
  if (has("apparel") || has("footwear")) return "apparel";
  if (has("cosmetics") || has("beauty")) return "health-beauty";
  if (has("electronics")) return "electronics";
  if (has("home & kitchen") || has("kitchen")) return "houseware";
  if (has("furniture")) return "furniture";
  if (has("toys") || has("baby") || has("food") || has("beverage") || has("general merchandise")) return "general-merchandise";
  if (has("mixed lots")) return "mixed-pallets";
  return "general-merchandise";
}
const brandOf = (catStr) => {
  const m = catStr.match(/Shop by Store > ([^,]+?) Pallets/i);
  return m ? m[1].trim() : null;
};
function inferCondition(t) {
  t = t.toLowerCase();
  if (/return|mystery|\bmail\b|lpn|salvage/.test(t)) return "customer-return";
  if (/overstock|shelf|essentials|in-house|house brand|brand[- ]new|\bnew\b|first quality|first-quality/.test(t)) return "shelf-pull";
  return "customer-return";
}
function inferUnits(t) {
  const re = /([\d][\d,]*)\s*(?:-\s*([\d,]+)\s*)?(pairs?|pieces?|pcs|units?|items?|sets?)\b/gi;
  let best = 0, m;
  while ((m = re.exec(t))) {
    const lo = parseInt(m[1].replace(/,/g, ""), 10);
    const hi = m[2] ? parseInt(m[2].replace(/,/g, ""), 10) : lo;
    const v = Math.round((lo + hi) / 2);
    if (v > best && v < 100000) best = v;
  }
  return best > 1 ? best : 1;
}

const seen = new Set(existing.map((p) => p.handle));
function uniqueHandle(base, sku, i) {
  let h = slugify(base) || "pallet";
  if (seen.has(h)) h = slugify(`${base}-${sku || "lot-" + i}`);
  let hh = h, n = 2;
  while (seen.has(hh)) hh = slugify(`${h}-${n++}`);
  seen.add(hh);
  return hh;
}

const out = [], skipped = [];
ps.forEach((p, i) => {
  const price = Number(p.regularPrice);
  if (!p.regularPrice || !Number.isFinite(price) || price <= 0) { skipped.push(strip(p.name)); return; }
  const name = strip(p.name);
  const desc = strip(p.desc);
  const text = `${name} ${desc}`;
  const units = inferUnits(text);
  const handle = uniqueHandle(name, p.sku, i);
  out.push({
    _source: { name, shortDesc: strip(p.shortDesc), desc: desc.slice(0, 1400), brand: brandOf(p.categories), categories: p.categories, price, origImages: p.images },
    sku: (p.sku || "").trim() || null,
    handle,
    title: name,
    categorySlug: mapCategory(p.categories),
    manifest: "unmanifested",
    condition: inferCondition(text),
    retailValueUsd: price, // no fabricated MSRP — flat-priced
    priceUsd: price,
    units,
    costPerUnitUsd: Math.round((price / Math.max(1, units)) * 100) / 100,
    availability: "in-stock",
    images: p.images.map((_, j) => `/images/savemore/${handle}-${j + 1}.webp`),
    featured: false,
    summary: "",
  });
});

writeFileSync("import/mapped.json", JSON.stringify(out, null, 2));
const byCat = {}; out.forEach((o) => (byCat[o.categorySlug] = (byCat[o.categorySlug] || 0) + 1));
const lots = out.filter((o) => o.units > 1).length;
console.log(`Mapped: ${out.length}   skipped(no price): ${skipped.length}`);
console.log("By category:", JSON.stringify(byCat));
console.log(`Multi-unit lots: ${lots}   single-pallet: ${out.length - lots}`);
console.log(`Total images to fetch: ${out.reduce((a, o) => a + o.images.length, 0)}`);
console.log("Skipped (no price):", skipped.join(" | "));
