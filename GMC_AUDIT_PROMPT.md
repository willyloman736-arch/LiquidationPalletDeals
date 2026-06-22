# Google Merchant Center — Master Audit & Fix Prompt

A reusable prompt for getting any e-commerce site approved on Google Merchant Center (Shopping ads + Free Listings) without rejections. Distilled from a full GMC audit + fixes performed on liquidationspalletdeals.com (June 2026).

## How to use this

Open a new Claude conversation, paste the entire `## The Prompt` section below, and replace `[YOUR-SITE-URL]` with the site you want audited. Claude will run a thorough audit, produce a report, and wait for your approval before applying any fixes.

Keep this file in your repo for every site you submit. Re-run the audit any time the catalog or policies change.

---

## The Prompt

> **Role:** You are a Google Merchant Center compliance auditor and full-stack engineer. Your job is to get `[YOUR-SITE-URL]` approved on Google Merchant Center (Shopping ads + Free Listings) without rejection.
>
> **Operating principles:**
> 1. **Audit first, fix second.** Do not change anything until I confirm the audit findings.
> 2. **Use the Workflow tool** for the audit. Fan out specialist agents in parallel (one per policy dimension below), then synthesize a single ranked report.
> 3. **Verify findings adversarially** before flagging blockers — false positives waste my time.
> 4. **Ground everything in actual current Google policies** (URLs below) plus the lessons-learned checklist that follows.
> 5. **Be specific.** Cite policy section + on-site evidence (URL, quoted text, JSON-LD field) + a concrete fix outline for every finding.
> 6. **Never invent or fabricate** reviews, MSRPs, brand affiliations, BBB badges, certifications, customer testimonials, or social proof.
>
> ### Phase 1 — Read current Google policies
> Use WebFetch on each URL and produce a structured summary of every rule, restricted category, required website element, technical requirement, and approval criterion. Do not paraphrase loosely — be specific. Do not import policy knowledge from outside these pages:
>
> - https://support.google.com/merchants/answer/6149970?hl=en (Merchant Center policies overview)
> - https://support.google.com/merchants/answer/12073010?hl=en (Shopping ads + Free Listings policies)
> - https://support.google.com/merchants/answer/12756116?hl=en (Website-level requirements)
> - https://support.google.com/merchants/answer/7052112?hl=en (Product data specification — for attribute requirements)
> - https://support.google.com/merchants/answer/12247898?hl=en (Returns + refunds website requirements)
>
> ### Phase 2 — Audit `[YOUR-SITE-URL]` across 6 dimensions (parallel agents)
>
> Each agent inspects the live site, returns a structured findings list with: rule, policy source, status (compliant / partial / noncompliant / risk / unknown), evidence quote/URL, impact (blocker / high / medium / low), and concrete fix outline.
>
> **Dimension 1 — Website policies & required pages**
> - Privacy Policy, Terms of Service, Shipping Policy, Refund & Return Policy, Warranty Policy — each as a real reachable page (not a modal, not "see FAQ").
> - All five linked **from the footer on every page** (audit the rendered HTML across multiple routes, not just the homepage).
> - Return policy must explicitly state: (a) the return window in days, (b) what is and isn't covered, (c) restocking fee (or explicit "no restocking fee"), (d) how to file a claim, (e) resolution options.
> - "All sales final" with no claim window is grounds for disapproval.
> - Contact info: **at least two concrete contact methods** (email + phone + physical address ideally — minimum two). Address must include ZIP. No placeholder values like `[insert email]`.
> - Legal docs must have a recent "Last Updated" date that matches the actual content.
> - Business identity consistent across pages (no parent-entity language that contradicts the live brand).
>
> **Dimension 2 — Product data quality & required attributes**
> - Pull 5–8 real product pages via WebFetch. Inspect the JSON-LD `Product` schema on each.
> - Required Product attributes per Google's spec: `name`, `image` (absolute URL that resolves), `description` (75+ words ideal), `brand`, `sku` or `mpn` or `gtin` (at least one identifier), `offers.priceCurrency`, `offers.price`, `offers.availability`, `offers.itemCondition`.
> - `hasMerchantReturnPolicy` should be present with `applicableCountry`, `returnPolicyCategory`, `merchantReturnDays`, `returnMethod`, `returnFees`, and `restockingFee` (use `$0` MonetaryAmount if no fee).
> - `shippingDetails` should include `shippingDestination`, `shippingRate`, `deliveryTime.handlingTime`, `deliveryTime.transitTime`.
> - `priceValidUntil` (ISO date) should be set ~30 days out for fresh-feeling listings.
> - `itemCondition` must map to one of: `https://schema.org/NewCondition`, `UsedCondition`, `RefurbishedCondition`, `DamagedCondition`.
> - Image URLs must be absolute (`https://...`) and return 200 with `Content-Type: image/*`. Common bug: prepending site URL to an already-absolute CDN URL produces malformed `https://example.comhttps://cdn.com/...` — verify there's no double-prefix.
> - Product titles should NOT use third-party brand names on goods that aren't authenticated chain-of-custody from that brand. Strip "Authentic Nike", "Authentic Jordan", brand-name-on-customer-returns titles, etc.
> - Title-to-content consistency: if title says "650 units" and detail says "1000 units", that's grounds for disapproval.
>
> **Dimension 3 — Checkout, payments, purchase process**
> - **Google requires a real on-site checkout that completes a transaction with a conventional payment method** (credit/debit card, PayPal, Google Pay, Apple Pay through a card processor). Quote-only, mailto-only, or WhatsApp-only checkouts fail this requirement.
> - Test the actual flow: add to cart, fill checkout, attempt to complete. Does the site charge a card? If not, this is a Merchant Center blocker.
> - Prices and availability shown on product pages must match what shows in the cart and at checkout.
> - Shipping cost must be visible before order completion (not "quoted after").
> - Total, taxes, and shipping must be visible before the user is asked to commit.
> - Cart must persist; checkout must validate; success/error states must be clear.
>
> **Dimension 4 — Prohibited / restricted product categories**
> - Crawl the catalog and category pages. Quote exact product titles you find.
> - **Counterfeit risk:** branded items (Nike, Apple, iPhone, Louis Vuitton, etc.) sold as customer returns or unmanifested without chain-of-custody documentation are prohibited.
> - **Mystery / unmanifested boxes:** opaque inventory (return-mail mystery pallets, "Deluxe Mail", anonymous returns) require explicit disclosure of typical contents per Merchant Center's misrepresentation rules.
> - **Recalled goods, weapons, ammunition, recreational drugs, tobacco, vape, alcohol** (in restricted territories), and certain regulated supplements are prohibited or restricted — flag any catalog hits.
> - **Hygiene-sensitive customer returns:** opened cosmetics, perfume, hair-care, baby diapers, breast pumps, intimate apparel — typically must be excluded from a Merchant feed or explicitly disclosed.
> - **Food / pet food** as customer returns: expiration, recall, and safety exposure. Restricted.
> - **Repair-candidate electronics** ("untested" TVs, scooters, etc.): disclose condition clearly; consider excluding from the Merchant feed.
>
> **Dimension 5 — Misrepresentation & trust signals**
> - Unverifiable certifications (BBB Accredited, Google Trusted Store, ISO, etc.) displayed without a working verification link must be removed or proven.
> - Marketing superlatives ("100% inspected", "best prices guaranteed", "X years of experience") must not contradict the FAQ, Terms, or About page.
> - "Backed by [parent entity]" framing must reflect current legal reality.
> - Customer reviews displayed on-site must be real, attributable, and not fabricated. Placeholder reviews are a misrepresentation risk.
> - Free-shipping promos must be honored at checkout (not aspirational).
> - Business address, ZIP, phone, and email must be consistent across footer, contact, About, JSON-LD, legal docs, and metadata. No "Last Updated" stamps that predate material business changes (relocation, name change).
>
> **Dimension 6 — Technical & structured-data requirements**
> - **HTTPS everywhere**, valid certificate (not Cloudflare-default-cert + parked-domain placeholder).
> - `robots.txt` reachable and doesn't block Googlebot / AdsBot-Google.
> - `sitemap.xml` reachable, lists all product URLs, valid XML.
> - Canonical URLs set, no duplicate-content traps (`?ref=`, `?utm=` redirects).
> - Mobile-friendly: viewport meta, no horizontal scroll, tap targets ≥44px.
> - Core Web Vitals reasonable (LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile).
> - Organization JSON-LD with `name`, `url`, `logo`, `address`, `email`, `telephone` (in `contactPoint`), `sameAs` for socials.
> - Product JSON-LD as specified in Dimension 2.
> - Open Graph tags for social previews.
>
> ### Phase 3 — Adversarial verification
> Before declaring blocker/high findings, spawn an independent verifier per finding to re-check the live site. Mark `confirmed=false` if the verifier disagrees. Drop refuted findings from the final report.
>
> ### Phase 4 — Deliver report and wait
> Produce a single ranked report:
> - Overall verdict: `ready` / `minor-fixes-needed` / `major-fixes-needed` / `not-eligible`
> - One-line summary
> - Findings grouped by impact (blocker → high → medium → low) with area, rule, policy source, evidence, fix outline
> - Strategic notes paragraph: what's the biggest unlock, what's optional polish
>
> **Do not start fixing.** Wait for my explicit go-ahead per group. Ask me clarifying questions only when a fix involves a real business decision (return window length, brand-de-branding scope, legal entity changes, payment processor choice).
>
> ### Phase 5 — Apply fixes (only after my approval)
> Apply in priority order: blockers → highs → mediums → lows. After each batch:
> - Build + typecheck must be green
> - Curl-verify the rendered HTML on the live affected pages
> - Commit with a clear message
> - Push to deploy
> - Surface any required database / Supabase SQL migrations the user needs to run manually

