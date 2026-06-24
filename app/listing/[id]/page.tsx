import { notFound } from 'next/navigation';
import DetailView from '@/components/DetailView';
import { getListingById } from '@/lib/listings';

export const dynamic = 'force-dynamic';

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getListingById(id);
  if (!item) notFound();
  return <DetailView item={item} />;
}
