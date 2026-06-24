-- ============================================================
-- Bozor marketplace — схема базы данных (MVP, вертикаль "Смартфоны")
-- Проект: bozor-marketplace (Supabase, организация Bozor, Free plan)
-- Безопасно: создаёт только НОВЫЕ таблицы в схеме public.
-- ============================================================

-- Расширения
create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists pg_trgm;        -- быстрый поиск по тексту

-- ---------- Профили пользователей ----------
create table if not exists public.profiles (
  id          uuid primary key default gen_random_uuid(),
  auth_id     uuid unique,                       -- связь с auth.users (на будущее)
  phone       text,
  name        text not null,
  avatar_url  text,
  rating      numeric(2,1) default 5.0,
  is_verified boolean default false,
  lang        text default 'ru' check (lang in ('ru','uz')),
  created_at  timestamptz default now()
);

-- ---------- Категории (дерево) ----------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name_ru    text not null,
  name_uz    text not null,
  parent_id  uuid references public.categories(id) on delete set null,
  icon       text,
  sort       int default 0
);

-- ---------- Объявления ----------
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title       text not null,
  description text,
  price       numeric(14,2) not null,
  currency    text default 'UZS',
  condition   text check (condition in ('new','used')) default 'used',
  brand       text,
  model       text,
  memory      text,
  city        text default 'Tashkent',
  district    text,
  status      text default 'active' check (status in ('active','sold','moderation','blocked')),
  is_promoted boolean default false,
  views       int default 0,
  created_at  timestamptz default now()
);
create index if not exists idx_listings_category on public.listings(category_id);
create index if not exists idx_listings_brand    on public.listings(brand);
create index if not exists idx_listings_price     on public.listings(price);
create index if not exists idx_listings_status    on public.listings(status);
create index if not exists idx_listings_created   on public.listings(created_at desc);
create index if not exists idx_listings_title_trgm on public.listings using gin (title gin_trgm_ops);

-- ---------- Фото объявлений ----------
create table if not exists public.listing_images (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  url        text not null,
  sort       int default 0
);

-- ---------- Избранное ----------
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  created_at timestamptz default now(),
  unique(profile_id, listing_id)
);

-- ---------- Чаты и сообщения ----------
create table if not exists public.chats (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  buyer_id   uuid references public.profiles(id) on delete cascade,
  seller_id  uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid references public.chats(id) on delete cascade,
  sender_id  uuid references public.profiles(id) on delete cascade,
  body       text not null,
  is_read    boolean default false,
  created_at timestamptz default now()
);
create index if not exists idx_messages_chat on public.messages(chat_id, created_at);

-- ---------- Продвижение и платежи ----------
create table if not exists public.promotions (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  type       text check (type in ('top','highlight','vip')),
  starts_at  timestamptz default now(),
  ends_at    timestamptz,
  status     text default 'pending' check (status in ('pending','active','expired'))
);
create table if not exists public.payments (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references public.profiles(id) on delete set null,
  promotion_id uuid references public.promotions(id) on delete set null,
  amount       numeric(14,2),
  currency     text default 'UZS',
  provider     text check (provider in ('payme','click')),
  status       text default 'created' check (status in ('created','paid','failed')),
  created_at   timestamptz default now()
);

-- ---------- Жалобы (модерация) ----------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references public.listings(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason      text,
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security): публичное чтение каталога,
-- запись — только владельцем (на будущее, через auth).
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.listings       enable row level security;
alter table public.listing_images enable row level security;

-- Публичное чтение каталога (анонимный ключ может читать)
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);

drop policy if exists "public read active listings" on public.listings;
create policy "public read active listings" on public.listings for select using (status = 'active');

drop policy if exists "public read images" on public.listing_images;
create policy "public read images" on public.listing_images for select using (true);

drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles" on public.profiles for select using (true);

-- Запись объявлений только своим профилем (когда подключим auth)
drop policy if exists "owner inserts listing" on public.listings;
create policy "owner inserts listing" on public.listings for insert
  with check (seller_id in (select id from public.profiles where auth_id = auth.uid()));

drop policy if exists "owner updates listing" on public.listings;
create policy "owner updates listing" on public.listings for update
  using (seller_id in (select id from public.profiles where auth_id = auth.uid()));
