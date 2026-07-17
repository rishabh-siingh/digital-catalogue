-- Digital Products Catalogue — Supabase schema
-- Run this in your Supabase project's SQL Editor (Dashboard → SQL Editor → New query)

create extension if not exists "uuid-ossp";

-- Categories (sidebar items)
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  icon text not null default 'Folder',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Products (rows inside each category)
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references categories(id) on delete cascade,
  url text not null default '',
  title text not null default '',
  description text default '',
  platform text default '',
  status text default 'Not started',
  date_added date not null default current_date,
  notes text default '',
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products(category_id);

-- Seed default categories
insert into categories (name, icon, sort_order) values
  ('PDFs', 'FileText', 1),
  ('Courses', 'GraduationCap', 2),
  ('Tools', 'Wrench', 3),
  ('Word', 'FileType', 4),
  ('Excel', 'Sheet', 5)
on conflict (name) do nothing;

-- Row Level Security: open policies since this is a single-user personal tool
-- accessed via the anon key. If you ever add multi-user auth, replace these.
alter table categories enable row level security;
alter table products enable row level security;

drop policy if exists "categories_all" on categories;
create policy "categories_all" on categories for all using (true) with check (true);

drop policy if exists "products_all" on products;
create policy "products_all" on products for all using (true) with check (true);
