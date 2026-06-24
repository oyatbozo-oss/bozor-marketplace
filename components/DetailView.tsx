'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { firstImage } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';

export default function DetailView({ item }: { item: Listing }) {
  const { lang } = useLang();
  const seller = item.seller;
  const img = firstImage(item);
  return (
    <>
      <div className="content">
        <div
          className="detail-hero"
          style={
            img
              ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: gradientFor((item.brand ?? '') + item.id) }
          }
        >
          <Link className="back" href="/">
            ←
          </Link>
          {!img && '📱'}
        </div>
        <div className="d-pad">
          <div className="d-price">
            {money(item.price)}{' '}
            <span style={{ fontSize: 15, color: 'var(--muted)' }}>{tr(lang, 'sold')}</span>
          </div>
          <div className="d-title">{item.title}</div>
          <div className="c-meta" style={{ fontSize: 12 }}>
            📍 {item.district ? `${item.district}, ` : ''}
            {tr(lang, 'loc')}
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

          <div className="safe">
            <span className="i">🛡</span>
            <span>{tr(lang, 'safe')}</span>
          </div>
          <div style={{ height: 8 }} />
        </div>
      </div>

      <div className="actionbar">
        <button className="btn ghost">💬 {tr(lang, 'write')}</button>
        <button className="btn solid">🛡 {tr(lang, 'buy')}</button>
      </div>
    </>
  );
}
