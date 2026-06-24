// Зависимые справочники: Марка → Модели (авто), Бренд → Модели (смартфоны).
// Названия моделей — фактические. Если марки нет в каталоге, поле «Модель»
// в форме становится текстовым (можно вписать вручную).

export const CAR_MODELS: Record<string, string[]> = {
  Chevrolet: ['Spark', 'Cobalt', 'Nexia', 'Nexia 2', 'Gentra', 'Lacetti', 'Aveo', 'Epica', 'Malibu', 'Malibu 2', 'Captiva', 'Tracker', 'Tracker 2', 'Onix', 'Equinox', 'Trailblazer', 'Orlando', 'Tahoe', 'Damas', 'Labo'],
  Daewoo: ['Matiz', 'Tico', 'Nexia', 'Gentra', 'Lacetti', 'Nubira', 'Leganza', 'Espero', 'Damas', 'Labo'],
  Ravon: ['R2', 'R3', 'R4', 'Nexia R3', 'Gentra'],
  'Lada (ВАЗ)': ['Granta', 'Vesta', 'Niva', 'Niva Travel', 'Largus', 'Priora', 'Kalina', '2107', '2114'],
  Kia: ['Rio', 'Cerato', 'Optima', 'K5', 'Sportage', 'Sorento', 'Sonet', 'Seltos', 'Carnival', 'K900'],
  Hyundai: ['Accent', 'Solaris', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta', 'Palisade', 'Kona', 'i30'],
  Toyota: ['Corolla', 'Camry', 'Yaris', 'RAV4', 'Land Cruiser', 'Land Cruiser Prado', 'Highlander', 'Avalon', 'Fortuner', 'Hilux', 'Venza'],
  Nissan: ['Almera', 'Sentra', 'X-Trail', 'Qashqai', 'Juke', 'Murano', 'Patrol', 'Terrano'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'Sprinter', 'Vito'],
  BMW: ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M5'],
  Audi: ['A3', 'A4', 'A5', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8'],
  Volkswagen: ['Polo', 'Jetta', 'Passat', 'Golf', 'Tiguan', 'Touareg', 'Caravelle', 'Transporter'],
  Lexus: ['ES', 'IS', 'LS', 'NX', 'RX', 'LX', 'GX'],
  Mazda: ['3', '6', 'CX-5', 'CX-9', 'CX-30'],
  Mitsubishi: ['Lancer', 'Outlander', 'Pajero', 'ASX', 'Montero Sport'],
  Ford: ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Transit'],
  Renault: ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Megane'],
  Chery: ['Tiggo 4 Pro', 'Tiggo 7 Pro', 'Tiggo 8 Pro Max', 'Arrizo 6', 'Arrizo 8'],
  BYD: ['Chazor', 'Song Plus', 'Seal', 'Han', 'Tang', 'Yuan Plus'],
  Geely: ['Coolray', 'Atlas', 'Atlas Pro', 'Emgrand', 'Monjaro', 'Tugella'],
  Haval: ['Jolion', 'F7', 'F7x', 'H6', 'Dargo'],
  Changan: ['CS35 Plus', 'CS55 Plus', 'CS75 Plus', 'Eado', 'UNI-K', 'UNI-T'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
};

export const PHONE_BRANDS: string[] = [
  'Apple', 'Samsung', 'Xiaomi', 'Redmi', 'Honor', 'Huawei', 'Realme', 'Oppo', 'Vivo',
  'OnePlus', 'Google', 'Nokia', 'Tecno', 'Infinix', 'ZTE', 'Motorola', 'Другая',
];

export const PHONE_MODELS: Record<string, string[]> = {
  Apple: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini', 'iPhone 12', 'iPhone 11', 'iPhone SE', 'iPhone XR', 'iPhone XS'],
  Samsung: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy S22', 'Galaxy A55', 'Galaxy A35', 'Galaxy A25', 'Galaxy A15', 'Galaxy A05', 'Galaxy Note 20', 'Galaxy Z Fold5', 'Galaxy Z Flip5'],
  Xiaomi: ['14 Pro', '14', '13 Pro', '13', '12', 'Poco X6 Pro', 'Poco X6', 'Poco F5', 'Poco M6 Pro'],
  Redmi: ['Note 13 Pro+', 'Note 13 Pro', 'Note 13', 'Note 12 Pro', 'Note 12', 'Redmi 13C', 'Redmi 12', 'Redmi A3'],
  Honor: ['Magic6 Pro', 'Magic6', '90', 'X9b', 'X8', 'X7'],
  Huawei: ['P60 Pro', 'P50', 'Nova 12', 'Nova 11', 'Mate 50'],
  Realme: ['12 Pro+', '12 Pro', '12', '11', 'C67', 'C55', 'C53'],
  Oppo: ['Reno 11 Pro', 'Reno 11', 'Reno 10', 'A98', 'A78', 'A58'],
  Vivo: ['V30 Pro', 'V30', 'V29', 'Y36', 'Y27', 'Y17'],
  OnePlus: ['12', '11', 'Nord 3', 'Nord CE 3'],
  Google: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7', 'Pixel 7a'],
};
