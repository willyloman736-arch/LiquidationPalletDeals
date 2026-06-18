import type { MetadataRoute } from "next";
import { categories, dealTiers } from "@/data/categories";
import { allPallets } from "@/data/pallets";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/shipping",
    "/faq",
    "/terms",
    "/privacy",
    "/register",
    "/deals",
  ];
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path || "/"}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...categories.map((c) => ({
      url: `${base}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...dealTiers.map((d) => ({
      url: `${base}/deals/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...allPallets().map((p) => ({
      url: `${base}/pallets/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
