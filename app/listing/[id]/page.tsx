import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/lib/types';
import DetailView from '@/components/DetailView';

export const dynamic = 'force-dynamic';

async function getListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(name,rating,is_verified)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Ошибка загрузки объявления:', error.message);
    return null;
  }
  return (data as unknown as Listing) ?? null;
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getListing(id);
  if (!item) notFound();
  return <DetailView item={item} />;
}
