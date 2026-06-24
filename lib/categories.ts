import type { Lang } from './types';

// ── Характеристики категорий (по образцу Avito) ─────────────────
// brand/model/memory → одноимённые колонки listings; остальное → JSONB attributes.
// Фильтры: number → диапазон, select → выбор, brand → из значений,
// text/noFilter → в фильтрах не участвуют.

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
  noFilter?: boolean;
}

export interface SubCategory {
  slug: string;
  ru: string;
  uz: string;
  hasCondition?: boolean;
  priceRu?: string;
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

// ── Справочники опций ────────────────────────────────────────────
const O = (ru: string, uz?: string, v?: string): Opt => ({ v: v ?? ru, ru, uz });

const YESNO: Opt[] = [O('Да', 'Ha', 'yes'), O('Нет', 'Yo‘q', 'no')];
const COLORS: Opt[] = [
  O('Белый', 'Oq', 'white'), O('Чёрный', 'Qora', 'black'), O('Серый', 'Kulrang', 'gray'),
  O('Серебристый', 'Kumush', 'silver'), O('Красный', 'Qizil', 'red'), O('Синий', 'Ko‘k', 'blue'),
  O('Зелёный', 'Yashil', 'green'), O('Жёлтый', 'Sariq', 'yellow'), O('Коричневый', 'Jigarrang', 'brown'),
  O('Бежевый', 'Bej', 'beige'), O('Золотистый', 'Oltin', 'gold'), O('Другой', 'Boshqa', 'other'),
];

// — Авто —
const CAR_MAKES: Opt[] = [
  'Chevrolet', 'Daewoo', 'Ravon', 'Lada (ВАЗ)', 'Kia', 'Hyundai', 'Toyota', 'Nissan', 'Honda',
  'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Lexus', 'Mazda', 'Mitsubishi', 'Ford', 'Renault',
  'Skoda', 'Opel', 'Geely', 'Chery', 'BYD', 'Haval', 'Changan', 'Zeekr', 'Li Auto', 'JAC', 'Subaru',
].map((m) => O(m, undefined, m)).concat([O('Другая', 'Boshqa', 'other')]);
const TRANSMISSION: Opt[] = [O('Механика', 'Mexanika', 'mt'), O('Автомат', 'Avtomat', 'at'), O('Вариатор', 'Variator', 'cvt'), O('Робот', 'Robot', 'robot')];
const FUEL: Opt[] = [O('Бензин', 'Benzin', 'petrol'), O('Газ/Бензин', 'Gaz/Benzin', 'gas'), O('Дизель', 'Dizel', 'diesel'), O('Электро', 'Elektro', 'electro'), O('Гибрид', 'Gibrid', 'hybrid')];
const BODY: Opt[] = [O('Седан', 'Sedan', 'sedan'), O('Хэтчбек', 'Xetchbek', 'hatchback'), O('Внедорожник', 'SUV', 'suv'), O('Кроссовер', 'Krossover', 'crossover'), O('Минивэн', 'Miniven', 'minivan'), O('Универсал', 'Universal', 'wagon'), O('Купе', 'Kupe', 'coupe'), O('Пикап', 'Pikap', 'pickup'), O('Кабриолет', 'Kabriolet', 'cabrio')];
const DRIVE: Opt[] = [O('Передний', 'Old', 'front'), O('Задний', 'Orqa', 'rear'), O('Полный', 'To‘liq', 'full')];
const STEERING: Opt[] = [O('Левый', 'Chap', 'left'), O('Правый', 'O‘ng', 'right')];
const CAR_STATE: Opt[] = [O('Не битый', 'Shikastsiz', 'clean'), O('Битый', 'Shikastlangan', 'damaged'), O('На запчасти', 'Ehtiyot qism uchun', 'parts')];
const OWNERS: Opt[] = [O('1', undefined, '1'), O('2', undefined, '2'), O('3 и более', '3+', '3+')];
const CUSTOMS: Opt[] = [O('Растаможен', 'Rastamojka qilingan', 'cleared'), O('Не растаможен', 'Rastamojka qilinmagan', 'not')];
const MOTO_TYPE: Opt[] = [O('Мотоцикл', 'Mototsikl', 'moto'), O('Скутер', 'Skuter', 'scooter'), O('Мопед', 'Moped', 'moped'), O('Квадроцикл', 'Kvadrotsikl', 'atv')];
const TRUCK_TYPE: Opt[] = [O('Грузовик', 'Yuk mashina', 'truck'), O('Тягач', 'Tortuvchi', 'tractor'), O('Спецтехника', 'Maxsus texnika', 'special'), O('Прицеп', 'Tirkama', 'trailer'), O('Автобус', 'Avtobus', 'bus')];

// — Недвижимость —
const ROOMS: Opt[] = [O('Студия', 'Studiya', 'studio'), O('1', undefined, '1'), O('2', undefined, '2'), O('3', undefined, '3'), O('4', undefined, '4'), O('5 и более', '5+', '5+')];
const BUILDING: Opt[] = [O('Кирпичный', 'G‘ishtli', 'brick'), O('Панельный', 'Panelli', 'panel'), O('Монолитный', 'Monolit', 'monolith'), O('Блочный', 'Blokli', 'block'), O('Деревянный', 'Yog‘och', 'wood')];
const RENOVATION: Opt[] = [O('Евроремонт', 'Yevroremont', 'euro'), O('Хороший', 'Yaxshi', 'good'), O('Средний', 'O‘rtacha', 'middle'), O('Требует ремонта', 'Ta’mir kerak', 'need'), O('Без ремонта (черновая)', 'Ta’mirsiz', 'rough')];
const BATHROOM: Opt[] = [O('Раздельный', 'Alohida', 'split'), O('Совмещённый', 'Birlashgan', 'combined'), O('2 и более', '2+', 'multi')];
const BALCONY: Opt[] = [O('Балкон', 'Balkon', 'balcony'), O('Лоджия', 'Lodjiya', 'loggia'), O('Нет', 'Yo‘q', 'none')];
const MARKET: Opt[] = [O('Новостройка', 'Yangi bino', 'new'), O('Вторичка', 'Ikkilamchi', 'second')];
const FURNISHED: Opt[] = [O('Есть', 'Bor', 'yes'), O('Частично', 'Qisman', 'part'), O('Нет', 'Yo‘q', 'no')];
const RENT_PERIOD: Opt[] = [O('Помесячно', 'Oylik', 'month'), O('Посуточно', 'Kunlik', 'day')];
const HOUSE_MATERIAL: Opt[] = [O('Кирпич', 'G‘isht', 'brick'), O('Блок', 'Blok', 'block'), O('Дерево', 'Yog‘och', 'wood'), O('Каркас', 'Karkas', 'frame')];
const LAND_PURPOSE: Opt[] = [O('ИЖС', 'IJS', 'izhs'), O('Садовый', 'Bog‘', 'garden'), O('Сельхоз', 'Qishloq xo‘jaligi', 'agri'), O('Коммерческая', 'Tijorat', 'commercial')];
const COMMERCIAL_TYPE: Opt[] = [O('Офис', 'Ofis', 'office'), O('Магазин', 'Do‘kon', 'shop'), O('Склад', 'Ombor', 'warehouse'), O('Производство', 'Ishlab chiqarish', 'production'), O('Общепит', 'Umumiy ovqatlanish', 'food'), O('Свободное назначение', 'Erkin', 'free')];
const GARAGE_TYPE: Opt[] = [O('Гараж', 'Garaj', 'garage'), O('Машиноместо', 'Moshina joyi', 'parking'), O('Бокс', 'Boks', 'box')];

// — Работа —
const EMPLOYMENT: Opt[] = [O('Полная занятость', 'To‘liq', 'full'), O('Частичная', 'Qisman', 'part'), O('Сменный график', 'Smenali', 'shift'), O('Удалённо', 'Masofadan', 'remote'), O('Стажировка', 'Amaliyot', 'intern'), O('Вахта', 'Vaxta', 'rotation')];
const EXPERIENCE: Opt[] = [O('Без опыта', 'Tajribasiz', 'none'), O('1–3 года', '1–3 yil', '1-3'), O('3–6 лет', '3–6 yil', '3-6'), O('Более 6 лет', '6+ yil', '6+')];
const SCHEDULE: Opt[] = [O('5/2', undefined, '5-2'), O('6/1', undefined, '6-1'), O('2/2', undefined, '2-2'), O('Гибкий', 'Moslashuvchan', 'flex'), O('Свободный', 'Erkin', 'free')];
const EDUCATION: Opt[] = [O('Не важно', 'Muhim emas', 'any'), O('Среднее', 'O‘rta', 'secondary'), O('Среднее спец.', 'O‘rta maxsus', 'special'), O('Высшее', 'Oliy', 'higher')];

// — Личные вещи —
const SIZE_CLOTHES: Opt[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((s) => O(s, undefined, s));
const GENDER: Opt[] = [O('Мужской', 'Erkak', 'male'), O('Женский', 'Ayol', 'female'), O('Унисекс', 'Uniseks', 'unisex')];
const SEASON: Opt[] = [O('Лето', 'Yoz', 'summer'), O('Зима', 'Qish', 'winter'), O('Демисезон', 'Mavsumiy', 'demi'), O('Всесезон', 'Hamma mavsum', 'all')];
const CLOTHES_TYPE: Opt[] = [O('Верхняя одежда', 'Ustki kiyim', 'outer'), O('Платья', 'Ko‘ylaklar', 'dress'), O('Брюки и джинсы', 'Shimlar', 'pants'), O('Рубашки и блузки', 'Ko‘ylak/bluzka', 'shirt'), O('Футболки', 'Futbolkalar', 'tshirt'), O('Спортивная', 'Sport', 'sport'), O('Другое', 'Boshqa', 'other')];
const SHOE_TYPE: Opt[] = [O('Кроссовки', 'Krossovkalar', 'sneakers'), O('Туфли', 'Tuflilar', 'shoes'), O('Ботинки', 'Botinkalar', 'boots'), O('Сапоги', 'Etiklar', 'highboots'), O('Сандалии', 'Sandallar', 'sandals')];
const BAG_TYPE: Opt[] = [O('Сумки', 'Sumkalar', 'bag'), O('Рюкзаки', 'Ryukzaklar', 'backpack'), O('Кошельки', 'Hamyonlar', 'wallet'), O('Чемоданы', 'Chamadonlar', 'suitcase')];
const KIDS_TYPE: Opt[] = [O('Коляски', 'Kolyaskalar', 'stroller'), O('Автокресла', 'Avtokreslolar', 'carseat'), O('Игрушки', 'O‘yinchoqlar', 'toys'), O('Одежда', 'Kiyim', 'clothes'), O('Мебель', 'Mebel', 'furniture')];
const KIDS_AGE: Opt[] = [O('0–1 год', '0–1', '0-1'), O('1–3 года', '1–3', '1-3'), O('3–6 лет', '3–6', '3-6'), O('6–12 лет', '6–12', '6-12')];
const BEAUTY_TYPE: Opt[] = [O('Парфюмерия', 'Parfyumeriya', 'perfume'), O('Уход', 'Parvarish', 'care'), O('Макияж', 'Makiyaj', 'makeup'), O('Техника для красоты', 'Texnika', 'device')];
const WATCH_TYPE: Opt[] = [O('Наручные', 'Qo‘l soati', 'wrist'), O('Умные', 'Aqlli', 'smart'), O('Настенные', 'Devor', 'wall'), O('Украшения', 'Taqinchoq', 'jewelry')];

// — Дом и сад —
const FURNITURE_TYPE: Opt[] = [O('Диваны и кресла', 'Divan/kreslo', 'sofa'), O('Кровати', 'Krovatlar', 'bed'), O('Шкафы', 'Shkaflar', 'wardrobe'), O('Столы и стулья', 'Stol/stul', 'table'), O('Кухонные гарнитуры', 'Oshxona', 'kitchen'), O('Детская мебель', 'Bolalar mebeli', 'kids')];
const APPLIANCE_TYPE: Opt[] = [O('Холодильники', 'Muzlatgich', 'fridge'), O('Стиральные машины', 'Kir mashinasi', 'washer'), O('Плиты', 'Plitalar', 'stove'), O('Посудомоечные', 'Idishyuvar', 'dishwasher'), O('Кондиционеры', 'Konditsioner', 'ac'), O('Пылесосы', 'Changyutgich', 'vacuum'), O('Микроволновки', 'Mikroto‘lqin', 'microwave'), O('Телевизоры', 'Televizor', 'tv')];
const KITCHEN_TYPE: Opt[] = [O('Посуда', 'Idish', 'dishes'), O('Кухонная утварь', 'Oshxona buyumlari', 'utensils'), O('Хранение', 'Saqlash', 'storage')];
const REPAIR_TYPE: Opt[] = [O('Стройматериалы', 'Qurilish mollari', 'materials'), O('Сантехника', 'Santexnika', 'plumbing'), O('Электрика', 'Elektrika', 'electric'), O('Двери', 'Eshiklar', 'doors'), O('Окна', 'Derazalar', 'windows')];
const TOOL_TYPE: Opt[] = [O('Ручной инструмент', 'Qo‘l asbobi', 'hand'), O('Электроинструмент', 'Elektr asbob', 'power'), O('Садовый инструмент', 'Bog‘ asbobi', 'garden'), O('Измерительный', 'O‘lchov', 'measure')];
const PLANT_TYPE: Opt[] = [O('Комнатные', 'Xona', 'indoor'), O('Садовые', 'Bog‘', 'garden'), O('Рассада', 'Ko‘chat', 'seedling'), O('Семена', 'Urug‘', 'seeds')];

// — Хобби —
const SPORT_TYPE: Opt[] = [O('Тренажёры', 'Trenajyorlar', 'gym'), O('Зимний спорт', 'Qishki sport', 'winter'), O('Туризм', 'Turizm', 'tourism'), O('Единоборства', 'Yakkakurash', 'martial'), O('Фитнес', 'Fitnes', 'fitness'), O('Командные виды', 'Jamoaviy', 'team')];
const BIKE_TYPE: Opt[] = [O('Горный', 'Tog‘', 'mtb'), O('Городской', 'Shahar', 'city'), O('Шоссейный', 'Shosse', 'road'), O('Детский', 'Bolalar', 'kids'), O('BMX', undefined, 'bmx'), O('Электро', 'Elektro', 'electric')];
const MUSIC_TYPE: Opt[] = [O('Гитары', 'Gitaralar', 'guitar'), O('Клавишные', 'Klavishli', 'keys'), O('Духовые', 'Puflama', 'wind'), O('Ударные', 'Zarbli', 'drums'), O('Студийное', 'Studiya', 'studio')];
const BOOK_TYPE: Opt[] = [O('Художественная', 'Badiiy', 'fiction'), O('Учебная', 'O‘quv', 'study'), O('Детская', 'Bolalar', 'kids'), O('Бизнес', 'Biznes', 'business'), O('Религиозная', 'Diniy', 'religion')];
const LANG_OPT: Opt[] = [O('Русский', 'Rus', 'ru'), O('Узбекский', 'O‘zbek', 'uz'), O('Английский', 'Ingliz', 'en'), O('Другой', 'Boshqa', 'other')];
const COLLECTION_TYPE: Opt[] = [O('Монеты', 'Tangalar', 'coins'), O('Марки', 'Markalar', 'stamps'), O('Банкноты', 'Banknotalar', 'banknotes'), O('Антиквариат', 'Antikvariat', 'antique'), O('Значки', 'Nishonlar', 'badges')];

// — Животные —
const PET_AGE: Opt[] = [O('До 1 года', '1 yoshgача', 'puppy'), O('1–3 года', '1–3', '1-3'), O('Старше 3 лет', '3+', '3+')];
const PEDIGREE: Opt[] = [O('С документами', 'Hujjatli', 'docs'), O('Без документов', 'Hujjatsiz', 'nodocs')];
const PET_GOODS_TYPE: Opt[] = [O('Корма', 'Yem', 'food'), O('Аквариумы', 'Akvariumlar', 'aqua'), O('Клетки и домики', 'Kataklar', 'cage'), O('Одежда', 'Kiyim', 'clothes'), O('Аксессуары', 'Aksessuarlar', 'acc')];

// — Бизнес —
const EQUIP_TYPE: Opt[] = [O('Торговое', 'Savdo', 'trade'), O('Промышленное', 'Sanoat', 'industrial'), O('Строительное', 'Qurilish', 'construction'), O('Общепит', 'Umumiy ovqat', 'food'), O('Медицинское', 'Tibbiy', 'medical'), O('Офисное', 'Ofis', 'office')];
const BUSINESS_TYPE: Opt[] = [O('Общепит', 'Umumiy ovqat', 'food'), O('Услуги', 'Xizmatlar', 'services'), O('Торговля', 'Savdo', 'trade'), O('Производство', 'Ishlab chiqarish', 'production'), O('Интернет', 'Internet', 'online')];

// — Услуги —
const SERVICE_TYPE: Opt[] = [O('Ремонт и строительство', 'Ta’mir va qurilish', 'repair'), O('Красота и здоровье', 'Go‘zallik', 'beauty'), O('Обучение и курсы', 'Ta’lim', 'edu'), O('Перевозки', 'Tashish', 'transport'), O('IT и интернет', 'IT', 'it'), O('Уборка', 'Tozalash', 'clean'), O('Юридические', 'Yuridik', 'legal'), O('Мероприятия', 'Tadbirlar', 'event'), O('Фото и видео', 'Foto/video', 'photo')];

// ── Фабрики полей ────────────────────────────────────────────────
const brand = (ru = 'Бренд', uz = 'Brend', options?: Opt[]): AttrField => ({ key: 'brand', ru, uz, type: options ? 'select' : 'text', options });
const model = (): AttrField => ({ key: 'model', ru: 'Модель', uz: 'Model', type: 'text', noFilter: true });
const memory = (): AttrField => ({ key: 'memory', ru: 'Память', uz: 'Xotira', type: 'text' });
const year = (): AttrField => ({ key: 'year', ru: 'Год выпуска', uz: 'Yili', type: 'number' });
const colorF = (): AttrField => ({ key: 'color', ru: 'Цвет', uz: 'Rang', type: 'select', options: COLORS });
const txt = (key: string, ru: string, uz: string, noFilter = false): AttrField => ({ key, ru, uz, type: 'text', noFilter });
const num = (key: string, ru: string, uz: string, unit?: string): AttrField => ({ key, ru, uz, type: 'number', unit });
const sel = (key: string, ru: string, uz: string, options: Opt[]): AttrField => ({ key, ru, uz, type: 'select', options });

export const CATEGORIES: Category[] = [
  {
    slug: 'electronics', ru: 'Электроника', uz: 'Elektronika', icon: '📱',
    sub: [
      { slug: 'smartphones', ru: 'Смартфоны', uz: 'Smartfonlar', hasCondition: true, fields: [brand(), model(), memory(), num('ram', 'Оперативная память', 'Tezkor xotira', 'ГБ'), colorF()] },
      { slug: 'laptops', ru: 'Ноутбуки', uz: 'Noutbuklar', hasCondition: true, fields: [brand(), model(), txt('processor', 'Процессор', 'Protsessor'), num('ram', 'Оперативная память', 'Tezkor xotira', 'ГБ'), num('storage', 'Накопитель', 'Saqlash', 'ГБ'), num('screen', 'Экран', 'Ekran', '"'), colorF()] },
      { slug: 'tablets', ru: 'Планшеты', uz: 'Planshetlar', hasCondition: true, fields: [brand(), model(), memory(), num('screen', 'Экран', 'Ekran', '"')] },
      { slug: 'tv', ru: 'ТВ и проекторы', uz: 'TV va proyektorlar', hasCondition: true, fields: [brand(), num('screen', 'Диагональ', 'Diagonal', '"'), sel('smart', 'Smart TV', 'Smart TV', YESNO)] },
      { slug: 'audio', ru: 'Наушники и аудио', uz: 'Quloqchin va audio', hasCondition: true, fields: [brand(), txt('atype', 'Тип', 'Turi')] },
      { slug: 'smartwatch', ru: 'Умные часы', uz: 'Aqlli soatlar', hasCondition: true, fields: [brand(), model()] },
      { slug: 'consoles', ru: 'Игровые приставки', uz: 'Konsollar', hasCondition: true, fields: [brand(), model(), memory()] },
      { slug: 'cameras', ru: 'Фото и видео', uz: 'Foto va video', hasCondition: true, fields: [brand(), txt('ctype', 'Тип', 'Turi')] },
      { slug: 'accessories', ru: 'Аксессуары', uz: 'Aksessuarlar', hasCondition: true, fields: [brand(), txt('atype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'transport', ru: 'Транспорт', uz: 'Transport', icon: '🚗',
    sub: [
      {
        slug: 'cars', ru: 'Автомобили', uz: 'Avtomobillar',
        fields: [
          brand('Марка', 'Marka', CAR_MAKES), model(), year(), num('mileage', 'Пробег', 'Yurgan masofasi', 'км'),
          sel('transmission', 'Коробка передач', 'Uzatma', TRANSMISSION), sel('fuel', 'Тип топлива', 'Yoqilg‘i', FUEL),
          sel('body', 'Тип кузова', 'Kuzov', BODY), sel('drive', 'Привод', 'Uzatma turi', DRIVE),
          num('engine', 'Объём двигателя', 'Dvigatel hajmi', 'л'), num('power', 'Мощность', 'Quvvat', 'л.с.'),
          colorF(), sel('steering', 'Руль', 'Rul', STEERING), sel('car_state', 'Состояние', 'Holati', CAR_STATE),
          sel('owners', 'Владельцев', 'Egalari', OWNERS), sel('customs', 'Растаможка', 'Rastamojka', CUSTOMS),
        ],
      },
      { slug: 'moto', ru: 'Мотоциклы и мототехника', uz: 'Mototexnika', fields: [sel('moto_type', 'Тип', 'Turi', MOTO_TYPE), brand('Марка', 'Marka'), year(), num('engine', 'Объём', 'Hajmi', 'см³'), num('mileage', 'Пробег', 'Masofa', 'км')] },
      { slug: 'trucks', ru: 'Грузовики и спецтехника', uz: 'Yuk va maxsus texnika', fields: [sel('truck_type', 'Тип', 'Turi', TRUCK_TYPE), brand('Марка', 'Marka'), year(), num('mileage', 'Пробег', 'Masofa', 'км')] },
      { slug: 'parts', ru: 'Запчасти и аксессуары', uz: 'Ehtiyot qismlar', hasCondition: true, fields: [txt('ptype', 'Тип запчасти', 'Qism turi'), brand('Марка авто', 'Avto markasi', CAR_MAKES)] },
      { slug: 'tires', ru: 'Шины и диски', uz: 'Shina va disklar', hasCondition: true, fields: [brand(), num('radius', 'Радиус', 'Radius', 'R'), sel('season', 'Сезон', 'Mavsum', SEASON)] },
    ],
  },
  {
    slug: 'realty', ru: 'Недвижимость', uz: 'Ko‘chmas mulk', icon: '🏠',
    sub: [
      {
        slug: 'flat_sale', ru: 'Квартиры — продажа', uz: 'Kvartiralar — sotuv',
        fields: [
          sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь', 'Maydon', 'м²'), num('living_area', 'Жилая площадь', 'Yashash maydoni', 'м²'),
          num('kitchen_area', 'Площадь кухни', 'Oshxona', 'м²'), num('floor', 'Этаж', 'Qavat'), num('floors', 'Этажей в доме', 'Bino qavatlari'),
          sel('building', 'Тип дома', 'Bino turi', BUILDING), sel('market', 'Тип жилья', 'Uy turi', MARKET),
          sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION), sel('bathroom', 'Санузел', 'Hojatxona', BATHROOM),
          sel('balcony', 'Балкон/лоджия', 'Balkon', BALCONY), sel('furnished', 'Мебель', 'Mebel', FURNISHED), num('year_built', 'Год постройки', 'Qurilgan yili'),
        ],
      },
      {
        slug: 'flat_rent', ru: 'Квартиры — аренда', uz: 'Kvartiralar — ijara', priceRu: 'Цена аренды, сум', priceUz: 'Ijara narxi, so‘m',
        fields: [
          sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь', 'Maydon', 'м²'), num('floor', 'Этаж', 'Qavat'), num('floors', 'Этажей в доме', 'Bino qavatlari'),
          sel('rent_period', 'Срок аренды', 'Muddat', RENT_PERIOD), sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION),
          sel('furnished', 'Мебель', 'Mebel', FURNISHED), sel('appliances', 'Техника', 'Texnika', YESNO),
          sel('pets', 'Можно с животными', 'Hayvon bilan', YESNO), sel('kids', 'Можно с детьми', 'Bolalar bilan', YESNO),
        ],
      },
      {
        slug: 'house', ru: 'Дома и дачи', uz: 'Uy va dala hovli',
        fields: [sel('rooms', 'Комнат', 'Xonalar', ROOMS), num('area', 'Площадь дома', 'Uy maydoni', 'м²'), num('land', 'Участок', 'Yer maydoni', 'сот'), num('house_floors', 'Этажей', 'Qavatlar'), sel('material', 'Материал стен', 'Devor materiali', HOUSE_MATERIAL), sel('renovation', 'Ремонт', 'Ta’mir', RENOVATION), sel('gas', 'Газ', 'Gaz', YESNO), sel('water', 'Водоснабжение', 'Suv', YESNO)],
      },
      { slug: 'commercial', ru: 'Коммерческая', uz: 'Tijorat', fields: [sel('ctype', 'Тип', 'Turi', COMMERCIAL_TYPE), num('area', 'Площадь', 'Maydon', 'м²'), num('floor', 'Этаж', 'Qavat')] },
      { slug: 'land', ru: 'Участки', uz: 'Yer uchastkalari', fields: [num('land', 'Площадь', 'Maydon', 'сот'), sel('purpose', 'Назначение', 'Maqsadi', LAND_PURPOSE)] },
      { slug: 'garage', ru: 'Гаражи и стоянки', uz: 'Garajlar', fields: [sel('gtype', 'Тип', 'Turi', GARAGE_TYPE), num('area', 'Площадь', 'Maydon', 'м²')] },
    ],
  },
  {
    slug: 'jobs', ru: 'Работа', uz: 'Ish', icon: '💼',
    sub: [
      { slug: 'vacancy', ru: 'Вакансии', uz: 'Bo‘sh ish o‘rinlari', priceRu: 'Зарплата, сум', priceUz: 'Maosh, so‘m', fields: [txt('position', 'Должность', 'Lavozim', true), sel('employment', 'Тип занятости', 'Bandlik', EMPLOYMENT), sel('schedule', 'График', 'Jadval', SCHEDULE), sel('experience', 'Опыт работы', 'Tajriba', EXPERIENCE), sel('education', 'Образование', 'Ta’lim', EDUCATION)] },
      { slug: 'resume', ru: 'Резюме', uz: 'Rezyume', priceRu: 'Зарплата от, сум', priceUz: 'Maosh, so‘m', fields: [txt('position', 'Желаемая должность', 'Istalgan lavozim', true), sel('experience', 'Опыт работы', 'Tajriba', EXPERIENCE), sel('employment', 'Занятость', 'Bandlik', EMPLOYMENT), sel('education', 'Образование', 'Ta’lim', EDUCATION), num('age', 'Возраст', 'Yosh')] },
    ],
  },
  {
    slug: 'personal', ru: 'Личные вещи', uz: 'Shaxsiy buyumlar', icon: '👕',
    sub: [
      { slug: 'clothes', ru: 'Одежда', uz: 'Kiyim', hasCondition: true, fields: [sel('ctype', 'Тип', 'Turi', CLOTHES_TYPE), sel('gender', 'Пол', 'Jinsi', GENDER), sel('size', 'Размер', 'O‘lcham', SIZE_CLOTHES), sel('season', 'Сезон', 'Mavsum', SEASON), brand(), colorF()] },
      { slug: 'shoes', ru: 'Обувь', uz: 'Oyoq kiyim', hasCondition: true, fields: [sel('stype', 'Тип', 'Turi', SHOE_TYPE), sel('gender', 'Пол', 'Jinsi', GENDER), num('size', 'Размер', 'O‘lcham'), brand(), colorF()] },
      { slug: 'bags', ru: 'Сумки и аксессуары', uz: 'Sumkalar', hasCondition: true, fields: [sel('btype', 'Тип', 'Turi', BAG_TYPE), brand(), colorF()] },
      { slug: 'kids', ru: 'Детские товары', uz: 'Bolalar buyumlari', hasCondition: true, fields: [sel('ktype', 'Тип', 'Turi', KIDS_TYPE), sel('age', 'Возраст', 'Yosh', KIDS_AGE)] },
      { slug: 'beauty', ru: 'Красота и здоровье', uz: 'Go‘zallik va salomatlik', hasCondition: true, fields: [sel('btype', 'Тип', 'Turi', BEAUTY_TYPE), brand()] },
      { slug: 'watches', ru: 'Часы и украшения', uz: 'Soat va taqinchoqlar', hasCondition: true, fields: [sel('wtype', 'Тип', 'Turi', WATCH_TYPE), brand(), sel('gender', 'Пол', 'Jinsi', GENDER)] },
    ],
  },
  {
    slug: 'home', ru: 'Дом и сад', uz: 'Uy va bog‘', icon: '🏡',
    sub: [
      { slug: 'furniture', ru: 'Мебель', uz: 'Mebel', hasCondition: true, fields: [sel('ftype', 'Тип', 'Turi', FURNITURE_TYPE), txt('material', 'Материал', 'Material', true), colorF()] },
      { slug: 'appliances', ru: 'Бытовая техника', uz: 'Maishiy texnika', hasCondition: true, fields: [sel('atype', 'Тип', 'Turi', APPLIANCE_TYPE), brand()] },
      { slug: 'kitchenware', ru: 'Посуда и кухня', uz: 'Idish va oshxona', hasCondition: true, fields: [sel('ktype', 'Тип', 'Turi', KITCHEN_TYPE)] },
      { slug: 'repair', ru: 'Ремонт и стройматериалы', uz: 'Ta’mir va qurilish', hasCondition: true, fields: [sel('rtype', 'Тип', 'Turi', REPAIR_TYPE)] },
      { slug: 'tools', ru: 'Инструменты', uz: 'Asboblar', hasCondition: true, fields: [sel('ttype', 'Тип', 'Turi', TOOL_TYPE), brand()] },
      { slug: 'plants', ru: 'Растения', uz: 'O‘simliklar', fields: [sel('ptype', 'Тип', 'Turi', PLANT_TYPE)] },
    ],
  },
  {
    slug: 'hobby', ru: 'Хобби и отдых', uz: 'Hobbi va dam olish', icon: '🎸',
    sub: [
      { slug: 'sport', ru: 'Спорт и фитнес', uz: 'Sport va fitnes', hasCondition: true, fields: [sel('stype', 'Тип', 'Turi', SPORT_TYPE), brand()] },
      { slug: 'bikes', ru: 'Велосипеды', uz: 'Velosipedlar', hasCondition: true, fields: [sel('btype', 'Тип', 'Turi', BIKE_TYPE), brand(), num('wheel', 'Размер колеса', 'G‘ildirak', '"')] },
      { slug: 'music', ru: 'Музыкальные инструменты', uz: 'Musiqa asboblari', hasCondition: true, fields: [sel('mtype', 'Тип', 'Turi', MUSIC_TYPE), brand()] },
      { slug: 'books', ru: 'Книги и журналы', uz: 'Kitob va jurnallar', hasCondition: true, fields: [sel('btype', 'Тип', 'Turi', BOOK_TYPE), sel('lang', 'Язык', 'Til', LANG_OPT)] },
      { slug: 'collection', ru: 'Коллекционирование', uz: 'Kolleksiya', hasCondition: true, fields: [sel('ctype', 'Тип', 'Turi', COLLECTION_TYPE)] },
    ],
  },
  {
    slug: 'animals', ru: 'Животные', uz: 'Hayvonlar', icon: '🐾',
    sub: [
      { slug: 'dogs', ru: 'Собаки', uz: 'Itlar', fields: [txt('breed', 'Порода', 'Zoti'), sel('age', 'Возраст', 'Yosh', PET_AGE), sel('gender', 'Пол', 'Jinsi', GENDER), sel('pedigree', 'Документы', 'Hujjatlar', PEDIGREE)] },
      { slug: 'cats', ru: 'Кошки', uz: 'Mushuklar', fields: [txt('breed', 'Порода', 'Zoti'), sel('age', 'Возраст', 'Yosh', PET_AGE), sel('gender', 'Пол', 'Jinsi', GENDER), sel('pedigree', 'Документы', 'Hujjatlar', PEDIGREE)] },
      { slug: 'birds', ru: 'Птицы', uz: 'Qushlar', fields: [txt('species', 'Вид', 'Turi')] },
      { slug: 'fish', ru: 'Аквариумистика', uz: 'Akvarium', fields: [txt('species', 'Вид', 'Turi')] },
      { slug: 'pet_goods', ru: 'Товары для животных', uz: 'Hayvon mollari', hasCondition: true, fields: [sel('gtype', 'Тип', 'Turi', PET_GOODS_TYPE)] },
    ],
  },
  {
    slug: 'business', ru: 'Бизнес и оборудование', uz: 'Biznes va jihozlar', icon: '🏭',
    sub: [
      { slug: 'equipment', ru: 'Оборудование', uz: 'Jihozlar', hasCondition: true, fields: [sel('etype', 'Тип', 'Turi', EQUIP_TYPE), brand()] },
      { slug: 'ready_business', ru: 'Готовый бизнес', uz: 'Tayyor biznes', fields: [sel('btype', 'Сфера', 'Soha', BUSINESS_TYPE), num('payback', 'Окупаемость', 'Qoplanish', 'мес')] },
      { slug: 'materials', ru: 'Сырьё и материалы', uz: 'Xom ashyo', fields: [txt('mtype', 'Тип', 'Turi')] },
    ],
  },
  {
    slug: 'services', ru: 'Услуги', uz: 'Xizmatlar', icon: '🛠️',
    sub: [
      { slug: 'services_all', ru: 'Услуги', uz: 'Xizmatlar', priceRu: 'Цена от, сум', priceUz: 'Narx, so‘m', fields: [sel('stype', 'Вид услуги', 'Xizmat turi', SERVICE_TYPE)] },
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

export const COLUMN_KEYS = ['brand', 'model', 'memory'];
