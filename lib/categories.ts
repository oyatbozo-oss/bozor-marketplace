import type { Lang } from './types';

// ── Характеристики категорий (как на Avito) ─────────────────────
// Поля с ключами brand/model/memory сохраняются в одноимённые колонки
// listings; остальные ключи — в JSONB attributes.
// Каждое поле может быть фильтром: number → диапазон, select → выбор,
// text (кроме brand) в фильтрах не участвует.

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
  noFilter?: boolean; // не показывать как фильтр (напр. цвет, модель)
}

export interface SubCategory {
  slug: string;
  ru: string;
  uz: string;
  hasCondition?: boolean; // переключатель Новый / Б.у.
  priceRu?: string; // переопределение подписи цены (напр. «Зарплата»)
  priceUz?: string;
  fields: AttrField[];
}

export interface Category {
  slug: string;
  ru: string;
  uz: string;
  icon: string;
  sub: SubCategory[];
}

// ── Наборы опций ─────────────────────────────────────────────────
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
  { v: 'wagon', ru: 'Универсал', uz: 'Universal' },
];
const DRIVE: Opt[] = [
  { v: 'front', ru: 'Передний', uz: 'Old' },
  { v: 'rear', ru: 'Задний', uz: 'Orqa' },
  { v: 'full', ru: 'Полный', uz: 'To‘liq' },
];
const ROOMS: Opt[] = [
  { v: 'studio', ru: 'Студия', uz: 'Studiya' },
  { v: '1', ru: '1' },
  { v: '2', ru: '2' },
  { v: '3', ru: '3' },
  { v: '4', ru: '4' },
  { v: '5+', ru: '5+' },
];
const BUILDING: Opt[] = [
  { v: 'brick', ru: 'Кирпичный', uz: 'G‘ishtli' },
  { v: 'panel', ru: 'Панельный', uz: 'Panelli' },
  { v: 'monolith', ru: 'Монолитный', uz: 'Monolit' },
  { v: 'block', ru: 'Блочный', uz: 'Blokli' },
];
const RENOVATION: Opt[] = [
  { v: 'euro', ru: 'Евроремонт', uz: 'Yevroremont' },
  { v: 'good', ru: 'Хороший', uz: 'Yaxshi' },
  { v: 'middle', ru: 'Средний', uz: 'O‘rtacha' },
  { v: 'none', ru: 'Требует ремонта', uz: 'Ta’mir kerak' },
  { v: 'rough', ru: 'Без ремонта (черновая)', uz: 'Ta’mirsiz' },
];
const RENT_PERIOD: Opt[] = [
  { v: 'month', ru: 'Помесячно', uz: 'Oylik' },
  { v: 'day', ru: 'Посуточно', uz: 'Kunlik' },
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
  { v: 'intern', ru: 'Стажировка', uz: 'Amaliyot' },
];
const EXPERIENCE: Opt[] = [
  { v: 'none', ru: 'Без опыта', uz: 'Tajribasiz' },
  { v: '1-3', ru: '1–3 года', uz: '1–3 yil' },
  { v: '3-6', ru: '3–6 лет', uz: '3–6 yil' },
  { v: '6+', ru: 'Более 6 лет', uz: '6+ yil' },
];

// ── Фабрики полей ────────────────────────────────────────────────
const brand = (ru = 'Бренд', uz = 'Brend'): AttrField => ({ key: 'brand', ru, uz, type: 'text' });
const model = (): AttrField => ({ key: 'model', ru: 'Модель', uz: 'Model', type: 'text', noFilter: true });
const memory = (): AttrField => ({ key: 'memory', ru: 'Память', uz: 'Xotira', type: 'text' });
const year = (): AttrField => ({ key: 'year', ru: 'Год выпуска', uz: 'Yili', type: 'number' });
const color = (): AttrField => ({ key: 'color', ru: 'Цвет', uz: 'Rang', type: 'text', noFilter: true });
const txt = (key: string, ru: string, uz: string, noFilter = false): AttrField => ({ key, ru, uz, type: 'text', noFilter });
const num = (key: string, ru: string, uz: string, unit?: string): AttrField => ({ key, ru, uz, type: 'number', unit });
const sel = (key: string, ru: string, uz: string, options: Opt[]): AttrField => ({ key, ru, uz, type: 'select', options });

