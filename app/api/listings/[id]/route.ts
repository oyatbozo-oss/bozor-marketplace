import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';
import { subBySlug, COLUMN_KEYS } from '@/lib/categories';

export const runtime = 'nodejs';
const MAX_PHOTOS = 10;
const BUCKET = 'listing-images';

function pathFromUrl(url: string): string | null {
  const i = url.indexOf(`/${BUCKET}/`);
  return i >= 0 ? url.slice(i + BUCKET.length + 2) : null;
}

async function ownedListing(admin: ReturnType<typeof getAdminClient>, id: string, pid: string) {
  const { data } = await admin.from('listings').select('id, seller_id').eq('id', id).single();
  if (!data) return { error: 'not_found' as const };
  if (data.seller_id !== pid) return { error: 'forbidden' as const };
  return { id: data.id };
}

// PATCH — редактирование своего объявления (поля + фото + статус)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();

  const own = await ownedListing(admin, id, user.pid);
  if ('error' in own) return NextResponse.json({ error: own.error }, { status: own.error === 'forbidden' ? 403 : 404 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'bad_form' }, { status: 400 });
  }
  const str = (k: string) => (form.get(k) ?? '').toString().trim();

  const title = str('title');
  const price = Number(str('price').replace(/[^\d]/g, ''));
  if (!title || !price || price <= 0) return NextResponse.json({ error: 'bad_input' }, { status: 400 });

  const category = str('category') || null;
  const subcategory = str('subcategory') || null;
  const sub = subBySlug(category, subcategory);

  const record: Record<string, unknown> = {
    title,
    description: str('description') || null,
    price,
    district: str('district') || null,
    city: str('city') || 'Tashkent',
    category,
    subcategory,
  };
  record.condition = sub?.hasCondition ? (str('condition') === 'new' ? 'new' : 'used') : null;
  // обнуляем колоночные поля, затем заполняем актуальными
  record.brand = null;
  record.model = null;
  record.memory = null;
  const attributes: Record<string, string> = {};
  if (sub) {
    for (const field of sub.fields) {
      const val = str(field.key);
      if (!val) continue;
      if (COLUMN_KEYS.includes(field.key)) record[field.key] = val;
      else attributes[field.key] = val;
    }
  }
  record.attributes = attributes;

  const { error: upErr } = await admin.from('listings').update(record).eq('id', id);
  if (upErr) return NextResponse.json({ error: 'db_error', detail: upErr.message }, { status: 500 });

  // Фото: оставляем те, что в keepImages; остальные удаляем; новые загружаем
  let keep: string[] = [];
  try {
    keep = JSON.parse(str('keepImages') || '[]');
  } catch {
    keep = [];
  }
  const { data: current } = await admin.from('listing_images').select('id, url').eq('listing_id', id);
  const removeRows = (current ?? []).filter((r) => !keep.includes(r.url));
  if (removeRows.length) {
    await admin.from('listing_images').delete().in('id', removeRows.map((r) => r.id));
    const paths = removeRows.map((r) => pathFromUrl(r.url)).filter(Boolean) as string[];
    if (paths.length) await admin.storage.from(BUCKET).remove(paths);
  }

  const keptCount = (current ?? []).length - removeRows.length;
  const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0).slice(0, MAX_PHOTOS - keptCount);
  let sort = keptCount;
  for (const file of files) {
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${id}/edit-${sort}-${title.length}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: e } = await admin.storage.from(BUCKET).upload(path, buf, { contentType: file.type, upsert: true });
    if (!e) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
      await admin.from('listing_images').insert({ listing_id: id, url, sort });
      sort++;
    }
  }

  return NextResponse.json({ ok: true, id });
}

// POST — смена статуса (active/sold)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();
  const own = await ownedListing(admin, id, user.pid);
  if ('error' in own) return NextResponse.json({ error: own.error }, { status: own.error === 'forbidden' ? 403 : 404 });

  let status = '';
  try {
    const j = await req.json();
    status = j?.status;
  } catch {
    /* пусто */
  }
  if (status !== 'active' && status !== 'sold') return NextResponse.json({ error: 'bad_status' }, { status: 400 });
  await admin.from('listings').update({ status }).eq('id', id);
  return NextResponse.json({ ok: true, status });
}

// DELETE — удалить своё объявление вместе с фото
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const admin = getAdminClient();
  const own = await ownedListing(admin, id, user.pid);
  if ('error' in own) return NextResponse.json({ error: own.error }, { status: own.error === 'forbidden' ? 403 : 404 });

  const { data: imgs } = await admin.storage.from(BUCKET).list(id);
  if (imgs && imgs.length) await admin.storage.from(BUCKET).remove(imgs.map((f) => `${id}/${f.name}`));
  await admin.from('listings').delete().eq('id', id);
  return NextResponse.json({ ok: true });
}
