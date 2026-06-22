// PLACEHOLDER customer reviews — replace with real reviews before launch.
// Collect from post-shipment email follow-ups, Google Business Profile, or
// Trustpilot. The first 3 are featured on the homepage.
export type Review = {
  name: string;
  location: string;
  category: string;
  rating: number;
  title: string;
  body: string;
  buyerType: string;
};

export const reviews: Review[] = [
  {
    name: "Marcus T.",
    location: "Columbus, OH",
    category: "Apparel",
    rating: 5,
    title: "Apparel pallet paid for itself in two weekends",
    body: "Picked up a mixed apparel pallet at roughly $3.10 per unit and moved about 70% of it at a bin store popup the following weekend. Condition matched what the manifest implied, almost everything was shelf-pullable with tags still on. The team had it loaded and rolling within 48 hours of payment.",
    buyerType: "Bin store operator",
  },
  {
    name: "Priya R.",
    location: "Plano, TX",
    category: "Electronics",
    rating: 5,
    title: "Clean electronics load with honest grading",
    body: "Bought a customer-returns electronics pallet and was bracing for the usual mess of empty boxes. Instead the grading was accurate — the salvage items were called salvage, the working units actually worked. Net per-unit landed cost came out under $18 and I cleared the working portion through my online store in about three weeks.",
    buyerType: "Online reseller",
  },
  {
    name: "Devon B.",
    location: "Macon, GA",
    category: "Furniture",
    rating: 5,
    title: "Furniture truckload worth the drive",
    body: "Drove up from Macon for a furniture truckload after seeing the inspection notes. What I appreciated is they actually walked me through the load before I paid — pointed out the two damaged pieces instead of hiding them. Resold the bulk through a Saturday warehouse sale and netted just over 2.4x my buy cost.",
    buyerType: "Warehouse sale flipper",
  },
  {
    name: "Hannah K.",
    location: "Boise, ID",
    category: "Health & Beauty",
    rating: 5,
    title: "Health and beauty pallet was tight and clean",
    body: "First time buying H&B and I was nervous about expiration dates. Dates were all well within range and the manifest was actually close to what was on the pallet, which is not something I can say about most suppliers. Per-unit cost worked out to about $1.85 and sell-through at my swap meet booth was fast.",
    buyerType: "Swap meet vendor",
  },
  {
    name: "Anthony V.",
    location: "Cranston, RI",
    category: "General Merchandise",
    rating: 4,
    title: "Solid GM pallet, weekend response a bit slow",
    body: "Got a general merchandise pallet that hit right around the manifest value. Mix was varied enough to keep my booth interesting for a month and I had repeat customers asking when the next one was coming. Only minor note is weekend communication can lag — but during the week the team gets back to me within the hour.",
    buyerType: "Flea market booth owner",
  },
  {
    name: "Sasha M.",
    location: "Spokane, WA",
    category: "Houseware",
    rating: 5,
    title: "Houseware load priced right for FBA prep",
    body: "I prep for FBA and houseware is usually a headache because of damaged packaging. This pallet came tight-wrapped with most retail boxes intact, which saved me probably six hours of repackaging. Landed cost per sellable unit was under $4 after my pull rate, and ROI on the listings I sent in is tracking above 90%.",
    buyerType: "FBA seller",
  },
  {
    name: "Reggie D.",
    location: "Birmingham, AL",
    category: "Mixed Pallets",
    rating: 5,
    title: "Mixed pallet was a fair surprise",
    body: "Mixed pallets are always a gamble but this one came in honest. Got a usable spread across small electronics, kitchen, and seasonal — none of the dead-weight categories I worry about. Freight quote they arranged was about $80 cheaper than what my own broker came back with, which I did not expect.",
    buyerType: "eBay reseller",
  },
  {
    name: "Lindsey O.",
    location: "Burlington, VT",
    category: "Apparel",
    rating: 4,
    title: "Good apparel buy, one small note on labeling",
    body: "Apparel pallet ran about $2.90 per piece and most of it was clean, current-season looking inventory. Sell-through at my boutique pop-up was around 65% in the first two weekends. Only thing I'd ask for is a quicker turnaround on the loading photos — but condition matched what they told me on the phone, which is what actually matters.",
    buyerType: "Boutique pop-up owner",
  },
  {
    name: "Carlos N.",
    location: "Albuquerque, NM",
    category: "Truckload",
    rating: 5,
    title: "First truckload buy went smoother than expected",
    body: "Stepped up from pallets to a full truckload and was honestly worried about getting burned. The team walked me through the manifest line by line and gave me a fair number on the as-is portion. Truck arrived on the day they quoted and unloaded clean — I'm already planning the next one for Q3.",
    buyerType: "Independent wholesaler",
  },
];

export const featuredReviews = reviews.slice(0, 3);
