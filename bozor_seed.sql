-- ============================================================
-- Bozor — тестовые данные (демо): категории, продавцы, объявления
-- Запускать ПОСЛЕ bozor_schema.sql
-- ============================================================

-- Категории: смартфоны и бренды
insert into public.categories (slug, name_ru, name_uz, icon, sort) values
  ('smartphones', 'Смартфоны', 'Smartfonlar', '📱', 1)
on conflict (slug) do nothing;

insert into public.categories (slug, name_ru, name_uz, parent_id, sort)
select v.slug, v.name_ru, v.name_uz, c.id, v.sort
from (values
  ('iphone','iPhone','iPhone',1),
  ('samsung','Samsung','Samsung',2),
  ('xiaomi','Xiaomi','Xiaomi',3),
  ('accessories','Аксессуары','Aksessuarlar',4)
) as v(slug,name_ru,name_uz,sort)
cross join (select id from public.categories where slug='smartphones') c
on conflict (slug) do nothing;

-- Продавцы (демо-профили)
insert into public.profiles (name, phone, rating, is_verified, lang) values
  ('Азиз',    '+998901112233', 4.9, true,  'ru'),
  ('Дилноза',  '+998902223344', 5.0, true,  'uz'),
  ('Шохрух',  '+998903334455', 4.7, true,  'uz'),
  ('Камрон',  '+998904445566', 4.8, true,  'ru'),
  ('Малика',  '+998905556677', 5.0, true,  'uz')
on conflict do nothing;

-- Объявления (демо, Ташкент)
with cat as (select id from public.categories where slug='smartphones' limit 1)
insert into public.listings
  (seller_id, category_id, title, description, price, condition, brand, model, memory, district, status, is_promoted)
select p.id, cat.id, d.title, d.descr, d.price, d.cond, d.brand, d.model, d.memory, d.district, 'active', d.promo
from cat,
(values
  ('Азиз',   'iPhone 13 128GB, идеальное состояние','Полный комплект, коробка, чек. Аккумулятор 89%. Без царапин.', 8500000,'used','iPhone','iPhone 13','128GB','Чиланзар', true),
  ('Дилноза','Samsung Galaxy S23 256GB, новый','Новый, запечатан. Гарантия 1 год. Phantom Black.', 11200000,'new','Samsung','Galaxy S23','256GB','Юнусабад', false),
  ('Шохрух', 'Xiaomi Redmi Note 12 Pro 128GB','Новый, AMOLED 120Hz, камера 50МП. Гарантия магазина.', 3900000,'new','Xiaomi','Redmi Note 12 Pro','128GB','Мирзо-Улугбек', false),
  ('Камрон', 'iPhone 14 Pro 256GB, как новый','Состояние 10/10. Deep Purple. Аккумулятор 95%.', 13800000,'used','iPhone','iPhone 14 Pro','256GB','Яшнабад', true),
  ('Дилноза','Samsung A54 5G 128GB','Пользовались 6 месяцев. Идеальное состояние, чехол в подарок.', 4200000,'used','Samsung','Galaxy A54','128GB','Сергели', false),
  ('Шохрух', 'Xiaomi 13T 256GB, гарантия','Новый, Leica камера. Возможна рассрочка через Uzum Nasiya.', 6700000,'new','Xiaomi','13T','256GB','Чиланзар', false),
  ('Азиз',   'iPhone 12 64GB, отличное состояние','Аккумулятор 84%. Белый цвет. Всё работает идеально.', 6100000,'used','iPhone','iPhone 12','64GB','Алмазар', false),
  ('Малика', 'Samsung Galaxy S24 Ultra 512GB','Топовый флагман, S-Pen, 200МП. Новый, гарантия.', 17500000,'new','Samsung','Galaxy S24 Ultra','512GB','Юнусабад', true)
) as d(seller,title,descr,price,cond,brand,model,memory,district,promo)
join public.profiles p on p.name = d.seller;

-- Демо-чат и сообщение
with l as (select id, seller_id from public.listings order by created_at limit 1),
     b as (select id from public.profiles where name='Камрон' limit 1)
insert into public.chats (listing_id, buyer_id, seller_id)
select l.id, b.id, l.seller_id from l, b;

insert into public.messages (chat_id, sender_id, body)
select c.id, c.buyer_id, 'Здравствуйте! Телефон ещё в продаже?'
from public.chats c limit 1;
