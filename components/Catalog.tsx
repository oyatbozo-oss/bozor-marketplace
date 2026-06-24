'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Condition, Listing } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, tr } from '@/lib/i18n';
import { CATEGORIES } from '@/lib/categories';
import ListingCard from './ListingCard';

function toInt(s: string): number | null {
  const n = parseInt((s || '').replace(/\D/g, ''), 10);
  return Number.isNaN(n) ? null : n;
}

export default function Catalog({
  listings,
  autoFocus = false,
}: {
  listings: Listing[];
  autoFocus?: boolean;
}) {
  const { lang } = useLang();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [cond, setCond] = useState<Condition | null>(null);
  const [pmin, setPmin] = useState('');
  const [pmax, setPmax] = useState('');

  useEffect(() => {
    if (autoFocus) searchRef.current?.focus();
  }, [autoFocus]);

  // Объявления текущей категории (для подсказок по бренду)
  const inCat = useMemo(
    () => (activeCat ? listings.filter((x) => x.category === activeCat) : listings),
    [listings, activeCat]
  );

  const brands = useMemo(
    () => [...new Set(inCat.map((x) => x.brand).filter(Boolean) as string[])].slice(0, 12),
    [inCat]
  );

  const filtered = useMemo(() => {
    const min = toInt(pmin);
    const max = toInt(pmax);
    const q = query.trim().toLowerCase();
    return inCat.filter((x) => {
      if (brand && x.brand !== brand) return false;
      if (cond && x.condition !== cond) return false;
      if (min != null && x.price < min) return false;
      if (max != null && x.price > max) return false;
      if (q && !(x.title || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inCat, brand, cond, pmin, pmax, query]);

  const reset = () => {
    setBrand(null);
    setCond(null);
    setPmin('');
    setPmax('');
    setQuery('');
  };

  return (
    <>
      <div className="searchwrap">
        <div className="search">
          🔍
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr(lang, 'searchph')}
          />
        </div>
      </div>
      <div className="loc">📍 {tr(lang, 'loc')}</div>

      {/* Категории */}
      <div className="chips">
        <button
          className={`chip ${activeCat === null ? 'active' : ''}`}
          onClick={() => {
            setActiveCat(null);
            setBrand(null);
          }}
        >
          {tr(lang, 'all')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            className={`chip ${activeCat === c.slug ? 'active' : ''}`}
            onClick={() => {
              setActiveCat(activeCat === c.slug ? null : c.slug);
              setBrand(null);
            }}
          >
            {c.icon} {lang === 'uz' ? c.uz : c.ru}
          </button>
        ))}
      </div>

      {/* Фильтры */}
      <div className="filters">
        <div className="section-t" style={{ paddingLeft: 0 }}>
          <span>{tr(lang, 'filters')}</span>
          <a onClick={reset}>{tr(lang, 'reset')}</a>
        </div>

        {brands.length > 0 && (
          <div className="f-row">
            <label>{tr(lang, 'brand')}</label>
            <div className="seg">
              {brands.map((b) => (
                <button
                  key={b}
                  className={brand === b ? 'on' : ''}
                  onClick={() => setBrand(brand === b ? null : b)}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="f-row">
          <label>{tr(lang, 'price')}</label>
          <div className="range">
            <input value={pmin} onChange={(e) => setPmin(e.target.value)} placeholder={tr(lang, 'from')} inputMode="numeric" />
            <input value={pmax} onChange={(e) => setPmax(e.target.value)} placeholder={tr(lang, 'to')} inputMode="numeric" />
          </div>
        </div>

        <div className="f-row">
          <label>{tr(lang, 'cond')}</label>
          <div className="seg">
            {(['new', 'used'] as Condition[]).map((c) => (
              <button key={c} className={cond === c ? 'on' : ''} onClick={() => setCond(cond === c ? null : c)}>
                {condText(lang, c)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="section-t">
        <span>
          {tr(lang, 'found')}: {filtered.length}
        </span>
      </div>

      <div className="grid">
        {filtered.length ? (
          filtered.map((it) => <ListingCard key={it.id} item={it} />)
        ) : (
          <div className="loading">{tr(lang, 'nothing')}</div>
        )}
      </div>
    </>
  );
}
