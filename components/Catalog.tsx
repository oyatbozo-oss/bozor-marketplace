'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Condition, Listing } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, tr } from '@/lib/i18n';
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

  useEffect(() => {
    if (autoFocus) searchRef.current?.focus();
  }, [autoFocus]);
  const [brand, setBrand] = useState<string | null>(null);
  const [cond, setCond] = useState<Condition | null>(null);
  const [pmin, setPmin] = useState('');
  const [pmax, setPmax] = useState('');

  const brands = useMemo(
    () => [...new Set(listings.map((x) => x.brand).filter(Boolean) as string[])],
    [listings]
  );

  const filtered = useMemo(() => {
    const min = toInt(pmin);
    const max = toInt(pmax);
    const q = query.trim().toLowerCase();
    return listings.filter((x) => {
      if (brand && x.brand !== brand) return false;
      if (cond && x.condition !== cond) return false;
      if (min != null && x.price < min) return false;
      if (max != null && x.price > max) return false;
      if (q && !(x.title || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, brand, cond, pmin, pmax, query]);

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

      {/* Быстрые чипы по брендам */}
      <div className="chips">
        <button
          className={`chip ${brand === null ? 'active' : ''}`}
          onClick={() => setBrand(null)}
        >
          {tr(lang, 'all')}
        </button>
        {brands.map((b) => (
          <button
            key={b}
            className={`chip ${brand === b ? 'active' : ''}`}
            onClick={() => setBrand(brand === b ? null : b)}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Фильтры */}
      <div className="filters">
        <div className="section-t" style={{ paddingLeft: 0 }}>
          <span>{tr(lang, 'filters')}</span>
          <a onClick={reset}>{tr(lang, 'reset')}</a>
        </div>
        <div className="f-row">
          <label>{tr(lang, 'price')}</label>
          <div className="range">
            <input
              value={pmin}
              onChange={(e) => setPmin(e.target.value)}
              placeholder={tr(lang, 'from')}
              inputMode="numeric"
            />
            <input
              value={pmax}
              onChange={(e) => setPmax(e.target.value)}
              placeholder={tr(lang, 'to')}
              inputMode="numeric"
            />
          </div>
        </div>
        <div className="f-row">
          <label>{tr(lang, 'cond')}</label>
          <div className="seg">
            {(['new', 'used'] as Condition[]).map((c) => (
              <button
                key={c}
                className={cond === c ? 'on' : ''}
                onClick={() => setCond(cond === c ? null : c)}
              >
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
