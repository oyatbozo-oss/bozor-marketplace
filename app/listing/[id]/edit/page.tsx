import { notFound, redirect } from 'next/navigation';
import ListingForm from '@/components/ListingForm';
import { getListingById } from '@/lib/listings';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getListingById(id);
  if (!item) notFound();

  const user = await getSessionUser();
  // редактировать может только владелец
  if (!user || user.pid !== item.seller_id) redirect(`/listing/${id}`);

  return <ListingForm existing={item} />;
}
