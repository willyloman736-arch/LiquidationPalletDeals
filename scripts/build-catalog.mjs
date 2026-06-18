// Builds the full catalog from the extracted collection-page JSON:
//  - merges + dedupes every lot/item across pages 1-6 (+ cosmetics enrichment)
//  - classifies each into a category by title keywords
//  - optimizes its 1-2 source photos into public/images/products/<id>-<n>.webp
//  - drops anything without a usable image or price/retail/units
//  - writes the final app catalog to src/data/pallets.json (with real image paths)
// Run: node scripts/build-catalog.mjs   (downloads must already be in _recon/assets)
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "_recon", "assets");
const EXT = join(ROOT, "_recon", "extracted");
const PRODUCTS_DIR = join(ROOT, "public", "images", "products");
mkdirSync(PRODUCTS_DIR, { recursive: true });

const SOURCES = [
  "products-all.json", // page 1
  "products-page-2.json",
  "products-page-3.json",
  "products-page-4.json",
  "products-page-5.json",
  "products-page-6.json",
  "products-cosmetics.json", // manifest enrichment
];

const all = [];
for (const f of SOURCES) {
  const p = join(EXT, f);
  if (!existsSync(p)) {
    console.warn("! missing", f);
    continue;
  }
  const data = JSON.parse(readFileSync(p, "utf8"));
  if (Array.isArray(data.products)) all.push(...data.products);
}

