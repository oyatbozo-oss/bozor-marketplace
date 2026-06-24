'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { firstImage } from '@/lib/types';
import { useLang } from './LangProvider';
import { useAuth } from './AuthProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';

export default function ListingCard({
  item,
  favorited = false,
}: {
  item: Listing;
  favorited?: boolean;
}) {
  const { lang } = useLang();
  const user = useAuth();
  const router = useRouter();
  const img = firstImage(item);
  const [fav, setFav] = useState(favorited);
  const [busy, setBusy] = useState(false);

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/profile');
      return;
    }
    if (busy) return;
    setBusy(true);
    const next = !fav;
    setFav(next); // оптимистично
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: item.id }),
      });
      const d = await res.json();
      if (typeof d?.favorited === 'boolean') setFav(d.favorited);
      else setFav(!next); // откат
    } catch {
      setFav(!next);
    }
    setBusy(false);
  }

  return (
    <Link className="card" href={`/listing/${item.id}`}>
      <div
        className="thumb"
        style={
          img
            ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: gradientFor((item.brand ?? '') + item.id) }
        }
      >
        {item.is_promoted ? (
          <span className="badge vip">VIP</span>
        ) : (
          <span className="badge">{condText(lang, item.condition)}</span>
        )}
        <button
          className={`fav-btn ${fav ? 'on' : ''}`}
          onClick={toggleFav}
          aria-label="favorite"
        >
          {fav ? '♥' : '♡'}
        </button>
        {!img && '📱'}
      </div>
      <div className="c-body">
        <div className="price">
          {money(item.price)}{' '}
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{tr(lang, 'sold')}</span>
        </div>
        <div className="c-title">{item.title}</div>
        <div className="c-meta">
          📍 {item.district || tr(lang, 'loc')} · ⭐ {item.seller?.rating ?? '-'}
        </div>
      </div>
    </Link>
  );
}
