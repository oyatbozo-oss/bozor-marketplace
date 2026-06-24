import { supabase } from './supabase';
import type { Listing } from './types';

const SELECT =
  '*, seller:profiles(name,rating,is_verified,username), images:listing_images(url,sort)';

export async function getActiveListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(SELECT)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Ошибка загрузки объявлений:', error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select(SELECT)
    .eq('id', id)
    .single();
  if (error) {
    console.error('Ошибка загрузки объявления:', error.message);
    return null;
  }
  return (data as unknown as Listing) ?? null;
}
