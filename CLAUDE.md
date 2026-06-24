# CLAUDE.md — контекст проекта Bozor (для Claude Code)

> Этот файл — память проекта. Прочитай его первым. НЕ трогай проект dilmatch
> (он в другой папке: C:\Users\Machenike\dilmatch-telegram-mini-app).

## Что за проект
Bozor — современный маркетплейс объявлений для Узбекистана и Центральной Азии
(аналог Avito + Auto.ru + HH.ru «в одном», заново под местный рынок).
Основатель — не профессиональный разработчик, работает по принципу
«я — продакт, Claude Code — строит». Объясняй шаги простым языком и
показывай план до изменений.

## Пилот (с чего начинаем)
- Город: **Ташкент**.
- Категория: **Смартфоны** (электроника — крупнейшая онлайн-категория в УЗ, ~35%).
- Языки интерфейса: **русский + узбекский** (uz латиница).
- Цены в **сумах (UZS)**. Платежи Payme/Click — позже.
- Платформа: старт Telegram Mini App + Web/PWA, далее нативные приложения.

## Бэкенд (УЖЕ РАЗВЁРНУТ — не пересоздавай)
- Supabase, организация "Bozor" (Free), проект **bozor-marketplace**, регион Frankfurt.
- Project URL: `https://xsnthzdhvkhwpvopyaqd.supabase.co`
- Project ref: `xsnthzdhvkhwpvopyaqd`
- Ключи: Supabase Dashboard → Project Settings → API.
  Используй **anon public** (он публичный, идёт в клиент).
  **НИКОГДА** не коммить и не используй `service_role` (секретный).
- В env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (или аналог для выбранного стека). `.env.local` уже в .gitignore.

## База данных (схема уже создана в Supabase)
Таблицы (schema public): profiles, categories, listings, listing_images,
favorites, chats, messages, promotions, payments, reports.
RLS включён, публичное чтение каталога (categories, listings, listing_images, profiles).
Полная DDL — в `bozor_schema.sql`. Тестовые данные — в `bozor_seed.sql`
(8 объявлений-смартфонов по Ташкенту, 5 продавцов, 5 категорий, 3 VIP).
Эти SQL уже применены в Supabase; повторно запускать не нужно (они идемпотентны).

## Что уже есть в этой папке
- `index.html` — рабочий прототип, который УЖЕ читает реальные данные из Supabase
  через REST (см. внутри функцию load(), SB_KEY='__SB_ANON_KEY__' — подставь anon-ключ).
  Используй как референс UX (лента, фильтры, карточка, RU/UZ, безопасная сделка).
- `bozor_schema.sql`, `bozor_seed.sql` — схема и сиды (для истории/локали).
- `vercel.json` — конфиг статики ({"cleanUrls": true}).
- `.gitignore`.

## GitHub
Создан пустой репозиторий: `https://github.com/oyatbozo-oss/bozor-marketplace`
(ветка main ещё не инициализирована — первый коммит создаст её).

## Следующие шаги (предложи план, дождись «ок», потом делай)
1. Выбрать стек. Рекомендация: **Next.js + @supabase/supabase-js** (как dilmatch),
   с заделом под Telegram Mini App. Можно начать и со статики на основе index.html.
2. Каркас проекта + подключение Supabase (env, клиент).
3. Главный экран: лента смартфонов из `listings` (с продавцом/рейтингом),
   фильтры (бренд/цена/состояние), карточка объявления — по образцу index.html.
4. git init → первый коммит → push в remote bozor-marketplace (main).
5. Деплой на Vercel как НОВЫЙ проект (`npx vercel`), dilmatch не трогать.

## Дальше по дорожной карте (после MVP-ленты)
Авторизация (Telegram/телефон) → подача объявления (3 шага) → чат (Realtime) →
избранное → безопасная сделка/доставка → платежи Payme/Click → вертикали авто и работа.

## Принципы
- Mobile-first, быстро, двуязычно, доверие в интерфейсе (верификация, рейтинги).
- Не ломать существующее, показывать план до правок, секреты не коммитить.
