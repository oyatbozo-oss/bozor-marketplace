// Зависимые справочники: Марка/Бренд → Модели. Факт. названия.
// Если родителя нет в каталоге, поле «Модель» в форме становится текстовым.

// ── Транспорт ───────────────────────────────────────────────────
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

export const MOTO_MODELS: Record<string, string[]> = {
  Honda: ['CB 125', 'CB 150', 'CBR 250', 'CBR 600', 'CRF 250', 'Africa Twin', 'Gold Wing', 'Dio', 'Lead'],
  Yamaha: ['YBR 125', 'MT-07', 'MT-09', 'YZF-R3', 'YZF-R6', 'FZ', 'Jog', 'Aerox'],
  Suzuki: ['GSX-R600', 'GSX-R750', 'Hayabusa', 'Burgman', 'Address', 'DR 200'],
  Kawasaki: ['Ninja 250', 'Ninja 400', 'Ninja 650', 'Z650', 'Z900', 'Versys'],
  KTM: ['Duke 200', 'Duke 390', 'RC 390', 'Adventure 390'],
  'BMW Motorrad': ['G 310', 'F 750 GS', 'R 1250 GS', 'S 1000 RR'],
  'Harley-Davidson': ['Sportster', 'Iron 883', 'Street 750', 'Fat Boy'],
  Lifan: ['LF150', 'LF200', 'KP150', 'KPT 200'],
  Racer: ['Tiger', 'Nitro', 'Panther', 'Magnum'],
};

export const TRUCK_MODELS: Record<string, string[]> = {
  Isuzu: ['NQR', 'NPR', 'FVR', 'ELF', 'Forward'],
  Hino: ['300', '500', '700'],
  KAMAZ: ['5320', '6520', '43118', '65115'],
  MAN: ['TGX', 'TGS', 'TGM', 'TGL'],
  Volvo: ['FH', 'FM', 'FMX'],
  Scania: ['R-series', 'S-series', 'P-series', 'G-series'],
  'Mercedes-Benz': ['Actros', 'Atego', 'Axor'],
  DAF: ['XF', 'CF', 'LF'],
  Iveco: ['Daily', 'Stralis', 'Eurocargo'],
  JAC: ['N-series', 'X-series'],
  Foton: ['Aumark', 'Auman', 'Forland'],
  Howo: ['A7', 'T7H', 'Sinotruk'],
};

export const BUS_MODELS: Record<string, string[]> = {
  Isuzu: ['Citiport', 'Novociti', 'SAZ'],
  'Mercedes-Benz': ['Sprinter', 'Conecto', 'Tourismo'],
  MAN: ["Lion's City", "Lion's Coach"],
  Yutong: ['ZK6122', 'ZK6816', 'ZK6118'],
  'King Long': ['XMQ6900', 'XMQ6129'],
  Higer: ['KLQ6109', 'KLQ6928'],
};

// ── Электроника ─────────────────────────────────────────────────
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

export const LAPTOP_MODELS: Record<string, string[]> = {
  Apple: ['MacBook Air 13', 'MacBook Air 15', 'MacBook Pro 14', 'MacBook Pro 16'],
  HP: ['Pavilion', 'ProBook', 'EliteBook', 'Omen', 'Victus', 'Spectre', 'Envy'],
  Dell: ['Inspiron', 'Latitude', 'XPS', 'Vostro', 'G15', 'Alienware'],
  Lenovo: ['IdeaPad', 'ThinkPad', 'Legion', 'Yoga', 'LOQ'],
  Asus: ['VivoBook', 'ZenBook', 'ROG', 'TUF Gaming', 'ExpertBook'],
  Acer: ['Aspire', 'Nitro', 'Predator', 'Swift', 'TravelMate'],
  MSI: ['Modern', 'Katana', 'Stealth', 'Cyborg', 'Raider'],
  Huawei: ['MateBook D14', 'MateBook D15', 'MateBook X Pro'],
};

export const TABLET_MODELS: Record<string, string[]> = {
  Apple: ['iPad Pro 12.9', 'iPad Pro 11', 'iPad Air', 'iPad', 'iPad mini'],
  Samsung: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A9', 'Galaxy Tab A8'],
  Xiaomi: ['Pad 6', 'Pad 5', 'Redmi Pad'],
  Huawei: ['MatePad Pro', 'MatePad 11', 'MatePad SE'],
  Lenovo: ['Tab P12', 'Tab M10', 'Tab P11'],
};

export const WATCH_MODELS: Record<string, string[]> = {
  Apple: ['Watch Ultra 2', 'Watch Series 9', 'Watch Series 8', 'Watch SE'],
  Samsung: ['Galaxy Watch 6', 'Galaxy Watch 5', 'Galaxy Watch 4'],
  Xiaomi: ['Watch S3', 'Watch 2 Pro', 'Smart Band 8'],
  Huawei: ['Watch GT 4', 'Watch GT 3', 'Watch Fit'],
  Amazfit: ['GTR 4', 'GTS 4', 'Bip 5', 'T-Rex 2'],
  Garmin: ['Fenix 7', 'Forerunner', 'Venu 3'],
};

export const CONSOLE_MODELS: Record<string, string[]> = {
  Sony: ['PlayStation 5', 'PlayStation 5 Slim', 'PlayStation 4 Pro', 'PlayStation 4', 'PS Vita'],
  Microsoft: ['Xbox Series X', 'Xbox Series S', 'Xbox One X', 'Xbox One S'],
  Nintendo: ['Switch OLED', 'Switch', 'Switch Lite'],
};

// ── Бренд-справочники (без зависимой модели) ────────────────────
export const TV_BRANDS: string[] = ['Samsung', 'LG', 'Sony', 'Xiaomi', 'TCL', 'Hisense', 'Artel', 'Premier', 'Shivaki', 'Roison', 'Goldstar', 'Другая'];
export const APPLIANCE_BRANDS: string[] = ['Samsung', 'LG', 'Bosch', 'Artel', 'Beko', 'Indesit', 'Ariston', 'Midea', 'Haier', 'Shivaki', 'Premier', 'Candy', 'Другая'];
export const AUDIO_BRANDS: string[] = ['JBL', 'Sony', 'Marshall', 'Apple', 'Samsung', 'Xiaomi', 'Beats', 'Anker', 'Edifier', 'Sven', 'Другая'];
export const CAMERA_BRANDS: string[] = ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'GoPro', 'DJI', 'Другая'];
