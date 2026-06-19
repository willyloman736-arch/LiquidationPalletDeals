"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { getAdminClient, PRODUCT_IMAGE_BUCKET } from "@/lib/supabase";

// ---------------------------------------------------------------- auth
export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Incorrect password." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ------------------------------------------------------------- helpers
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

function revalidateAll(handle?: string, categorySlug?: string) {
  revalidatePath("/");
  revalidatePath("/deals");
  revalidatePath("/deals/80-off");
  revalidatePath("/deals/90-off");
  revalidatePath("/deals/95-off");
  revalidatePath("/admin");
  if (categorySlug) revalidatePath(`/${categorySlug}`);
  if (handle) revalidatePath(`/pallets/${handle}`);
}

const numOrNull = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ---------------------------------------------------------- products
export type SaveState = { error?: string };

export async function saveProduct(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const sb = getAdminClient();
  if (!sb) return { error: "Database not connected. Set the Supabase env vars in Vercel." };

  const mode = String(formData.get("mode") ?? "create");
  const origHandle = String(formData.get("handle") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const price = numOrNull(formData, "price_usd");
  const retail = numOrNull(formData, "retail_value_usd");
  const units = numOrNull(formData, "units") ?? 1;

  if (!title) return { error: "Title is required." };
  if (price == null || price <= 0) return { error: "A valid price is required." };
  if (retail == null || retail <= 0) return { error: "A valid retail value is required." };

  const images = formData.getAll("images").map(String).filter(Boolean);
  const cpu = numOrNull(formData, "cost_per_unit_usd") ?? Math.round((price / Math.max(1, units)) * 100) / 100;

  const row = {
    title,
    sku: String(formData.get("sku") ?? "").trim() || null,
    category_slug: String(formData.get("category_slug") ?? "general-merchandise"),
    condition: String(formData.get("condition") ?? "mos"),
    manifest: String(formData.get("manifest") ?? "unmanifested"),
    retail_value_usd: retail,
    price_usd: price,
    sale_price_usd: numOrNull(formData, "sale_price_usd"),
    units: Math.round(units),
    cost_per_unit_usd: cpu,
    availability: String(formData.get("availability") ?? "in-stock"),
    featured: formData.get("featured") === "on",
    images,
    updated_at: new Date().toISOString(),
  };

  let handle = origHandle;
  if (mode === "create") {
    handle = `${slugify(title)}-${row.sku ? row.sku.toLowerCase() : Math.random().toString(36).slice(2, 7)}`;
    const { error } = await sb.from("products").insert({ ...row, handle });
    if (error) return { error: error.message };
  } else {
    const { error } = await sb.from("products").update(row).eq("handle", origHandle);
    if (error) return { error: error.message };
  }

  revalidateAll(handle, row.category_slug);
  redirect("/admin");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const sb = getAdminClient();
  if (!sb) return;
  const handle = String(formData.get("handle") ?? "");
  const cat = String(formData.get("category_slug") ?? "");
  await sb.from("products").delete().eq("handle", handle);
  revalidateAll(handle, cat);
  redirect("/admin");
}

// ------------------------------------------------------- deal tiers
export type TierState = { error?: string; ok?: boolean };

export async function updateDealTiers(_prev: TierState, formData: FormData): Promise<TierState> {
  const sb = getAdminClient();
  if (!sb) return { error: "Database not connected." };
  for (const slug of ["80-off", "90-off", "95-off"]) {
    const min = numOrNull(formData, `min_${slug}`);
    if (min != null) {
      const m = Math.round(min);
      const { error } = await sb
        .from("deal_tiers")
        .update({ min_discount: m, name: `Deals Over ${m}% Off` })
        .eq("slug", slug);
      if (error) return { error: error.message };
    }
  }
  revalidateAll();
  return { ok: true };
}

// ----------------------------------------------------- image upload
export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const sb = getAdminClient();
  if (!sb) return { error: "Database not connected." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8 MB." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) return { error: error.message };

  const { data } = sb.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
