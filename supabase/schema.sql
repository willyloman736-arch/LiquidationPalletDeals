-- Liquidation Pallet Deals — database schema
-- Run this once in Supabase → SQL Editor (New query → paste → Run).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- products
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  sku               text,
  handle            text unique not null,
  title             text not null,
  category_slug     text not null,
  manifest          text not null default 'unmanifested',   -- fully | partially | unmanifested
  condition         text not null default 'mos',            -- new | mos | first-quality | shelf-pull | customer-return
  retail_value_usd  numeric not null,
  price_usd         numeric not null,
  sale_price_usd    numeric,                                 -- optional discount; when set, this is the live price
  units             integer not null default 1,
  cost_per_unit_usd numeric,
  availability      text not null default 'in-stock',        -- in-stock | out-of-stock
  images            text[] not null default '{}',
  featured          boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_sort_idx on public.products (sort_order, created_at);

-- ------------------------------------------------------------- deal tiers
create table if not exists public.deal_tiers (
  slug          text primary key,        -- 80-off | 90-off | 95-off
  name          text not null,
  min_discount  integer not null,        -- threshold %
  blurb         text,
  sort_order    integer not null default 0
);

-- ------------------------------------------------------------------- RLS
-- Public site reads with the anon key; all writes go through the service-role
-- key in server actions (which bypasses RLS), so no public write policy.
alter table public.products  enable row level security;
alter table public.deal_tiers enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products for select using (true);

drop policy if exists "public read deal_tiers" on public.deal_tiers;
create policy "public read deal_tiers" on public.deal_tiers for select using (true);

-- --------------------------------------------------------- storage policy
-- After creating the public bucket "product-images" in Storage, public read
-- is automatic for public buckets. Uploads are done server-side with the
-- service-role key, so no extra storage policy is required.