export const CATEGORIES: Category[] = [
  {
    slug: 'electronics',
    ru: 'Электроника',
    uz: 'Elektronika',
    icon: '📱',
    sub: [
      { slug: 'smartphones', ru: 'Смартфоны', uz: 'Smartfonlar', hasCondition: true, fields: [brand(), model(), memory(), color()] },
      {
        slug: 'laptops', ru: 'Ноутбуки', uz: 'Noutbuklar', hasCondition: true,
        fields: [brand(), txt('processor', 'Процессор', 'Protsessor'), num('ram', 'Оперативная память', 'Tezkor xotira', 'ГБ'), txt('storage', 'Накопитель', 'Saqlash'), num('screen', 'Экран', 'Ekran', '"')],
      },
      { slug: 'tablets', ru: 'Планшеты', uz: 'Planshetlar', hasCondition: true, fields: [brand(), model(), memory()] },
      { slug: 'tv', ru: 'ТВ и проекторы', uz: 'TV va proyektorlar', hasCondition: true, fields: [brand(), num('screen', 'Диагональ', 'Diagonal', '"')] },
      { slug: 'audio', ru: 'Наушники и аудио', uz: 'Quloqchin va audio', hasCondition: true, fields: [brand(), txt('atype', 'Тип', 'Turi')] },
      { slug: 'smartwatch', ru: 'Умные часы', uz: 'Aqlli soatlar', hasCondition: true, fields: [brand(), model()] },
      { slug: 'consoles', ru: 'Игровые приставки', uz: 'Konsollar', hasCondition: true, fields: [brand(), model()] },
      { slug: 'cameras', ru: 'Фото и видео', uz: 'Foto va video', hasCondition: true, fields: [brand(), txt('ctype', 'Тип', 'Turi')] },
      { slug: 'accessories', ru: 'Аксессуары', uz: 'Aksessuarlar', hasCondition: true, fields: [brand(), txt('atype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'transport',
    ru: 'Транспорт',
    uz: 'Transport',
    icon: '🚗',
    sub: [
      {
        slug: 'cars', ru: 'Автомобили', uz: 'Avtomobillar',
        fields: [brand('Марка', 'Marka'), model(), year(), num('mileage', 'Пробег', 'Yurgan masofasi', 'км'), sel('transmission', 'Коробка', 'Uzatma', TRANSMISSION), sel('fuel', 'Топливо', 'Yoqilg‘i', FUEL), sel('body', 'Кузов', 'Kuzov', BODY), sel('drive', 'Привод', 'Uzatma turi', DRIVE), num('engine', 'Объём двигателя', 'Dvigatel hajmi', 'л'), color()],
      },
      { slug: 'moto', ru: 'Мотоциклы и мопеды', uz: 'Mototsikllar', fields: [brand('Марка', 'Marka'), year(), num('engine', 'Объём', 'Hajmi', 'см³'), num('mileage', 'Пробег', 'Masofa', 'км')] },
      { slug: 'trucks', ru: 'Грузовики и спецтехника', uz: 'Yuk va maxsus texnika', fields: [brand('Марка', 'Marka'), year(), num('mileage', 'Пробег', 'Masofa', 'км')] },
      { slug: 'bus', ru: 'Автобусы', uz: 'Avtobuslar', fields: [brand('Марка', 'Marka'), year(), num('mileage', 'Пробег', 'Masofa', 'км')] },
      { slug: 'parts', ru: 'Запчасти и аксессуары', uz: 'Ehtiyot qismlar', hasCondition: true, fields: [txt('ptype', 'Тип', 'Turi'), brand('Марка авто', 'Avto markasi')] },
    ],
  },
  {
    slug: 'realty',
    ru: 'Недвижимость',
    uz: 'Ko‘chmas mulk',
    icon: '🏠',
    sub: [
      {
        slug: 'flat_sale', ru: 'Квартиры — продажа', uz: 'Kvartiralar — sotuv',
        fields: [sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь', 'Maydon', 'м²'), num('floor', 'Этаж', 'Qavat'), num('floors', 'Этажей в доме', 'Bino qavatlari'), sel('building', 'Тип дома', 'Bino turi', BUILDING), sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION)],
      },
      {
        slug: 'flat_rent', ru: 'Квартиры — аренда', uz: 'Kvartiralar — ijara', priceRu: 'Цена аренды, сум', priceUz: 'Ijara narxi, so‘m',
        fields: [sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь', 'Maydon', 'м²'), num('floor', 'Этаж', 'Qavat'), sel('rent_period', 'Срок', 'Muddat', RENT_PERIOD), sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION)],
      },
      {
        slug: 'house', ru: 'Дома и дачи', uz: 'Uy va dala hovli',
        fields: [sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь дома', 'Uy maydoni', 'м²'), num('land', 'Участок', 'Yer maydoni', 'сот'), sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION)],
      },
      { slug: 'commercial', ru: 'Коммерческая', uz: 'Tijorat', fields: [num('area', 'Площадь', 'Maydon', 'м²'), txt('ptype', 'Тип', 'Turi')] },
      { slug: 'land', ru: 'Участки', uz: 'Yer uchastkalari', fields: [num('land', 'Площадь', 'Maydon', 'сот')] },
      { slug: 'garage', ru: 'Гаражи и стоянки', uz: 'Garajlar', fields: [num('area', 'Площадь', 'Maydon', 'м²')] },
    ],
  },
  {
    slug: 'jobs',
    ru: 'Работа',
    uz: 'Ish',
    icon: '💼',
    sub: [
      {
        slug: 'vacancy', ru: 'Вакансии', uz: 'Bo‘sh ish o‘rinlari', priceRu: 'Зарплата, сум', priceUz: 'Maosh, so‘m',
        fields: [txt('position', 'Должность', 'Lavozim', true), sel('employment', 'Занятость', 'Bandlik', EMPLOYMENT), sel('experience', 'Опыт', 'Tajriba', EXPERIENCE)],
      },
      {
        slug: 'resume', ru: 'Резюме', uz: 'Rezyume', priceRu: 'Зарплата от, сум', priceUz: 'Maosh, so‘m',
        fields: [txt('position', 'Желаемая должность', 'Istalgan lavozim', true), sel('experience', 'Опыт', 'Tajriba', EXPERIENCE), sel('employment', 'Занятость', 'Bandlik', EMPLOYMENT)],
      },
    ],
  },
  {
    slug: 'personal',
    ru: 'Личные вещи',
    uz: 'Shaxsiy buyumlar',
    icon: '👕',
    sub: [
      { slug: 'clothes', ru: 'Одежда', uz: 'Kiyim', hasCondition: true, fields: [sel('gender', 'Пол', 'Jinsi', GENDER), sel('size', 'Размер', 'O‘lcham', SIZE_CLOTHES), brand()] },
      { slug: 'shoes', ru: 'Обувь', uz: 'Oyoq kiyim', hasCondition: true, fields: [sel('gender', 'Пол', 'Jinsi', GENDER), num('size', 'Размер', 'O‘lcham'), brand()] },
      { slug: 'bags', ru: 'Сумки и аксессуары', uz: 'Sumkalar', hasCondition: true, fields: [brand(), txt('btype', 'Тип', 'Turi')] },
      { slug: 'kids', ru: 'Детские товары', uz: 'Bolalar buyumlari', hasCondition: true, fields: [txt('ktype', 'Тип', 'Turi')] },
      { slug: 'beauty', ru: 'Красота и здоровье', uz: 'Go‘zallik va salomatlik', hasCondition: true, fields: [txt('btype', 'Тип', 'Turi')] },
      { slug: 'watches', ru: 'Часы и украшения', uz: 'Soat va taqinchoqlar', hasCondition: true, fields: [brand(), txt('wtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'home',
    ru: 'Дом и сад',
    uz: 'Uy va bog‘',
    icon: '🏡',
    sub: [
      { slug: 'furniture', ru: 'Мебель', uz: 'Mebel', hasCondition: true, fields: [txt('ftype', 'Тип', 'Turi'), txt('material', 'Материал', 'Material', true)] },
      { slug: 'appliances', ru: 'Бытовая техника', uz: 'Maishiy texnika', hasCondition: true, fields: [brand(), txt('atype', 'Тип', 'Turi')] },
      { slug: 'kitchenware', ru: 'Посуда и кухня', uz: 'Idish va oshxona', hasCondition: true, fields: [txt('ktype', 'Тип', 'Turi')] },
      { slug: 'repair', ru: 'Ремонт и стройматериалы', uz: 'Ta’mir va qurilish', hasCondition: true, fields: [txt('rtype', 'Тип', 'Turi')] },
      { slug: 'tools', ru: 'Инструменты', uz: 'Asboblar', hasCondition: true, fields: [brand(), txt('ttype', 'Тип', 'Turi')] },
      { slug: 'plants', ru: 'Растения', uz: 'O‘simliklar', fields: [txt('ptype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'hobby',
    ru: 'Хобби и отдых',
    uz: 'Hobbi va dam olish',
    icon: '🎸',
    sub: [
      { slug: 'sport', ru: 'Спорт и фитнес', uz: 'Sport va fitnes', hasCondition: true, fields: [txt('stype', 'Тип', 'Turi'), brand()] },
      { slug: 'bikes', ru: 'Велосипеды', uz: 'Velosipedlar', hasCondition: true, fields: [brand(), txt('btype', 'Тип', 'Turi')] },
      { slug: 'music', ru: 'Музыкальные инструменты', uz: 'Musiqa asboblari', hasCondition: true, fields: [txt('mtype', 'Тип', 'Turi'), brand()] },
      { slug: 'books', ru: 'Книги и журналы', uz: 'Kitob va jurnallar', hasCondition: true, fields: [txt('btype', 'Тип', 'Turi')] },
      { slug: 'collection', ru: 'Коллекционирование', uz: 'Kolleksiya', hasCondition: true, fields: [txt('ctype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'animals',
    ru: 'Животные',
    uz: 'Hayvonlar',
    icon: '🐾',
    sub: [
      { slug: 'dogs', ru: 'Собаки', uz: 'Itlar', fields: [txt('breed', 'Порода', 'Zoti')] },
      { slug: 'cats', ru: 'Кошки', uz: 'Mushuklar', fields: [txt('breed', 'Порода', 'Zoti')] },
      { slug: 'birds', ru: 'Птицы', uz: 'Qushlar', fields: [txt('species', 'Вид', 'Turi')] },
      { slug: 'fish', ru: 'Аквариум', uz: 'Akvarium', fields: [txt('species', 'Вид', 'Turi')] },
      { slug: 'pet_goods', ru: 'Товары для животных', uz: 'Hayvon mollari', hasCondition: true, fields: [txt('gtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'business',
    ru: 'Бизнес и оборудование',
    uz: 'Biznes va jihozlar',
    icon: '🏭',
    sub: [
      { slug: 'equipment', ru: 'Оборудование', uz: 'Jihozlar', hasCondition: true, fields: [txt('etype', 'Тип', 'Turi'), brand()] },
      { slug: 'ready_business', ru: 'Готовый бизнес', uz: 'Tayyor biznes', fields: [txt('btype', 'Сфера', 'Soha')] },
      { slug: 'materials', ru: 'Сырьё и материалы', uz: 'Xom ashyo', fields: [txt('mtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'services',
    ru: 'Услуги',
    uz: 'Xizmatlar',
    icon: '🛠️',
    sub: [
      { slug: 'services_all', ru: 'Услуги', uz: 'Xizmatlar', priceRu: 'Цена от, сум', priceUz: 'Narx, so‘m', fields: [txt('stype', 'Вид услуги', 'Xizmat turi')] },
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
export function optName(field: AttrField, value: string, lang: Lang): string {
  const o = field.options?.find((x) => x.v === value);
  return o ? optLabel(o, lang) : value;
}
export function priceLabel(cat: string | null | undefined, sub: string | null | undefined, lang: Lang): string | null {
  const s = subBySlug(cat, sub);
  if (s?.priceRu) return lang === 'uz' ? s.priceUz ?? s.priceRu : s.priceRu;
  return null;
}

// Колонки listings, в которые маппятся одноимённые поля (не в JSONB)
export const COLUMN_KEYS = ['brand', 'model', 'memory'];
