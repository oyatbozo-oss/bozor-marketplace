import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import Catalog from '@/components/Catalog';
import { getActiveListings } from '@/lib/listings';
import { getSessionUser } from '@/lib/session';
import { getFavoriteIds } from '@/lib/favorites';

// Тянем свежие данные при каждом запросе (каталог живой).
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [listings, user] = await Promise.all([getActiveListings(), getSessionUser()]);
  const favIds = user ? await getFavoriteIds(user.pid) : [];
  return (
    <>
      <Header />
      <div className="content">
        <Catalog listings={listings} favIds={favIds} />
      </div>
      <TabBar />
    </>
  );
}
