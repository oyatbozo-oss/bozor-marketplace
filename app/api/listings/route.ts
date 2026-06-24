import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const MAX_PHOTOS = 10;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'bad_form' }, { status: 400 });
  }

  const str = (k: string) => (form.get(k) ?? '').toString().trim();
  const title = str('title');
  const price = Number(str('price').replace(/[^\d]/g, ''));
  if (!title || !price || price <= 0) {
    return NextResponse.json({ error: 'bad_input' }, { status: 400 });
  }

  const admin = getAdminClient();

  const { data: listing, error } = await admin
    .from('listings')
    .insert({
      seller_id: user.pid,
      title,
      description: str('description') || null,
      price,
      condition: str('condition') === 'new' ? 'new' : 'used',
      brand: str('brand') || null,
      model: str('model') || null,
      memory: str('memory') || null,
      district: str('district') || null,
      city: str('city') || 'Tashkent',
      status: 'active',
    })
    .select('id')
    .single();

  if (error || !listing) {
    return NextResponse.json(
      { error: 'db_error', detail: error?.message },
      { status: 500 }
    );
  }

  // Загружаем фото в Storage и записываем ссылки
  const files = form
    .getAll('photos')
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_PHOTOS);

  let sort = 0;
  for (const file of files) {
    const ext =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'jpg';
    const path = `${listing.id}/${sort}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await admin.storage
      .from('listing-images')
      .upload(path, buf, { contentType: file.type, upsert: true });
    if (!upErr) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${path}`;
      await admin.from('listing_images').insert({
        listing_id: listing.id,
        url,
        sort,
      });
      sort++;
    }
  }

  return NextResponse.json({ ok: true, id: listing.id });
}
