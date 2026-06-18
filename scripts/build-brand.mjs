// Generates the brand raster assets from SVG: public/favicon.png and public/og-image.png.
// Run: node scripts/build-brand.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = join(ROOT, "public");

// --- favicon.png (256) from the SVG mark (shapes only — no font dependency) ---
const favSvg = readFileSync(join(PUB, "favicon.svg"));
await sharp(favSvg, { density: 384 }).resize(256, 256).png({ compressionLevel: 9 }).toFile(join(PUB, "favicon.png"));

// --- og-image.png (1200x630) — navy/gold brand card ---
const box = `<g fill="none" stroke="#d3ad36" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">
  <path d="M32 12 50 22 50 42 32 52 14 42 14 22Z"/><path d="M14 22 32 32 50 22"/><path d="M32 32 32 52"/></g>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#0e2148"/><stop offset="1" stop-color="#14264f"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#c9a227"/>
  <g transform="translate(96,140)">
    <rect width="120" height="120" rx="26" fill="#0b1730"/>
    <g transform="translate(60,60) scale(2.2) translate(-32,-32)">${box}</g>
  </g>
  <text x="96" y="360" font-family="sans-serif" font-size="60" font-weight="800" fill="#ffffff">Liquidation Pallet <tspan fill="#d3ad36">Deals</tspan></text>
  <text x="98" y="416" font-family="sans-serif" font-size="30" font-weight="500" fill="#c4d2e7">Wholesale liquidation pallets &#8212; new arrivals daily</text>
  <g transform="translate(98,452)">
    <rect width="420" height="58" rx="29" fill="#c9a227"/>
    <text x="210" y="38" text-anchor="middle" font-family="sans-serif" font-size="27" font-weight="800" fill="#14264f">82% OFF MSRP OR MORE</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(join(PUB, "og-image.png"));

const fav = await sharp(join(PUB, "favicon.png")).metadata();
const ogm = await sharp(join(PUB, "og-image.png")).metadata();
console.log(`favicon.png ${fav.width}x${fav.height}; og-image.png ${ogm.width}x${ogm.height}`);