---

## Lessons-learned checklist (apply to any site)

These are the specific fixes that consistently come up. Treat them as a "common audit findings" checklist that complements the policy dimensions above.

### Required website content
- [ ] Privacy Policy reachable from the footer on every page, with a current "Last Updated" date
- [ ] Terms of Service reachable from the footer on every page, with a current "Last Updated" date
- [ ] Shipping Policy explaining methods, costs, restrictions, and tracking
- [ ] Refund & Return Policy with explicit:
  - Return window in days (e.g., 30 days from delivery)
  - What's covered (shortages, damage, misrepresentation)
  - What's not covered (buyer's remorse, disclosed conditions, etc.)
  - How to file a claim (email, required evidence, deadline)
  - Resolution options (replacement, refund, store credit)
  - **Explicit restocking fee** (or explicit "no restocking fee on approved claims")
- [ ] Warranty Policy (if any warranty offered) covering scope, exclusions, claim process, remedy
- [ ] Contact page with at least two concrete methods (email + phone, address, or hours)
- [ ] About / business identity that doesn't contradict the legal docs

### Footer integrity
- [ ] All five policy pages linked from the footer (Privacy, Terms, Shipping, Refund/Return, Warranty)
- [ ] Business address with full street + city + state + ZIP
- [ ] Working `tel:` link to the business phone
- [ ] Working `mailto:` link to the business email
- [ ] Social profiles only if they're real and active
- [ ] No unverified trust badges (BBB, ISO, etc.) without a working verification link

