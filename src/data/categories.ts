export type SubCategory = {
  name: string;
  slug: string;
};

export type Category = {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  image: string;
  highlights: string[];
  subcategories: SubCategory[];
};

export const categories: Category[] = [
  {
    name: "Apparel",
    slug: "apparel",
    shortDescription: "Brand-name clothing, footwear, and accessories by the pallet.",
    longDescription:
      "Famous and specialty-store branded apparel sourced through established B2B reverse-logistics channels. Mixed sizes and styles across men, women, and kids, with clear inventory-grade classifications on every lot.",
    icon: "shirt",
    image: "/images/categories/apparel.webp",
    highlights: ["Mixed sizes and styles", "First Quality & shelf-pull grades", "Pallets and truckloads"],
    subcategories: [
      { name: "Accessories", slug: "accessories" },
      { name: "Clothing", slug: "clothing" },
      { name: "Shop All Apparel", slug: "all" },
    ],
  },
  {
    name: "Consumer Electronics",
    slug: "electronics",
    shortDescription: "Audio, tech accessories, and hot-ticket gadgets for resellers.",
    longDescription:
      "Music & audio, phone cases, chargers, cables, and tech accessories. High online resale demand with predictable cost-per-unit economics for marketplace sellers.",
    icon: "headphones",
    image: "/images/categories/electronics.webp",
    highlights: ["Strong online resale demand", "Low cost per unit", "Past Season Transfers & shelf pulls"],
    subcategories: [
      { name: "Music & Audio", slug: "music-audio" },
      { name: "Tech Accessories", slug: "tech-accessories" },
      { name: "Shop All Consumer Electronics", slug: "all" },
    ],
  },
  {
    name: "Furniture",
    slug: "furniture",
    shortDescription: "Bedroom, living, and office furniture pallets and truckloads.",
    longDescription:
      "Beds, living-room, office, and home furniture. Pieces range from flat-pack to fully assembled, with truckload pricing and dock or liftgate delivery options.",
    icon: "sofa",
    image: "/images/categories/furniture.webp",
    highlights: ["Truckload pricing available", "Mixed condition lots", "LTL and dock pickup"],
    subcategories: [
      { name: "Bedroom", slug: "bedroom" },
      { name: "Living Room", slug: "living-room" },
      { name: "Office", slug: "office" },
      { name: "Home Furniture", slug: "home-furniture" },
      { name: "Shop All Furniture", slug: "all" },
    ],
  },
  {
    name: "General Merchandise",
    slug: "general-merchandise",
    shortDescription: "Assorted high-velocity SKUs across every department.",
    longDescription:
      "Books, garden, seasonal, sports & games, and assorted merchandise. Broad category coverage at a low cost per unit for swap meets, discount stores, and online flippers.",
    icon: "boxes",
    image: "/images/categories/general-merchandise.webp",
    highlights: ["Broad category mix", "Low cost per unit", "New inventory daily"],
    subcategories: [
      { name: "Assorted Merchandise", slug: "assorted-merchandise" },
      { name: "Books", slug: "books" },
      { name: "Garden Products", slug: "garden-products" },
      { name: "Holiday & Seasonal", slug: "holiday-seasonal" },
      { name: "Sports & Games", slug: "sports-games" },
    ],
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    shortDescription: "Cosmetics, skincare, and personal-care assortments.",
    longDescription:
      "Assorted cosmetics and beauty closeouts from prestige and mass-market brands at 90%+ off original retail. Lots are sold by the pallet with estimated retail values and quantities listed.",
    icon: "sparkles",
    image: "/images/categories/health-beauty.webp",
    highlights: ["Prestige & mass-market brands", "90%+ off original retail", "Thousands of units per lot"],
    subcategories: [
      { name: "Cosmetics", slug: "cosmetics" },
      { name: "Shop All Health & Beauty", slug: "all" },
    ],
  },
  {
    name: "Houseware",
    slug: "houseware",
    shortDescription: "Décor, bedding, kitchenware, lighting, and rugs.",
    longDescription:
      "Bedding, comforters, dish towels, candles, picture frames, art & décor, kitchenware, lighting, and rugs. A reliable everyday-turn category for discount retail and social marketplaces.",
    icon: "home",
    image: "/images/categories/houseware.webp",
    highlights: ["High everyday demand", "Floor-ready options", "82%+ off original retail"],
    subcategories: [
      { name: "Art & Home Décor", slug: "art-home-decor" },
      { name: "Bedding", slug: "bedding" },
      { name: "Flooring & Rugs", slug: "flooring-rugs" },
      { name: "Kitchenware & Tableware", slug: "kitchenware-tableware" },
      { name: "Lighting", slug: "lighting" },
    ],
  },
  {
    name: "Mixed Pallets",
    slug: "mixed-pallets",
    shortDescription: "Cross-category lots blending the best of every department.",
    longDescription:
      "Hand-built mixed pallets that combine apparel, electronics, beauty, and houseware in a single lot — the fastest way to sample categories or fill a varied storefront.",
    icon: "shuffle",
    image: "/images/categories/mixed-pallets.webp",
    highlights: ["Multi-category in one lot", "Great for new resellers", "Flexible sizes"],
    subcategories: [
      { name: "Standard Mixed", slug: "standard" },
      { name: "Premium Mixed", slug: "premium" },
    ],
  },
];

export const dealTiers = [
  {
    name: "Deals Over 80% Off",
    slug: "80-off",
    blurb: "Strong-margin lots for resellers building inventory at scale.",
    minDiscount: 80,
    accent: "from-brand-600 to-brand-800",
  },
  {
    name: "Deals Over 90% Off",
    slug: "90-off",
    blurb: "Deeper discounts on overstock and shelf-pulls — limited quantities.",
    minDiscount: 90,
    accent: "from-brand-800 to-brand-950",
  },
  {
    name: "Deals Over 95% Off",
    slug: "95-off",
    blurb: "Our deepest-discount tier. First come, first served, no holds.",
    minDiscount: 95,
    accent: "from-ink-800 to-ink-900",
  },
] as const;
