import { getAdminClient } from './supabaseAdmin';

// Список id избранных объявлений пользователя (для отметки «сердечек» в ленте).
export async function getFavoriteIds(pid: string): Promise<string[]> {
  const admin = getAdminClient();
  const { data } = await admin
    .from('favorites')
    .select('listing_id')
    .eq('profile_id', pid);
  return (data ?? []).map((r) => r.listing_id as string).filter(Boolean);
}
