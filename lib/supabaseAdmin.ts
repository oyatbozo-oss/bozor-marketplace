import { createClient } from '@supabase/supabase-js';

/**
 * Серверный клиент Supabase с service_role ключом.
 * ⚠️ ТОЛЬКО на сервере (route handlers / server actions). Никогда не импортировать
 * в клиентские компоненты — ключ обходит RLS и не должен попадать в браузер.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'Не задан SUPABASE_SERVICE_ROLE_KEY. Впиши service_role ключ в .env.local (и в Vercel).'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