const num = (x) => {
  const n = typeof x === "number" ? x : parseFloat(String(x ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const slugify = (s) =>
  String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function normManifest(m) {
  if (!m) return "unmanifested";
  const s = String(m).toLowerCase();
  if (s.includes("partial")) return "partially";
  if (s.includes("fully") || s === "manifested") return "fully";
  return "unmanifested";
}
function normCondition(c) {
  if (!c) return "mos";
  const s = String(c).toLowerCase();
  if (s.includes("first quality") || s.includes("1st")) return "first-quality";
  if (s.includes("shelf")) return "shelf-pull";
  if (s.includes("return")) return "customer-return";
  if (s.includes("new")) return "new";
  return "mos";
}

// Title-keyword -> category classifier. Ordered: more specific signals first.
function classify(title, sku) {
  if (/^arp/i.test(sku || "")) return "apparel";
  const t = (title || "").toLowerCase();
  const ordered = [
    ["health-beauty", /(cosmetic|fragrance|perfume|cologne|skincare|skin care|makeup|make-up|mascara|lipstick|nail polish|\bserum|moisturizer|\bbeauty)/],
    ["electronics", /(iphone|phone case|ear ?bud|head ?phone|\bspeaker|charger|charging|\bcable|bluetooth|\baudio|smart ?watch|electronic|power bank|keyboard|\bwebcam|\btablet\b|\btech\b)/],
    ["furniture", /(furniture|mattress|\bsofa|\bcouch|\bfuton|recliner|sectional|loveseat|love seat|armchair|\bchair\b|dresser|nightstand|night stand|headboard|bed frame|bedroom|\bdesk\b|bookcase|book ?shelf|wardrobe|armoire|ottoman|\bbench\b|console table|side table|coffee table|end table|\bcredenza|\bcabinet|\bstool\b|\bottoman)/],
    ["houseware", /(bedding|comforter|\bduvet|\bquilt|\bsheet|pillow|\bsham|blanket|\btowel|kitchen|cookware|bakeware|tableware|dinnerware|flatware|cutlery|\bmug|glassware|\bcandle|picture frame|\bframe|home ?decor|décor|\brug\b|\blighting|\blamp|\bvase|\bthrow|curtain|wall art|placemat|napkin|organizer)/],
    ["apparel", /(clothing|apparel|footwear|\bshoe|sneaker|\bboot|\bshirt|t-shirt|\btee\b|hoodie|sweatshirt|sweater|\bjacket|\bcoat|\bpant|\bjean|legging|\bdress|\bsock|\bhat\b|scarf|\bglove|\bbelt|intimates|underwear|lingerie|swimwear|activewear)/],
    ["general-merchandise", /(\bbook|garden|\bplant|outdoor|patio|holiday|seasonal|christmas|halloween|easter|garland|wreath|ornament|\bsport|\bgame|\btoy|puzzle|stationery|\boffice|\bpet\b|automotive|\btool|hardware|\bparty)/],
  ];
  for (const [cat, rx] of ordered) if (rx.test(t)) return cat;
  return "general-merchandise";
}

// Dedupe by SKU (or handle when no SKU), filling missing fields.
const map = new Map();
for (const p of all) {
  const key = (p.sku ? String(p.sku).trim().toUpperCase() : "H:" + (p.handle || slugify(p.title)));
  if (!map.has(key)) {
    map.set(key, { ...p });
    continue;
  }
  const e = map.get(key);
  for (const k of ["priceUsd", "retailUsd", "units", "costPerUnitUsd", "condition", "manifest", "title", "handle", "availability"]) {
    if ((e[k] == null || e[k] === "") && p[k] != null && p[k] !== "") e[k] = p[k];
  }
  if (p.manifest && /partial|fully/i.test(p.manifest)) e.manifest = p.manifest;
  const eImgs = (e.imageFiles || []).filter(Boolean);
  const pImgs = (p.imageFiles || []).filter(Boolean);
  if (pImgs.length > eImgs.length) e.imageFiles = pImgs;
}

async function toWebp(srcName, destRel) {
  const src = join(SRC, srcName);
  if (!existsSync(src)) return false;
  try {
    await sharp(src).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(ROOT, "public", destRel));
    return true;
  } catch {
    return false;
  }
}

const out = [];
const skipped = [];
let imgOk = 0;
let imgFail = 0;

for (const p of map.values()) {
  const retail = num(p.retailUsd);
  const price = num(p.priceUsd);
  const units = num(p.units);
  const imageFiles = (p.imageFiles || []).filter(Boolean).slice(0, 2);
  if (!imageFiles.length || !retail || !price || !units) {
    skipped.push(`${p.sku || p.handle} (${!imageFiles.length ? "no-image" : "missing-price/units"})`);
    continue;
  }
  const id = p.sku ? String(p.sku).trim().toUpperCase() : slugify(p.handle || p.title);
  const images = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const rel = `images/products/${id}-${i + 1}.webp`;
    const ok = await toWebp(imageFiles[i], rel);
    if (ok) {
      images.push("/" + rel);
      imgOk++;
    } else {
      imgFail++;
    }
  }
  if (!images.length) {
    skipped.push(`${p.sku || p.handle} (image-optimize-failed)`);
    continue;
  }
  out.push({
    sku: p.sku || null,
    handle: p.handle || `${slugify(p.title)}-${id.toLowerCase()}`,
    title: p.title,
    categorySlug: classify(p.title, p.sku),
    manifest: normManifest(p.manifest),
    condition: normCondition(p.condition),
    retailValueUsd: retail,
    priceUsd: price,
    units: Math.round(units),
    costPerUnitUsd: num(p.costPerUnitUsd) ?? Math.round((price / units) * 100) / 100,
    availability: p.availability === "out-of-stock" ? "out-of-stock" : "in-stock",
    images,
  });
}

// De-dupe handles (routing slug must be unique).
const seenHandle = new Map();
for (const p of out) {
  if (seenHandle.has(p.handle)) p.handle = `${p.handle}-${(p.sku || "x").toLowerCase()}`;
  seenHandle.set(p.handle, true);
}

writeFileSync(join(ROOT, "src", "data", "pallets.json"), JSON.stringify(out, null, 2) + "\n");

const dist = {};
for (const p of out) dist[p.categorySlug] = (dist[p.categorySlug] || 0) + 1;
console.log(`Catalog written: ${out.length} lots/items (from ${all.length} extracted rows).`);
console.log("Images optimized:", imgOk, "ok,", imgFail, "failed.");
console.log("By category:", dist);
if (skipped.length) console.log(`Skipped ${skipped.length}:`, skipped.slice(0, 50).join(", "));
