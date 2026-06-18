import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the public Supabase env vars are present. When false, the app
 *  falls back to the static catalog in src/data/pallets.json. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** Read-only client (anon key) for public/server reads. Returns null until configured. */
export function getPublicClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Privileged client (service-role key). SERVER-ONLY — never import from a client component. */
export function getAdminClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/** The Supabase Storage bucket that holds uploaded product images. */
export const PRODUCT_IMAGE_BUCKET = "product-images";
