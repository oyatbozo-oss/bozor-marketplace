import type { Lang } from './types';

export const dict = {
  ru: {
    appName: 'Bozor',
    loc: 'Ташкент',
    recommend: 'Объявления',
    filters: 'Фильтры',
    reset: 'сбросить',
    brand: 'Бренд',
    model: 'Модель',
    memory: 'Память',
    price: 'Цена, сум',
    cond: 'Состояние',
    found: 'Найдено',
    all: 'Все',
    write: 'Написать',
    buy: 'Купить',
    from: 'от',
    to: 'до',
    nothing: 'Ничего не найдено',
    empty: 'Пока пусто 🙂',
    t_home: 'Главная',
    t_search: 'Поиск',
    t_post: 'Подать',
    t_chat: 'Чат',
    t_prof: 'Профиль',
    searchph: 'Поиск: iPhone, Samsung…',
    sold: 'сум',
    verified: 'Проверенный',
    cond_new: 'Новый',
    cond_used: 'Б/у',
    safe: 'Безопасная сделка: деньги придут продавцу после получения товара',
    soon: 'Скоро',
    back: 'Назад',
    loading: 'Загрузка…',
    loadError: 'Не удалось загрузить данные. Проверь интернет.',
  },
  uz: {
    appName: 'Bozor',
    loc: 'Toshkent',
    recommend: 'E’lonlar',
    filters: 'Filtrlar',
    reset: 'tozalash',
    brand: 'Brend',
    model: 'Model',
    memory: 'Xotira',
    price: 'Narx, so‘m',
    cond: 'Holati',
    found: 'Topildi',
    all: 'Hammasi',
    write: 'Yozish',
    buy: 'Sotib olish',
    from: 'dan',
    to: 'gacha',
    nothing: 'Hech narsa topilmadi',
    empty: 'Hozircha bo‘sh 🙂',
    t_home: 'Asosiy',
    t_search: 'Qidiruv',
    t_post: 'Joylash',
    t_chat: 'Chat',
    t_prof: 'Profil',
    searchph: 'Qidiruv: iPhone, Samsung…',
    sold: 'so‘m',
    verified: 'Tasdiqlangan',
    cond_new: 'Yangi',
    cond_used: 'Ishlatilgan',
    safe: 'Xavfsiz bitim: pul tovar olingach o‘tadi',
    soon: 'Tez orada',
    back: 'Orqaga',
    loading: 'Yuklanmoqda…',
    loadError: 'Ma’lumotlarni yuklab bo‘lmadi. Internetni tekshiring.',
  },
} as const;

export type DictKey = keyof (typeof dict)['ru'];

export function tr(lang: Lang, key: DictKey): string {
  return dict[lang][key] ?? key;
}

export function condText(lang: Lang, c: string | null | undefined): string {
  if (c === 'new') return tr(lang, 'cond_new');
  return tr(lang, 'cond_used');
}

export function money(n: number): string {
  return Number(n).toLocaleString('ru-RU');
}
