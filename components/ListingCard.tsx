'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';

export default function ListingCard({ item }: { item: Listing }) {
  const { lang } = useLang();
  return (
    <Link className="card" href={`/listing/${item.id}`}>
      <div
        className="thumb"
        style={{ background: gradientFor((item.brand ?? '') + item.id) }}
      >
        {item.is_promoted ? (
          <span className="badge vip">VIP</span>
        ) : (
          <span className="badge">{condText(lang, item.condition)}</span>
        )}
        📱
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
