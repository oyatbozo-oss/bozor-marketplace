import { supabase } from '@/lib/supabase';
import type { Listing } from '@/lib/types';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Catalog from '@/components/Catalog';

// Тянем свежие данные при каждом запросе (каталог живой).
export const dynamic = 'force-dynamic';

async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(name,rating,is_verified)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Ошибка загрузки объявлений:', error.message);
    return [];
  }
  return (data as unknown as Listing[]) ?? [];
}

export default async function HomePage() {
  const listings = await getListings();
  return (
    <>
      <Header />
      <div className="content">
        <Catalog listings={listings} />
      </div>
      <TabBar />
    </>
  );
}
