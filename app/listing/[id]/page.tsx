import { notFound } from 'next/navigation';
import DetailView from '@/components/DetailView';
import { getListingById } from '@/lib/listings';
import { getSessionUser } from '@/lib/session';
import { getFavoriteIds } from '@/lib/favorites';

export const dynamic = 'force-dynamic';

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getListingById(id);
  if (!item) notFound();

  const user = await getSessionUser();
  const favIds = user ? await getFavoriteIds(user.pid) : [];
  return <DetailView item={item} favorited={favIds.includes(item.id)} />;
}
