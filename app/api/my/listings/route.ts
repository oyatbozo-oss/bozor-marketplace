import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getAdminClient } from '@/lib/supabaseAdmin';
import type { Listing } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const admin = getAdminClient();
  const { data } = await admin
    .from('listings')
    .select('*, images:listing_images(url,sort)')
    .eq('seller_id', user.pid)
    .order('created_at', { ascending: false });

  return NextResponse.json({ listings: (data as unknown as Listing[]) ?? [] });
}
