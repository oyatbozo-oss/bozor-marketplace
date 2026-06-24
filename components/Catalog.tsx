'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Condition, Listing } from '@/lib/types';
import { useLang } from './LangProvider';
import { condText, tr } from '@/lib/i18n';
import {
  CATEGORIES,
  catBySlug,
  subBySlug,
  fieldLabel,
  optLabel,
  priceLabel,
  COLUMN_KEYS,
  type AttrField,
} from '@/lib/categories';
import Dropdown from './Dropdown';
import ListingCard from './ListingCard';

function toInt(s: string): number | null {
  const n = parseInt((s || '').replace(/\D/g, ''), 10);
  return Number.isNaN(n) ? null : n;
}
function attrOf(x: Listing, key: string): string {
  if (COLUMN_KEYS.includes(key)) {
    return String((x as unknown as Record<string, unknown>)[key] ?? '');
  }
  return String(x.attributes?.[key] ?? '');
}
function T(lang: string, ru: string, uz: string) {
  return lang === 'uz' ? uz : ru;
}

export default function Catalog({
  listings,
  autoFocus = false,
  favIds = [],
}: {
  listings: Listing[];
  autoFocus?: boolean;
  favIds?: string[];
}) {
  const { lang } = useLang();
  const favSet = useMemo(() => new Set(favIds), [favIds]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [cond, setCond] = useState<Condition | null>(null);
  const [pmin, setPmin] = useState('');
  const [pmax, setPmax] = useState('');
  const [selF, setSelF] = useState<Record<string, string>>({});
  const [minF, setMinF] = useState<Record<string, string>>({});
  const [maxF, setMaxF] = useState<Record<string, string>>({});
  const [txtF, setTxtF] = useState<Record<string, string>>({});

  useEffect(() => {
    if (autoFocus) searchRef.current?.focus();
  }, [autoFocus]);

  const cat = catBySlug(activeCat);
  const sub = subBySlug(activeCat, activeSub);

  function resetAttrFilters() {
    setCond(null);
    setSelF({});
    setMinF({});
    setMaxF({});
    setTxtF({});
  }
  function changeCat(slug: string | null) {
    setActiveCat(slug);
    // сразу выбираем первый раздел, чтобы фильтры появились немедленно
    setActiveSub(slug ? (catBySlug(slug)?.sub[0]?.slug ?? null) : null);
    resetAttrFilters();
  }
  function changeSub(slug: string | null) {
    setActiveSub(slug);
    resetAttrFilters();
  }
  function reset() {
    setQuery('');
    setPmin('');
    setPmax('');
    resetAttrFilters();
  }

  const scope = useMemo(
    () =>
      listings.filter(
        (x) =>
          (!activeCat || x.category === activeCat) &&
          (!activeSub || x.subcategory === activeSub)
      ),
    [listings, activeCat, activeSub]
  );

  const filtered = useMemo(() => {
    const min = toInt(pmin);
    const max = toInt(pmax);
    const q = query.trim().toLowerCase();
    return scope.filter((x) => {
      if (q && !(x.title || '').toLowerCase().includes(q)) return false;
      if (min != null && x.price < min) return false;
      if (max != null && x.price > max) return false;
      if (cond && x.condition !== cond) return false;
      for (const [k, v] of Object.entries(selF)) {
        if (v && attrOf(x, k) !== v) return false;
      }
      for (const [k, v] of Object.entries(txtF)) {
        if (v && !attrOf(x, k).toLowerCase().includes(v.toLowerCase())) return false;
      }
      for (const k of new Set([...Object.keys(minF), ...Object.keys(maxF)])) {
        const num = toInt(attrOf(x, k));
        const mn = toInt(minF[k] || '');
        const mx = toInt(maxF[k] || '');
        if (mn != null && (num == null || num < mn)) return false;
        if (mx != null && (num == null || num > mx)) return false;
      }
      return true;
    });
  }, [scope, query, pmin, pmax, cond, selF, minF, maxF, txtF]);

  const catOptions = [
    { value: '', label: tr(lang, 'all') },
    ...CATEGORIES.map((c) => ({ value: c.slug, label: lang === 'uz' ? c.uz : c.ru, icon: c.icon })),
  ];
  const subOptions = cat
    ? [
        { value: '', label: T(lang, 'Все разделы', 'Barcha bo‘limlar') },
        ...cat.sub.map((s) => ({ value: s.slug, label: lang === 'uz' ? s.uz : s.ru })),
      ]
    : [];

  const priceLbl = priceLabel(activeCat, activeSub, lang) ?? tr(lang, 'price');

  // дропдаун-фильтр по списку опций
  const selectDropdown = (field: AttrField, options: { v: string; label: string }[]) => (
    <div className="f-row" key={field.key}>
      <label>{fieldLabel(field, lang)}</label>
      <Dropdown
        value={selF[field.key] || null}
        placeholder={T(lang, 'Все', 'Hammasi')}
        options={[
          { value: '', label: T(lang, 'Все', 'Hammasi') },
          ...options.map((o) => ({ value: o.v, label: o.label })),
        ]}
        onChange={(v) =>
          setSelF((s) => {
            const next = { ...s, [field.key]: v || '' };
            if (field.key === 'brand') next.model = ''; // сменили марку — сбросить модель
            return next;
          })
        }
      />
    </div>
  );

  const segFilter = (field: AttrField, options: { v: string; label: string }[]) => (
    <div className="f-row" key={field.key}>
      <label>{fieldLabel(field, lang)}</label>
      <div className="seg">
        {options.map((o) => (
          <button
            key={o.v}
            className={selF[field.key] === o.v ? 'on' : ''}
            onClick={() => setSelF((s) => ({ ...s, [field.key]: s[field.key] === o.v ? '' : o.v }))}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

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

      <Dropdown
        value={activeCat}
        options={catOptions}
        placeholder={T(lang, 'Выберите категорию', 'Kategoriyani tanlang')}
        onChange={changeCat}
      />
      {cat && (
        <Dropdown
          value={activeSub}
          options={subOptions}
          placeholder={T(lang, 'Выберите раздел', 'Bo‘limni tanlang')}
          onChange={changeSub}
        />
      )}

      <div className="filters">
        <div className="section-t" style={{ paddingLeft: 0 }}>
          <span>{tr(lang, 'filters')}</span>
          <a onClick={reset}>{tr(lang, 'reset')}</a>
        </div>

        {/* Цена */}
        <div className="f-row">
          <label>{priceLbl}</label>
          <div className="range">
            <input value={pmin} onChange={(e) => setPmin(e.target.value)} placeholder={tr(lang, 'from')} inputMode="numeric" />
            <input value={pmax} onChange={(e) => setPmax(e.target.value)} placeholder={tr(lang, 'to')} inputMode="numeric" />
          </div>
        </div>

        {/* Состояние — только где есть */}
        {sub?.hasCondition && (
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
        )}

        {/* Динамические фильтры раздела */}
        {sub?.fields.map((field) => {
          if (field.noFilter) return null;

          // Бренд/Марка — полный справочник дропдауном; без справочника — поле ввода (всегда видно)
          if (field.key === 'brand') {
            if (field.options && field.options.length) {
              return selectDropdown(field, field.options.map((o) => ({ v: o.v, label: optLabel(o, lang) })));
            }
            return (
              <div className="f-row" key={field.key}>
                <label>{fieldLabel(field, lang)}</label>
                <input
                  className="f-text"
                  value={txtF[field.key] || ''}
                  onChange={(e) => setTxtF((t) => ({ ...t, [field.key]: e.target.value }))}
                  placeholder={T(lang, 'Например: Nike', 'Masalan: Nike')}
                />
              </div>
            );
          }

          // Зависимое поле (модель) — появляется после выбора родителя
          if (field.dependsOn) {
            const pv = selF[field.dependsOn];
            const opts = pv ? field.optionsBy?.[pv] : undefined;
            if (!opts || !opts.length) return null;
            return selectDropdown(field, opts.map((o) => ({ v: o.v, label: optLabel(o, lang) })));
          }

          if (field.type === 'select' && field.options) {
            const opts = field.options.map((o) => ({ v: o.v, label: optLabel(o, lang) }));
            // длинные списки — дропдаун, короткие — кнопки
            return field.options.length > 6 ? selectDropdown(field, opts) : segFilter(field, opts);
          }

          if (field.type === 'number') {
            return (
              <div className="f-row" key={field.key}>
                <label>
                  {fieldLabel(field, lang)}
                  {field.unit ? `, ${field.unit}` : ''}
                </label>
                <div className="range">
                  <input value={minF[field.key] || ''} onChange={(e) => setMinF((m) => ({ ...m, [field.key]: e.target.value }))} placeholder={tr(lang, 'from')} inputMode="numeric" />
                  <input value={maxF[field.key] || ''} onChange={(e) => setMaxF((m) => ({ ...m, [field.key]: e.target.value }))} placeholder={tr(lang, 'to')} inputMode="numeric" />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="section-t">
        <span>
          {tr(lang, 'found')}: {filtered.length}
        </span>
      </div>

      <div className="grid">
        {filtered.length ? (
          filtered.map((it) => <ListingCard key={it.id} item={it} favorited={favSet.has(it.id)} />)
        ) : (
          <div className="loading">{tr(lang, 'nothing')}</div>
        )}
      </div>
    </>
  );
}
