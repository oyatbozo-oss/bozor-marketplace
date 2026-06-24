import { NextRequest, NextResponse } from 'next/server';
import { validateInitData } from '@/lib/telegram';
import { getAdminClient } from '@/lib/supabaseAdmin';
import { signSession, SESSION_COOKIE } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.SESSION_SECRET;
  if (!botToken || !secret) {
    return NextResponse.json({ error: 'server_misconfig' }, { status: 500 });
  }

  let initData = '';
  try {
    const body = await req.json();
    initData = typeof body?.initData === 'string' ? body.initData : '';
  } catch {
    /* пустое тело */
  }
  if (!initData) {
    return NextResponse.json({ error: 'no_init_data' }, { status: 400 });
  }

  // Главная проверка: данные реально подписаны Telegram
  const tgUser = validateInitData(initData, botToken);
  if (!tgUser) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  const name =
    [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') ||
    tgUser.username ||
    'Пользователь';

  const admin = getAdminClient();

  // Находим или создаём профиль по telegram_id
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('telegram_id', tgUser.id)
    .maybeSingle();

  let pid: string;
  if (existing) {
    pid = existing.id;
    await admin
      .from('profiles')
      .update({
        name,
        username: tgUser.username ?? null,
        photo_url: tgUser.photo_url ?? null,
      })
      .eq('id', pid);
  } else {
    const { data: created, error } = await admin
      .from('profiles')
      .insert({
        telegram_id: tgUser.id,
        name,
        username: tgUser.username ?? null,
        photo_url: tgUser.photo_url ?? null,
      })
      .select('id')
      .single();
    if (error || !created) {
      return NextResponse.json({ error: 'db_error' }, { status: 500 });
    }
    pid = created.id;
  }

  const token = signSession(
    {
      pid,
      tid: tgUser.id,
      name,
      username: tgUser.username ?? null,
      photo: tgUser.photo_url ?? null,
    },
    secret
  );

  const res = NextResponse.json({ ok: true, user: { pid, name } });
  // SameSite=None + Secure — чтобы сессия работала во встроенном окне Telegram
  // (Mini App на Desktop/Web грузится в iframe, lax-cookie туда не отправляется).
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
