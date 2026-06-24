'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { allImages } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';
import Gallery from './Gallery';

export default function DetailView({ item }: { item: Listing }) {
  const { lang } = useLang();
  const seller = item.seller;
  return (
    <>
      <div className="content">
        <Gallery
          urls={allImages(item)}
          fallback={gradientFor((item.brand ?? '') + item.id)}
        />
        <div className="d-pad">
          <div className="d-price">
            {money(item.price)}{' '}
            <span style={{ fontSize: 15, color: 'var(--muted)' }}>{tr(lang, 'sold')}</span>
          </div>
          <div className="d-title">{item.title}</div>
          <div className="c-meta" style={{ fontSize: 12 }}>
            📍 {item.district ? `${item.district}, ` : ''}
            {item.city || tr(lang, 'loc')}
          </div>

          <div className="specs">
            <div className="spec">
              <b>{tr(lang, 'brand')}</b>
              {item.brand || '-'}
            </div>
            <div className="spec">
              <b>{tr(lang, 'model')}</b>
              {item.model || '-'}
            </div>
            <div className="spec">
              <b>{tr(lang, 'memory')}</b>
              {item.memory || '-'}
            </div>
            <div className="spec">
              <b>{tr(lang, 'cond')}</b>
              {condText(lang, item.condition)}
            </div>
          </div>

          <div className="seller">
            <div className="ava">{seller?.name ? seller.name[0] : '?'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{seller?.name ?? '—'}</div>
              <div className="verif">
                {seller?.is_verified ? '✔ ' + tr(lang, 'verified') + ' · ' : ''}⭐{' '}
                {seller?.rating ?? '-'}
              </div>
            </div>
          </div>

          {item.description ? <div className="desc">{item.description}</div> : null}
          <div style={{ height: 8 }} />
        </div>
      </div>

      <div className="actionbar">
        {seller?.username ? (
          <a
            className="btn solid"
            href={`https://t.me/${seller.username}`}
            target="_blank"
            rel="noreferrer"
          >
            💬 {tr(lang, 'write')}
          </a>
        ) : (
          <button className="btn solid" disabled style={{ opacity: 0.55 }}>
            💬 {tr(lang, 'soon')}
          </button>
        )}
      </div>
    </>
  );
}
