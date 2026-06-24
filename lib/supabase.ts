import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Не заданы NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Скопируй .env.local.example в .env.local и впиши anon-ключ из Supabase.'
  );
}

// Публичный anon-клиент: только чтение каталога (RLS «публичное чтение»).
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
