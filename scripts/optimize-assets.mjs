// Optimizes the staged wholesale101 source assets (_recon/assets) into right-sized
// WebP/PNG under public/, plus copies the hero video and SVG icons.
// Run: node scripts/optimize-assets.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "_recon", "assets");
const PUB = join(ROOT, "public");

const files = readdirSync(SRC);
const byPrefix = (prefix) => files.find((f) => f.startsWith(prefix));
const ensure = (p) => mkdirSync(dirname(p), { recursive: true });

let made = 0;
let missing = 0;

async function toWebp(srcName, destRel, width, opts = {}) {
  if (!srcName) {
    console.warn(`! no source for ${destRel}`);
    missing++;
    return;
  }
  const src = join(SRC, srcName);
  if (!existsSync(src)) {
    console.warn(`! missing source file ${srcName} for ${destRel}`);
    missing++;
    return;
  }
  const dest = join(PUB, destRel);
  ensure(dest);
  let img = sharp(src).rotate(); // respect EXIF orientation on iOS photos
  if (opts.cover) {
    img = img.resize(width, opts.height ?? Math.round(width * 0.75), { fit: "cover", position: "centre" });
  } else {
    img = img.resize({ width, withoutEnlargement: true });
  }
  await img.webp({ quality: opts.quality ?? 80 }).toFile(dest);
  made++;
}

async function toPng(srcName, destRel, width, opts = {}) {
  if (!srcName) {
    console.warn(`! no source for ${destRel}`);
    missing++;
    return;
  }
  const src = join(SRC, srcName);
  if (!existsSync(src)) {
    console.warn(`! missing source file ${srcName} for ${destRel}`);
    missing++;
    return;
  }
  const dest = join(PUB, destRel);
  ensure(dest);
  let img = sharp(src).rotate();
  if (opts.cover) img = img.resize(width, opts.height ?? width, { fit: "cover", position: "centre" });
  else img = img.resize({ width, withoutEnlargement: true });
  await img.png({ compressionLevel: 9 }).toFile(dest);
  made++;
}

function copyRaw(srcName, destRel) {
  if (!srcName) {
    console.warn(`! no source for ${destRel}`);
    missing++;
    return;
  }
  const src = join(SRC, srcName);
  if (!existsSync(src)) {
    console.warn(`! missing source file ${srcName} for ${destRel}`);
    missing++;
    return;
  }
  const dest = join(PUB, destRel);
  ensure(dest);
  copyFileSync(src, dest);
  made++;
}

// Product photos are handled by scripts/build-catalog.mjs (named by SKU/handle).

// ---- Category tiles ----
const categoryMap = {
  apparel: "ARP206-3",
  electronics: "G51779-4",
  furniture: "King_5",
  "general-merchandise": "G51642-3",
  "health-beauty": "20240521_190750000_iOS",
  houseware: "20240507_144122000_iOS",
  "mixed-pallets": "OT_Pallets",
};
async function categoriesArt() {
  for (const [slug, prefix] of Object.entries(categoryMap)) {
    await toWebp(byPrefix(prefix), `images/categories/${slug}.webp`, 1200, { cover: true, height: 900, quality: 80 });
  }
}

// ---- Brand + marketing ----
async function brand() {
  await toWebp(byPrefix("Wholesale_logo_2.0"), "images/brand/logo.webp", 480, { quality: 90 });
  await toWebp(byPrefix("wholesale101-logo"), "images/brand/logo-footer.webp", 480, { quality: 90 });
  await toPng(byPrefix("Tag_2"), "favicon.png", 256);
  await toPng(byPrefix("W101_Logo_Social"), "og-image.png", 1200, { cover: true, height: 630 });
  copyRaw(byPrefix("Magnify_Glass"), "images/brand/search.svg");
}

async function marketing() {
  await toWebp(byPrefix("dji_fly_2024_1"), "images/marketing/hero-aerial.webp", 1920, { quality: 82 });
  await toWebp(byPrefix("Slide_3-4"), "images/marketing/hero-warehouse.webp", 1920, { quality: 82 });
  await toWebp(byPrefix("OT_Pallets"), "images/marketing/pallets.webp", 1600, { quality: 82 });
  await toWebp(byPrefix("DJI_0098"), "images/marketing/aerial-yard.webp", 1600, { quality: 82 });
  await toWebp(byPrefix("DJI_0121-1"), "images/marketing/aerial-facility.webp", 1600, { quality: 82 });
  await toWebp(byPrefix("NEJ_Exterior"), "images/marketing/facility.webp", 1400, { quality: 82 });
  await toWebp(byPrefix("bbb_"), "images/marketing/bbb-accredited.webp", 600, { quality: 85 });
  await toWebp(byPrefix("20240523_193501000_iOS"), "images/marketing/feature-inspection.webp", 1400, { quality: 82 });
  await toWebp(byPrefix("20240604_200414000_iOSa"), "images/marketing/feature-brands.webp", 1400, { quality: 82 });
  // Hero video + poster
  copyRaw(byPrefix("0b1336be") && files.find((f) => f.endsWith(".mp4")), "videos/hero.mp4");
  const poster = files.find((f) => f.includes("thumbnail.0000000000.jpg"));
  await toWebp(poster, "images/marketing/hero-poster.webp", 1280, { quality: 80 });
}

async function main() {
  await categoriesArt();
  await brand();
  await marketing();
  console.log(`\nDone. ${made} brand/category/marketing assets written, ${missing} missing.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