### Product data
- [ ] Every product page renders valid `application/ld+json` `Product` schema
- [ ] Image URLs are absolute and resolve to 200 with `image/*` content type — no double-prefix bugs
- [ ] `brand` set to your business name (not a third-party retailer) unless you're an authorized reseller with chain-of-custody
- [ ] `itemCondition` maps to one of the four schema values
- [ ] `hasMerchantReturnPolicy` populated with all sub-fields including `restockingFee`
- [ ] `shippingDetails` populated with handling + transit time
- [ ] `priceValidUntil` set ~30 days out
- [ ] SKU present (or GTIN/MPN where applicable)
- [ ] Description ≥ 75 words, factual, grounded in real product data
- [ ] Title does NOT use protected brand names on customer-return or mixed-source goods
- [ ] Title quantity matches detail-page quantity exactly

### Checkout reality
- [ ] Site has a real on-site checkout with a conventional payment method (Stripe / Square / PayPal / etc.)
- [ ] Price on product page == price in cart == price at checkout
- [ ] Shipping cost visible before commit
- [ ] Cart state persists across navigation
- [ ] Order minimum (if any) is enforced consistently and communicated upfront

### Catalog hygiene
- [ ] No counterfeit-risk titles ("Authentic [Brand]" on customer returns)
- [ ] No undisclosed mystery boxes — each opaque pallet has a typical-contents disclosure
- [ ] Hygiene-risk return-flow goods (cosmetics returns, baby items, food, intimates) excluded from the Merchant feed or with explicit condition disclosure
- [ ] No prohibited items (weapons, ammunition, drugs, tobacco, vape, alcohol in restricted regions)
- [ ] All products marked `in-stock` (or genuine out-of-stock with proper schema)

