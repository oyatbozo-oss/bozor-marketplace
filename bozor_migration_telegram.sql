-- ============================================================
-- Bozor — миграция: вход через Telegram
-- Добавляет к профилям связь с Telegram. Безопасно (idempotent):
-- только ДОБАВЛЯЕТ поля, ничего не удаляет.
-- Применить один раз в Supabase → SQL Editor.
-- ============================================================

alter table public.profiles
  add column if not exists telegram_id  bigint,
  add column if not exists username     text,
  add column if not exists photo_url    text;

-- Один Telegram-аккаунт = один профиль
create unique index if not exists idx_profiles_telegram_id
  on public.profiles(telegram_id)
  where telegram_id is not null;
