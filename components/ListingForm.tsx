'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from './Header';
import TabBar from './TabBar';
import { useAuth } from './AuthProvider';
import { useLang } from './LangProvider';
import { condText, tr } from '@/lib/i18n';
import type { Condition, Listing } from '@/lib/types';
import { allImages } from '@/lib/types';
import { compressImage } from '@/lib/imageCompress';
import { REGION_NAMES, districtsOf } from '@/lib/uzbekistan';
import {
  CATEGORIES,
  catBySlug,
  subBySlug,
  fieldLabel,
  optLabel,
  priceLabel,
  COLUMN_KEYS,
} from '@/lib/categories';

const MAX = 10;

function seedValues(ex?: Listing): Record<string, string> {
  if (!ex) return {};
  const sub = subBySlug(ex.category, ex.subcategory);
  const out: Record<string, string> = {};
  sub?.fields.forEach((f) => {
    const raw = COLUMN_KEYS.includes(f.key)
      ? (ex as unknown as Record<string, unknown>)[f.key]
      : ex.attributes?.[f.key];
    if (raw != null && raw !== '') out[f.key] = String(raw);
  });
  return out;
}

export default function ListingForm({ existing }: { existing?: Listing }) {
  const user = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!existing;

  const [catSlug, setCatSlug] = useState(existing?.category || 'electronics');
  const [subSlug, setSubSlug] = useState(existing?.subcategory || 'smartphones');
  const [values, setValues] = useState<Record<string, string>>(() => seedValues(existing));
  const [cond, setCond] = useState<Condition>((existing?.condition as Condition) || 'used');
  const [region, setRegion] = useState(existing?.city || 'Ташкент (город)');
  const [district, setDistrict] = useState(existing?.district || '');
  const [title, setTitle] = useState(existing?.title || '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [description, setDescription] = useState(existing?.description || '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(existing ? allImages(existing) : []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);
  const cat = catBySlug(catSlug);
  const sub = subBySlug(catSlug, subSlug);
  const totalPhotos = existingPhotos.length + photos.length;

  function changeCat(slug: string) {
    setCatSlug(slug);
    setSubSlug(catBySlug(slug)?.sub[0]?.slug ?? '');
    setValues({});
  }
  function changeSub(slug: string) {
    setSubSlug(slug);
    setValues({});
  }
  function setVal(key: string, val: string) {
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      sub?.fields.forEach((f) => {
        if (f.dependsOn === key) delete next[f.key];
      });
      return next;
    });
  }
  function addPhotos(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith('image/'));
    const next = [...photos, ...incoming].slice(0, MAX - existingPhotos.length);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }
  function removeNew(i: number) {
    const next = photos.filter((_, idx) => idx !== i);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }
  function removeExisting(url: string) {
    setExistingPhotos((p) => p.filter((u) => u !== url));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!title.trim() || !price.replace(/[^\d]/g, '')) {
      setErr(T('Заполни название и цену.', 'Nomi va narxni to‘ldiring.'));
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set('title', title.trim());
      fd.set('price', price);
      fd.set('description', description);
      fd.set('category', catSlug);
      fd.set('subcategory', subSlug);
      fd.set('condition', cond);
      fd.set('city', region);
      fd.set('district', district);
      sub?.fields.forEach((f) => fd.set(f.key, values[f.key] || ''));

      const compressed = await Promise.all(photos.map((p) => compressImage(p)));
      compressed.forEach((p) => fd.append('photos', p));

      let res: Response;
      if (isEdit) {
        fd.set('keepImages', JSON.stringify(existingPhotos));
        res = await fetch(`/api/listings/${existing!.id}`, { method: 'PATCH', body: fd });
      } else {
        res = await fetch('/api/listings', { method: 'POST', body: fd });
      }
      const data = await res.json();
      if (data?.ok) {
        router.push(`/listing/${isEdit ? existing!.id : data.id}`);
      } else if (res.status === 401) {
        setErr(T('Нужно войти через Telegram.', 'Telegram orqali kirish kerak.'));
        setBusy(false);
      } else {
        setErr(T('Не удалось сохранить. Попробуй ещё раз.', 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.'));
        setBusy(false);
      }
    } catch {
      setErr(T('Ошибка сети.', 'Tarmoq xatosi.'));
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="content">
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Войдите, чтобы продолжить', 'Davom etish uchun kiring')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T('Откройте Bozor внутри Telegram — вход произойдёт автоматически.', 'Bozor’ni Telegram ichida oching.')}
            </p>
            <Link href="/" className="btn ghost" style={{ display: 'inline-block', marginTop: 14, padding: '12px 22px' }}>
              {T('На главную', 'Bosh sahifa')}
            </Link>
          </div>
        </div>
        <TabBar />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="content">
        <div className="section-t">
          <span>{isEdit ? T('Редактировать объявление', 'E’lonni tahrirlash') : T('Новое объявление', 'Yangi e’lon')}</span>
        </div>

        <form onSubmit={submit}>
          <div className="field">
            <label>{T('Категория', 'Kategoriya')}</label>
            <select value={catSlug} onChange={(e) => changeCat(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {lang === 'uz' ? c.uz : c.ru}
                </option>
              ))}
            </select>
          </div>

          {cat && cat.sub.length > 0 && (
            <div className="field">
              <label>{T('Раздел', 'Bo‘lim')}</label>
              <select value={subSlug} onChange={(e) => changeSub(e.target.value)}>
                {cat.sub.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {lang === 'uz' ? s.uz : s.ru}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Фото */}
          <div className="field">
            <label>{T('Фото (до 10)', 'Surat (10 tagacha)')}</label>
            <div className="photo-row">
              {existingPhotos.map((url) => (
                <div className="photo-thumb" key={url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" />
                  <span className="x" onClick={() => removeExisting(url)}>×</span>
                </div>
              ))}
              {previews.map((src, i) => (
                <div className="photo-thumb" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                  <span className="x" onClick={() => removeNew(i)}>×</span>
                </div>
              ))}
              {totalPhotos < MAX && (
                <div className="photo-add" onClick={() => fileRef.current?.click()}>+</div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
          </div>

          <div className="field">
            <label>{T('Название', 'Nomi')}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={T('Коротко и ясно', 'Qisqa va aniq')} />
          </div>

          <div className="field">
            <label>{priceLabel(catSlug, subSlug, lang) ?? tr(lang, 'price')}</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder="0" />
          </div>

          {sub?.hasCondition && (
            <div className="field">
              <label>{tr(lang, 'cond')}</label>
              <div className="seg">
                {(['new', 'used'] as Condition[]).map((c) => (
                  <button type="button" key={c} className={cond === c ? 'on' : ''} onClick={() => setCond(c)}>
                    {condText(lang, c)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sub?.fields.map((field) => {
            let opts = field.options;
            let asText = false;
            if (field.dependsOn) {
              const parentVal = values[field.dependsOn] || '';
              opts = field.optionsBy?.[parentVal];
              if (!opts || opts.length === 0) asText = true;
            }
            const val = values[field.key] ?? '';
            return (
              <div className="field" key={field.key}>
                <label>
                  {fieldLabel(field, lang)}
                  {field.unit ? `, ${field.unit}` : ''}
                </label>
                {field.type === 'select' && !asText && opts ? (
                  <select value={val} onChange={(e) => setVal(field.key, e.target.value)}>
                    <option value="">{T('— выбрать —', '— tanlang —')}</option>
                    {opts.map((o) => (
                      <option key={o.v} value={o.v}>{optLabel(o, lang)}</option>
                    ))}
                  </select>
                ) : (
                  <input value={val} onChange={(e) => setVal(field.key, e.target.value)} inputMode={field.type === 'number' ? 'numeric' : 'text'} />
                )}
              </div>
            );
          })}

          <div className="field">
            <label>{T('Город / область', 'Shahar / viloyat')}</label>
            <select value={region} onChange={(e) => { setRegion(e.target.value); setDistrict(''); }}>
              {REGION_NAMES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{T('Район / город', 'Tuman / shahar')}</label>
            <select value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">{T('— выбрать —', '— tanlang —')}</option>
              {districtsOf(region).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{T('Описание', 'Tavsif')}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={T('Подробности, состояние, детали…', 'Tafsilotlar…')} />
          </div>

          {err && <div className="form-err">{err}</div>}

          <div style={{ padding: '4px 16px 20px' }}>
            <button type="submit" className="btn solid" style={{ width: '100%' }} disabled={busy}>
              {busy ? T('Сохраняем…', 'Saqlanmoqda…') : isEdit ? T('Сохранить', 'Saqlash') : T('Опубликовать', 'Joylash')}
            </button>
          </div>
        </form>
      </div>
      <TabBar />
    </>
  );
}
