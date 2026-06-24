import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

// POST — начать (или найти) чат по объявлению
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
  const { data: listing } = await admin
    .from('listings')
    .select('id, seller_id')
    .eq('id', listingId)
    .single();
  if (!listing?.seller_id) return NextResponse.json({ error: 'no_listing' }, { status: 404 });

  const sellerId = listing.seller_id as string;
  if (sellerId === user.pid) {
    return NextResponse.json({ error: 'own_listing' }, { status: 400 });
  }

  // существующий чат покупатель+продавец+объявление
  const { data: existing } = await admin
    .from('chats')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', user.pid)
    .eq('seller_id', sellerId)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true, id: existing.id });

  const { data: created, error } = await admin
    .from('chats')
    .insert({ listing_id: listingId, buyer_id: user.pid, seller_id: sellerId })
    .select('id')
    .single();
  if (error || !created) return NextResponse.json({ error: 'db_error' }, { status: 500 });
  return NextResponse.json({ ok: true, id: created.id });
}

// GET — список диалогов текущего пользователя
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data: chats } = await admin
    .from('chats')
    .select('id, listing_id, buyer_id, seller_id, created_at')
    .or(`buyer_id.eq.${user.pid},seller_id.eq.${user.pid}`)
    .order('created_at', { ascending: false });

  if (!chats || chats.length === 0) return NextResponse.json({ chats: [] });

  const chatIds = chats.map((c) => c.id);
  const listingIds = [...new Set(chats.map((c) => c.listing_id).filter(Boolean))];
  const otherIds = [...new Set(chats.map((c) => (c.buyer_id === user.pid ? c.seller_id : c.buyer_id)))];

  const [{ data: msgs }, { data: listings }, { data: profiles }] = await Promise.all([
    admin.from('messages').select('chat_id, body, sender_id, is_read, created_at').in('chat_id', chatIds).order('created_at', { ascending: true }),
    admin.from('listings').select('id, title, listing_images(url,sort)').in('id', listingIds),
    admin.from('profiles').select('id, name').in('id', otherIds),
  ]);

  const listingMap = new Map((listings ?? []).map((l) => [l.id, l]));
  const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.name]));

  const result = chats.map((c) => {
    const otherId = c.buyer_id === user.pid ? c.seller_id : c.buyer_id;
    const chatMsgs = (msgs ?? []).filter((m) => m.chat_id === c.id);
    const last = chatMsgs[chatMsgs.length - 1];
    const unread = chatMsgs.filter((m) => m.sender_id === otherId && !m.is_read).length;
    const l = listingMap.get(c.listing_id);
    const imgs = (l?.listing_images ?? []) as { url: string; sort: number | null }[];
    const image = imgs.length ? [...imgs].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))[0].url : null;
    return {
      id: c.id,
      listingId: c.listing_id,
      listingTitle: l?.title ?? '',
      listingImage: image,
      otherName: nameMap.get(otherId) ?? '—',
      lastBody: last?.body ?? '',
      lastAt: last?.created_at ?? c.created_at,
      unread,
    };
  });

  // сначала диалоги с непрочитанными / свежими сообщениями
  result.sort((a, b) => (b.lastAt > a.lastAt ? 1 : -1));
  return NextResponse.json({ chats: result });
}
