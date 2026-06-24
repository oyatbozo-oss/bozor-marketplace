import type { Lang } from './types';

// ── Описание характеристик категорий ────────────────────────────
// Поля с ключами brand / model / memory сохраняются в одноимённые
// колонки listings (для совместимости и фильтра по бренду),
// остальные ключи уходят в JSONB attributes.

export type FieldType = 'text' | 'number' | 'select';

export interface Opt {
  v: string;
  ru: string;
  uz?: string;
}

export interface AttrField {
  key: string;
  ru: string;
  uz: string;
  type: FieldType;
  options?: Opt[];
  unit?: string;
}

export interface SubCategory {
  slug: string;
  ru: string;
  uz: string;
  hasCondition?: boolean; // показывать переключатель Новый/Б.у.
  fields: AttrField[];
}

export interface Category {
  slug: string;
  ru: string;
  uz: string;
  icon: string;
  sub: SubCategory[];
}

// Часто переиспользуемые наборы опций
const TRANSMISSION: Opt[] = [
  { v: 'mt', ru: 'Механика', uz: 'Mexanika' },
  { v: 'at', ru: 'Автомат', uz: 'Avtomat' },
  { v: 'cvt', ru: 'Вариатор', uz: 'Variator' },
  { v: 'robot', ru: 'Робот', uz: 'Robot' },
];
const FUEL: Opt[] = [
  { v: 'petrol', ru: 'Бензин', uz: 'Benzin' },
  { v: 'gas', ru: 'Газ/Бензин', uz: 'Gaz/Benzin' },
  { v: 'diesel', ru: 'Дизель', uz: 'Dizel' },
  { v: 'electro', ru: 'Электро', uz: 'Elektro' },
  { v: 'hybrid', ru: 'Гибрид', uz: 'Gibrid' },
];
const BODY: Opt[] = [
  { v: 'sedan', ru: 'Седан', uz: 'Sedan' },
  { v: 'hatchback', ru: 'Хэтчбек', uz: 'Xetchbek' },
  { v: 'suv', ru: 'Внедорожник', uz: 'SUV' },
  { v: 'minivan', ru: 'Минивэн', uz: 'Miniven' },
  { v: 'pickup', ru: 'Пикап', uz: 'Pikap' },
  { v: 'coupe', ru: 'Купе', uz: 'Kupe' },
];
const SIZE_CLOTHES: Opt[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => ({ v: s, ru: s }));
const GENDER: Opt[] = [
  { v: 'male', ru: 'Мужской', uz: 'Erkak' },
  { v: 'female', ru: 'Женский', uz: 'Ayol' },
  { v: 'unisex', ru: 'Унисекс', uz: 'Uniseks' },
];
const EMPLOYMENT: Opt[] = [
  { v: 'full', ru: 'Полная занятость', uz: 'To‘liq' },
  { v: 'part', ru: 'Частичная', uz: 'Qisman' },
  { v: 'shift', ru: 'Сменный график', uz: 'Smenali' },
  { v: 'remote', ru: 'Удалённо', uz: 'Masofadan' },
];
const EXPERIENCE: Opt[] = [
  { v: 'none', ru: 'Без опыта', uz: 'Tajribasiz' },
  { v: '1-3', ru: '1–3 года', uz: '1–3 yil' },
  { v: '3-6', ru: '3–6 лет', uz: '3–6 yil' },
  { v: '6+', ru: 'Более 6 лет', uz: '6+ yil' },
];

const f = {
  brand: (ru = 'Бренд', uz = 'Brend'): AttrField => ({ key: 'brand', ru, uz, type: 'text' }),
  model: (): AttrField => ({ key: 'model', ru: 'Модель', uz: 'Model', type: 'text' }),
  memory: (): AttrField => ({ key: 'memory', ru: 'Память', uz: 'Xotira', type: 'text' }),
  year: (): AttrField => ({ key: 'year', ru: 'Год выпуска', uz: 'Ishlab chiqarilgan yili', type: 'number' }),
  text: (key: string, ru: string, uz: string): AttrField => ({ key, ru, uz, type: 'text' }),
  num: (key: string, ru: string, uz: string, unit?: string): AttrField => ({ key, ru, uz, type: 'number', unit }),
  sel: (key: string, ru: string, uz: string, options: Opt[]): AttrField => ({ key, ru, uz, type: 'select', options }),
};

