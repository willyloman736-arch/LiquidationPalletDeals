// Google Merchant Center product feed (RSS 2.0 + Google Merchant namespace).
// Submit this URL in Merchant Center → Products → Feeds → Scheduled fetch:
//   https://www.liquidationspalletdeals.com/feed/products.xml
// Refetches catalog every 1 hour via ISR; Google's scheduled fetch can run daily.

import { allPallets } from "@/data/pallets";
import { site } from "@/lib/site";

export const revalidate = 3600; // 1h ISR — Google polls daily; this stays fresh

// Map our internal categories → Google Product Category (numeric IDs from
// https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt).
// Pallet inventory is "Business & Industrial > Retail" by default; product-specific
// categories give Google more signal where the category is obvious.
const GOOGLE_CATEGORY: Record<string, number> = {
  apparel: 166,             // Apparel & Accessories
  electronics: 222,         // Electronics
  furniture: 436,           // Furniture
  "health-beauty": 469,     // Health & Beauty
  houseware: 536,           // Home & Garden
  "general-merchandise": 5181, // Business & Industrial > Retail
  "mixed-pallets": 5181,
};

// Map our condition slugs → Google's allowed condition values.
// Past Season Transfers and First Quality are unsold retail-ready inventory → "new".
// Shelf pulls and customer returns → "used".
const GOOGLE_CONDITION: Record<string, "new" | "used" | "refurbished"> = {
  new: "new",
  mos: "new",
  "first-quality": "new",
  "shelf-pull": "used",
  "customer-return": "used",
};

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Safe CDATA — break up `]]>` if it appears in the body.
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

const absoluteUrl = (u: string) => (/^https?:\/\//i.test(u) ? u : `${site.url}${u}`);

const trim = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s);

export async function GET() {
  const pallets = await allPallets();
  const buildDate = new Date().toUTCString();

  const items = pallets
    .map((p) => {
      const cat = GOOGLE_CATEGORY[p.categorySlug] ?? GOOGLE_CATEGORY["general-merchandise"];
      const cond = GOOGLE_CONDITION[p.condition] ?? "used";
      const link = `${site.url}/pallets/${p.handle}`;
      const mainImg = p.images?.[0] ? absoluteUrl(p.images[0]) : "";
      const additionalImgs = (p.images ?? [])
        .slice(1, 11) // Google allows up to 10 additional images
        .map((u) => `      <g:additional_image_link>${xmlEscape(absoluteUrl(u))}</g:additional_image_link>`)
        .join("\n");
      const description = p.summary && p.summary.trim() ? p.summary : p.blurb;
      const handlingMin = 1;
      const handlingMax = 5;

      return `    <item>
      <g:id>${xmlEscape(p.handle)}</g:id>
      <g:title>${cdata(trim(p.title, 150))}</g:title>
      <g:description>${cdata(trim(description, 5000))}</g:description>
      <g:link>${xmlEscape(link)}</g:link>
      <g:image_link>${xmlEscape(mainImg)}</g:image_link>
${additionalImgs}
      <g:availability>${p.availability === "in-stock" ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.priceUsd.toFixed(2)} USD</g:price>
      <g:brand>${xmlEscape(site.legalName)}</g:brand>
      <g:condition>${cond}</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${cat}</g:google_product_category>
      <g:product_type>${cdata(p.categoryName)}</g:product_type>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>LTL Freight (quoted)</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
      <g:shipping_label>quoted-ltl</g:shipping_label>
      <g:max_handling_time>${handlingMax}</g:max_handling_time>
      <g:min_handling_time>${handlingMin}</g:min_handling_time>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${cdata(site.legalName)}</title>
    <link>${xmlEscape(site.url)}</link>
    <description>${cdata(site.description)}</description>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
