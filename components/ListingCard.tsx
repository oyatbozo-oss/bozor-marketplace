'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { firstImage } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';

export default function ListingCard({ item }: { item: Listing }) {
  const { lang } = useLang();
  const img = firstImage(item);
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