export const CATEGORIES: Category[] = [
  {
    slug: 'electronics',
    ru: 'Электроника',
    uz: 'Elektronika',
    icon: '📱',
    sub: [
      {
        slug: 'smartphones',
        ru: 'Смартфоны',
        uz: 'Smartfonlar',
        hasCondition: true,
        fields: [f.brand(), f.model(), f.memory(), f.text('color', 'Цвет', 'Rang')],
      },
      {
        slug: 'laptops',
        ru: 'Ноутбуки',
        uz: 'Noutbuklar',
        hasCondition: true,
        fields: [
          f.brand(),
          f.text('processor', 'Процессор', 'Protsessor'),
          f.num('ram', 'Оперативная память', 'Tezkor xotira', 'ГБ'),
          f.text('storage', 'Накопитель', 'Saqlash'),
          f.num('screen', 'Экран', 'Ekran', '"'),
        ],
      },
      {
        slug: 'tablets',
        ru: 'Планшеты',
        uz: 'Planshetlar',
        hasCondition: true,
        fields: [f.brand(), f.model(), f.memory()],
      },
      {
        slug: 'tv',
        ru: 'ТВ и проекторы',
        uz: 'TV va proyektorlar',
        hasCondition: true,
        fields: [f.brand(), f.num('screen', 'Диагональ', 'Diagonal', '"')],
      },
      {
        slug: 'audio',
        ru: 'Наушники и аудио',
        uz: 'Quloqchin va audio',
        hasCondition: true,
        fields: [f.brand(), f.text('atype', 'Тип', 'Turi')],
      },
      {
        slug: 'consoles',
        ru: 'Игровые приставки',
        uz: 'Konsollar',
        hasCondition: true,
        fields: [f.brand(), f.model()],
      },
    ],
  },
  {
    slug: 'transport',
    ru: 'Транспорт',
    uz: 'Transport',
    icon: '🚗',
    sub: [
      {
        slug: 'cars',
        ru: 'Автомобили',
        uz: 'Avtomobillar',
        fields: [
          f.brand('Марка', 'Marka'),
          f.model(),
          f.year(),
          f.num('mileage', 'Пробег', 'Yurgan masofasi', 'км'),
          f.sel('transmission', 'Коробка', 'Uzatma', TRANSMISSION),
          f.sel('fuel', 'Топливo', 'Yoqilg‘i', FUEL),
          f.sel('body', 'Кузов', 'Kuzov', BODY),
          f.text('color', 'Цвет', 'Rang'),
        ],
      },
      {
        slug: 'moto',
        ru: 'Мотоциклы',
        uz: 'Mototsikllar',
        fields: [f.brand('Марка', 'Marka'), f.year(), f.num('engine', 'Объём', 'Hajmi', 'см³'), f.num('mileage', 'Пробег', 'Masofa', 'км')],
      },
      {
        slug: 'trucks',
        ru: 'Грузовики и спецтехника',
        uz: 'Yuk mashinalari',
        fields: [f.brand('Марка', 'Marka'), f.year(), f.num('mileage', 'Пробег', 'Masofa', 'км')],
      },
      {
        slug: 'parts',
        ru: 'Запчасти и аксессуары',
        uz: 'Ehtiyot qismlar',
        hasCondition: true,
        fields: [f.text('ptype', 'Тип', 'Turi'), f.brand('Марка авто', 'Avto markasi')],
      },
    ],
  },
  {
    slug: 'realty',
    ru: 'Недвижимость',
    uz: 'Ko‘chmas mulk',
    icon: '🏠',
    sub: [
      {
        slug: 'flat_sale',
        ru: 'Квартиры — продажа',
        uz: 'Kvartiralar — sotuv',
        fields: [
          f.num('rooms', 'Комнат', 'Xonalar'),
          f.num('area', 'Площадь', 'Maydon', 'м²'),
          f.num('floor', 'Этаж', 'Qavat'),
          f.num('floors', 'Этажей в доме', 'Bino qavatlari'),
        ],
      },
      {
        slug: 'flat_rent',
        ru: 'Квартиры — аренда',
        uz: 'Kvartiralar — ijara',
        fields: [
          f.num('rooms', 'Комнат', 'Xonalar'),
          f.num('area', 'Площадь', 'Maydon', 'м²'),
          f.num('floor', 'Этаж', 'Qavat'),
          f.sel('rent_period', 'Срок', 'Muddat', [
            { v: 'month', ru: 'Помесячно', uz: 'Oylik' },
            { v: 'day', ru: 'Посуточно', uz: 'Kunlik' },
          ]),
        ],
      },
      {
        slug: 'house',
        ru: 'Дома и дачи',
        uz: 'Uy va dala hovli',
        fields: [
          f.num('rooms', 'Комнат', 'Xonalar'),
          f.num('area', 'Площадь дома', 'Uy maydoni', 'м²'),
          f.num('land', 'Участок', 'Yer maydoni', 'сот'),
        ],
      },
      {
        slug: 'commercial',
        ru: 'Коммерческая',
        uz: 'Tijorat',
        fields: [f.num('area', 'Площадь', 'Maydon', 'м²'), f.text('ptype', 'Тип', 'Turi')],
      },
      {
        slug: 'land',
        ru: 'Участки',
        uz: 'Yer uchastkalari',
        fields: [f.num('land', 'Площадь', 'Maydon', 'сот')],
      },
    ],
  },
  {
    slug: 'jobs',
    ru: 'Работа',
    uz: 'Ish',
    icon: '💼',
    sub: [
      {
        slug: 'vacancy',
        ru: 'Вакансии',
        uz: 'Bo‘sh ish o‘rinlari',
        fields: [
          f.text('position', 'Должность', 'Lavozim'),
          f.sel('employment', 'Занятость', 'Bandlik', EMPLOYMENT),
          f.sel('experience', 'Опыт', 'Tajriba', EXPERIENCE),
        ],
      },
      {
        slug: 'resume',
        ru: 'Резюме',
        uz: 'Rezyume',
        fields: [
          f.text('position', 'Желаемая должность', 'Istalgan lavozim'),
          f.sel('experience', 'Опыт', 'Tajriba', EXPERIENCE),
        ],
      },
    ],
  },
  {
    slug: 'personal',
    ru: 'Личные вещи',
    uz: 'Shaxsiy buyumlar',
    icon: '👕',
    sub: [
      {
        slug: 'clothes',
        ru: 'Одежда',
        uz: 'Kiyim',
        hasCondition: true,
        fields: [f.sel('gender', 'Пол', 'Jinsi', GENDER), f.sel('size', 'Размер', 'O‘lcham', SIZE_CLOTHES), f.brand()],
      },
      {
        slug: 'shoes',
        ru: 'Обувь',
        uz: 'Oyoq kiyim',
        hasCondition: true,
        fields: [f.sel('gender', 'Пол', 'Jinsi', GENDER), f.num('size', 'Размер', 'O‘lcham'), f.brand()],
      },
      {
        slug: 'kids',
        ru: 'Детские товары',
        uz: 'Bolalar buyumlari',
        hasCondition: true,
        fields: [f.text('ktype', 'Тип', 'Turi')],
      },
      {
        slug: 'beauty',
        ru: 'Красота и здоровье',
        uz: 'Go‘zallik va salomatlik',
        hasCondition: true,
        fields: [f.text('btype', 'Тип', 'Turi')],
      },
      {
        slug: 'watches',
        ru: 'Часы и украшения',
        uz: 'Soat va taqinchoqlar',
        hasCondition: true,
        fields: [f.brand(), f.text('wtype', 'Тип', 'Turi')],
      },
    ],
  },
  {
    slug: 'home',
    ru: 'Дом и сад',
    uz: 'Uy va bog‘',
    icon: '🏡',
    sub: [
      {
        slug: 'furniture',
        ru: 'Мебель',
        uz: 'Mebel',
        hasCondition: true,
        fields: [f.text('ftype', 'Тип', 'Turi'), f.text('material', 'Материал', 'Material')],
      },
      {
        slug: 'appliances',
        ru: 'Бытовая техника',
        uz: 'Maishiy texnika',
        hasCondition: true,
        fields: [f.brand(), f.text('atype', 'Тип', 'Turi')],
      },
      {
        slug: 'repair',
        ru: 'Ремонт и стройматериалы',
        uz: 'Ta’mir va qurilish',
        hasCondition: true,
        fields: [f.text('rtype', 'Тип', 'Turi')],
      },
      {
        slug: 'plants',
        ru: 'Растения',
        uz: 'O‘simliklar',
        fields: [f.text('ptype', 'Тип', 'Turi')],
      },
    ],
  },
  {
    slug: 'hobby',
    ru: 'Хобби и отдых',
    uz: 'Hobbi va dam olish',
    icon: '🎸',
    sub: [
      {
        slug: 'sport',
        ru: 'Спорт и туризм',
        uz: 'Sport va turizm',
        hasCondition: true,
        fields: [f.text('stype', 'Тип', 'Turi'), f.brand()],
      },
      {
        slug: 'music',
        ru: 'Музыкальные инструменты',
        uz: 'Musiqa asboblari',
        hasCondition: true,
        fields: [f.text('mtype', 'Тип', 'Turi'), f.brand()],
      },
      {
        slug: 'books',
        ru: 'Книги и журналы',
        uz: 'Kitob va jurnallar',
        hasCondition: true,
        fields: [f.text('btype', 'Тип', 'Turi')],
      },
      {
        slug: 'collection',
        ru: 'Коллекционирование',
        uz: 'Kolleksiya',
        hasCondition: true,
        fields: [f.text('ctype', 'Тип', 'Turi')],
      },
    ],
  },
  {
    slug: 'animals',
    ru: 'Животные',
    uz: 'Hayvonlar',
    icon: '🐾',
    sub: [
      { slug: 'dogs', ru: 'Собаки', uz: 'Itlar', fields: [f.text('breed', 'Порода', 'Zoti')] },
      { slug: 'cats', ru: 'Кошки', uz: 'Mushuklar', fields: [f.text('breed', 'Порода', 'Zoti')] },
      { slug: 'birds', ru: 'Птицы', uz: 'Qushlar', fields: [f.text('species', 'Вид', 'Turi')] },
      { slug: 'pet_goods', ru: 'Товары для животных', uz: 'Hayvon mollari', hasCondition: true, fields: [f.text('gtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'business',
    ru: 'Бизнес и оборудование',
    uz: 'Biznes va jihozlar',
    icon: '🏭',
    sub: [
      { slug: 'equipment', ru: 'Оборудование', uz: 'Jihozlar', hasCondition: true, fields: [f.text('etype', 'Тип', 'Turi'), f.brand()] },
      { slug: 'ready_business', ru: 'Готовый бизнес', uz: 'Tayyor biznes', fields: [f.text('btype', 'Сфера', 'Soha')] },
      { slug: 'materials', ru: 'Сырьё и материалы', uz: 'Xom ashyo', fields: [f.text('mtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'services',
    ru: 'Услуги',
    uz: 'Xizmatlar',
    icon: '🛠️',
    sub: [
      { slug: 'services_all', ru: 'Услуги', uz: 'Xizmatlar', fields: [f.text('stype', 'Вид услуги', 'Xizmat turi')] },
    ],
  },
];

// ── Помощники ────────────────────────────────────────────────────
export function catBySlug(slug: string | null | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function subBySlug(cat: string | null | undefined, sub: string | null | undefined): SubCategory | undefined {
  return catBySlug(cat)?.sub.find((s) => s.slug === sub);
}
export function catName(slug: string | null | undefined, lang: Lang): string {
  const c = catBySlug(slug);
  return c ? (lang === 'uz' ? c.uz : c.ru) : '';
}
export function subName(cat: string | null | undefined, sub: string | null | undefined, lang: Lang): string {
  const s = subBySlug(cat, sub);
  return s ? (lang === 'uz' ? s.uz : s.ru) : '';
}
export function fieldLabel(field: AttrField, lang: Lang): string {
  return lang === 'uz' ? field.uz : field.ru;
}
export function optLabel(opt: Opt, lang: Lang): string {
  return lang === 'uz' ? opt.uz ?? opt.ru : opt.ru;
}

// Колонки listings, в которые маппятся одноимённые поля (не в JSONB)
export const COLUMN_KEYS = ['brand', 'model', 'memory'];