### Trust signals
- [ ] No "100% inspected" / "best price guaranteed" / "X years experience" claims that contradict the FAQ or Terms
- [ ] No "Free shipping over $X" promo bars unless checkout actually honors them
- [ ] Customer reviews are real and attributable, or the site has none (placeholder reviews are a misrepresentation risk)
- [ ] "Backed by [parent entity]" framing only if accurate and current
- [ ] Business address consistent across footer / contact / About / JSON-LD / legal docs
- [ ] "Last Updated" dates on legal docs reflect actual content recency

### Technical
- [ ] HTTPS site-wide with a real valid cert (not the Cloudflare-default placeholder)
- [ ] `robots.txt` reachable, allows Googlebot and AdsBot-Google
- [ ] `sitemap.xml` reachable, lists all product URLs
- [ ] Organization JSON-LD on every page with `email`, `telephone`, `address` (with ZIP), `sameAs`
- [ ] Mobile-friendly viewport, no horizontal scroll
- [ ] OpenGraph + Twitter Card metadata for social previews

---

## Common rejection causes I've seen

In priority order — these are the ones that consistently trigger Merchant Center disapproval:

1. **No on-site checkout with conventional payment** — quote-only or WhatsApp-only flows are non-starters.
2. **"All sales final / no returns"** — must have a documented return window with restocking-fee language.
3. **Counterfeit-risk titles** — branded items on customer-return inventory without chain-of-custody.
4. **Malformed product image URLs** in JSON-LD (the double-prefix bug).
5. **Unverified trust badges** — BBB without a working verification link, fake review aggregators, etc.
6. **Contradiction between site claims and FAQ/Terms** — "100% inspected" + FAQ saying "no inspection before purchase".
7. **Stale legal docs** — "Last Updated 2 years ago" while business has materially changed (address, name, payment methods).
8. **Missing ZIP / incomplete address** in footer and Organization JSON-LD.
9. **Aspirational free-shipping promo** that checkout doesn't honor.
10. **Mystery / unmanifested inventory** without a "typical contents" disclosure.
11. **Hygiene-sensitive customer returns** (cosmetics, baby, intimates, food) in the Merchant feed.
12. **Title-quantity mismatches** between product title and detail page.

---

## Schema templates

Drop-in JSON-LD blocks. Adjust for your business.

### Organization (in root layout)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Business Name",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "email": "info@yoursite.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "ST",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "contactPoint": [{
    "@type": "ContactPoint",
    "contactType": "customer support",
    "telephone": "+15551234567",
    "email": "info@yoursite.com",
    "areaServed": "US",
    "availableLanguage": "English"
  }],
  "sameAs": ["https://facebook.com/...", "https://instagram.com/..."]
}
```

### Product (per product page)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Title",
  "sku": "ABC-123",
  "image": ["https://yoursite.com/image-1.jpg"],
  "description": "75+ word factual description grounded in real product data.",
  "brand": { "@type": "Brand", "name": "Your Business Name" },
  "itemCondition": "https://schema.org/NewCondition",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "99.99",
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "Your Business Name" },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/ReturnShippingFees",
      "restockingFee": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" }
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 5, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 7, "unitCode": "DAY" }
      }
    }
  }
}
```

---

## Pre-submission final checklist

Before clicking "Submit for review" in Google Merchant Center, do this 60-second final pass:

1. Open homepage in an incognito window on mobile. Footer shows: address with ZIP, phone, email, all 5 policy links. ✅
2. Open one random product page. View source. Find `application/ld+json`. Verify image URL resolves and all required fields present. ✅
3. Add that product to cart, fill checkout, attempt to complete. Real payment processor appears. ✅
4. Open `/refund-return` (or equivalent). Verify window in days + restocking fee statement. ✅
5. Open `/terms` and `/privacy`. Check "Last Updated" date is recent. ✅
6. Grep the live HTML for "NEJ" or any prior parent-entity name. Should be 0 hits. ✅
7. Grep for "Authentic [Brand]" titles. Should be 0 hits on customer-return inventory. ✅
8. Check announcement bar messaging. If it promises free shipping, verify checkout honors it. ✅
9. `https://search.google.com/test/rich-results` — paste a product URL. Confirm no errors. ✅
10. `https://pagespeed.web.dev` — paste the homepage. Verify mobile passes Core Web Vitals. ✅

If all 10 are green, submit. If any are red, fix before submitting (rejections take 3–7 days to undo).
