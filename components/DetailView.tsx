'use client';

import Link from 'next/link';
import type { Listing } from '@/lib/types';
import { allImages } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, money, tr } from '@/lib/i18n';
import { gradientFor } from '@/lib/gradient';
import Gallery from './Gallery';
import {
  subBySlug,
  fieldLabel,
  optLabel,
  catName,
  subName,
  COLUMN_KEYS,
} from '@/lib/categories';

export default function DetailView({ item }: { item: Listing }) {
  const { lang } = useLang();
  const seller = item.seller;

  // Характеристики собираем по схеме раздела (колонки + JSONB attributes)
  const sub = subBySlug(item.category, item.subcategory);
  const specs: { label: string; value: string }[] = [];
  if (sub) {
    if (sub.hasCondition && item.condition) {
      specs.push({ label: tr(lang, 'cond'), value: condText(lang, item.condition) });
    }
    for (const field of sub.fields) {
      const raw = COLUMN_KEYS.includes(field.key)
        ? (item[field.key as 'brand' | 'model' | 'memory'] ?? '')
        : (item.attributes?.[field.key] ?? '');
      if (!raw) continue;
      let value = String(raw);
      if (field.type === 'select') {
        const o = field.options?.find((opt) => opt.v === raw);
        if (o) value = optLabel(o, lang);
      }
      specs.push({
        label: fieldLabel(field, lang) + (field.unit ? `, ${field.unit}` : ''),
        value,
      });
    }
  }
  const crumb = [catName(item.category, lang), subName(item.category, item.subcategory, lang)]
    .filter(Boolean)
    .join(' › ');
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
          {crumb && (
            <div className="c-meta" style={{ fontSize: 11, marginBottom: 4 }}>
              {crumb}
            </div>
          )}
          <div className="c-meta" style={{ fontSize: 12 }}>
            📍 {item.district ? `${item.district}, ` : ''}
            {item.city || tr(lang, 'loc')}
          </div>

          {specs.length > 0 && (
            <div className="specs">
              {specs.map((s, i) => (
                <div className="spec" key={i}>
                  <b>{s.label}</b>
                  {s.value}
                </div>
              ))}
            </div>
          )}

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
