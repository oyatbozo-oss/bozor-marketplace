import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Catalog from '@/components/Catalog';
import { getActiveListings } from '@/lib/listings';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const listings = await getActiveListings();
  return (
    <>
      <Header />
      <div className="content">
        <Catalog listings={listings} autoFocus />
      </div>
      <TabBar active="search" />
    </>
  );
}
