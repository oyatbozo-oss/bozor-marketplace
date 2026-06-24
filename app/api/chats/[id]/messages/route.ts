import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

async function loadChat(admin: ReturnType<typeof getAdminClient>, id: string) {
  const { data } = await admin
    .from('chats')
    .select('id, listing_id, buyer_id, seller_id')
    .eq('id', id)
    .single();
  return data;
}

// GET — сообщения диалога + мета; помечаем входящие прочитанными
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();

  const chat = await loadChat(admin, id);
  if (!chat) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (chat.buyer_id !== user.pid && chat.seller_id !== user.pid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { data: messages } = await admin
    .from('messages')
    .select('id, sender_id, body, created_at')
    .eq('chat_id', id)
    .order('created_at', { ascending: true });

  // отметить входящие как прочитанные
  await admin
    .from('messages')
    .update({ is_read: true })
    .eq('chat_id', id)
    .neq('sender_id', user.pid)
    .eq('is_read', false);

  const otherId = chat.buyer_id === user.pid ? chat.seller_id : chat.buyer_id;
  const [{ data: other }, { data: listing }] = await Promise.all([
    admin.from('profiles').select('name').eq('id', otherId).single(),
    admin.from('listings').select('id, title').eq('id', chat.listing_id).single(),
  ]);

  return NextResponse.json({
    meta: {
      otherName: other?.name ?? '—',
      listingId: listing?.id ?? null,
      listingTitle: listing?.title ?? '',
    },
    messages: (messages ?? []).map((m) => ({
      id: m.id,
      body: m.body,
      mine: m.sender_id === user.pid,
      created_at: m.created_at,
    })),
  });
}

// POST — отправить сообщение
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();

  const chat = await loadChat(admin, id);
  if (!chat) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (chat.buyer_id !== user.pid && chat.seller_id !== user.pid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body = '';
  try {
    const j = await req.json();
    body = typeof j?.body === 'string' ? j.body.trim() : '';
  } catch {
    /* пусто */
  }
  if (!body) return NextResponse.json({ error: 'empty' }, { status: 400 });
  if (body.length > 2000) body = body.slice(0, 2000);

  const { data: msg, error } = await admin
    .from('messages')
    .insert({ chat_id: id, sender_id: user.pid, body })
    .select('id, created_at')
    .single();
  if (error || !msg) return NextResponse.json({ error: 'db_error' }, { status: 500 });

  return NextResponse.json({ ok: true, message: { id: msg.id, body, mine: true, created_at: msg.created_at } });
}
