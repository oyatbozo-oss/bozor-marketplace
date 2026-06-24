import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/types';

export const runtime = 'nodejs';

const SELECT =
  '*, seller:profiles(name,rating,is_verified,username), images:listing_images(url,sort)';

// POST — переключить избранное по объявлению
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let listingId = '';
  try {
    const body = await req.json();
    listingId = typeof body?.listingId === 'string' ? body.listingId : '';
  } catch {
    /* пусто */
  }
  if (!listingId) return NextResponse.json({ error: 'no_listing' }, { status: 400 });

  const admin = getAdminClient();
  const { data: existing } = await admin
    .from('favorites')
    .select('id')
    .eq('profile_id', user.pid)
    .eq('listing_id', listingId)
    .maybeSingle();

  if (existing) {
    await admin.from('favorites').delete().eq('id', existing.id);
    return NextResponse.json({ ok: true, favorited: false });
  }
  const { error } = await admin
    .from('favorites')
    .insert({ profile_id: user.pid, listing_id: listingId });
  if (error) return NextResponse.json({ error: 'db_error' }, { status: 500 });
  return NextResponse.json({ ok: true, favorited: true });
}

// GET — список избранных объявлений текущего пользователя
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: favs } = await admin
    .from('favorites')
    .select('listing_id, created_at')
    .eq('profile_id', user.pid)
    .order('created_at', { ascending: false });

  const ids = (favs ?? []).map((f) => f.listing_id).filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ listings: [] });

  const { data } = await admin
    .from('listings')
    .select(SELECT)
    .in('id', ids)
    .eq('status', 'active');

  const listings = (data as unknown as Listing[]) ?? [];
  // сохраняем порядок добавления в избранное
  const order = new Map(ids.map((id, i) => [id, i]));
  listings.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  return NextResponse.json({ listings });
}
