-- ============================================================
-- Bozor — миграция: категории и характеристики
-- Добавляет category/subcategory и гибкое поле attributes (JSONB).
-- Только ДОБАВЛЯЕТ поля. Применено через Management API.
-- ============================================================

alter table public.listings
  add column if not exists category    text,
  add column if not exists subcategory text,
  add column if not exists attributes  jsonb default '{}'::jsonb;

create index if not exists idx_listings_category_txt on public.listings(category);
create index if not exists idx_listings_subcategory  on public.listings(subcategory);

-- Текущие объявления (смартфоны пилота) → Электроника / Смартфоны
update public.listings
  set category = 'electronics', subcategory = 'smartphones'
  where category is null;
