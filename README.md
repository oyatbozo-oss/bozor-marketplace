# Bozor — маркетплейс объявлений (Узбекистан)

Пилот: смартфоны, Ташкент. Интерфейс RU/UZ. Данные — из Supabase.

## Стек
- Next.js 15 (App Router) + React 19 + TypeScript
- @supabase/supabase-js (публичное чтение каталога через anon-ключ)

## Запуск локально
1. Скопируй `.env.local.example` → `.env.local` и впиши **anon public** ключ
   (Supabase → Project Settings → API).
2. Установи зависимости и запусти:
   ```
   npm install
   npm run dev
   ```
3. Открой http://localhost:3000

## Структура
- `app/page.tsx` — главная: лента смартфонов + фильтры
- `app/listing/[id]/page.tsx` — карточка объявления
- `components/` — Catalog, ListingCard, DetailView, Header, TabBar, LangProvider
- `lib/` — supabase-клиент, i18n (RU/UZ), типы

## Деплой
Vercel: `npx vercel`. В настройках проекта добавь переменные окружения
`NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
