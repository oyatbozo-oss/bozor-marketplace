'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';
import { condText, tr } from '@/lib/i18n';
import type { Condition } from '@/lib/types';
import { compressImage } from '@/lib/imageCompress';
import { REGION_NAMES, districtsOf } from '@/lib/uzbekistan';
import {
  CATEGORIES,
  catBySlug,
  subBySlug,
  fieldLabel,
  optLabel,
  priceLabel,
} from '@/lib/categories';

const MAX = 10;

export default function NewListingPage() {
  const user = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [catSlug, setCatSlug] = useState('electronics');
  const [subSlug, setSubSlug] = useState('smartphones');
  const [values, setValues] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cond, setCond] = useState<Condition>('used');
  const [region, setRegion] = useState('Ташкент (город)');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);
  const cat = catBySlug(catSlug);
  const sub = subBySlug(catSlug, subSlug);

  function changeCat(slug: string) {
    setCatSlug(slug);
    const first = catBySlug(slug)?.sub[0]?.slug ?? '';
    setSubSlug(first);
    setValues({});
  }
  function changeSub(slug: string) {
    setSubSlug(slug);
    setValues({});
  }
  function setVal(key: string, val: string) {
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      // при смене родителя очищаем зависимые поля (напр. модель при смене марки)
      sub?.fields.forEach((f) => {
        if (f.dependsOn === key) delete next[f.key];
      });
      return next;
    });
  }

  function addPhotos(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list).filter((f) => f.type.startsWith('image/'));
    const next = [...photos, ...incoming].slice(0, MAX);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }
  function removePhoto(i: number) {
    const next = photos.filter((_, idx) => idx !== i);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    const fd = new FormData(e.currentTarget);
    fd.set('category', catSlug);
    fd.set('subcategory', subSlug);
    fd.set('condition', cond);

    const title = (fd.get('title') ?? '').toString().trim();
    const price = (fd.get('price') ?? '').toString().replace(/[^\d]/g, '');
    if (!title || !price) {
      setErr(T('Заполни название и цену.', 'Nomi va narxni to‘ldiring.'));
      return;
    }

    setBusy(true);
    try {
      fd.delete('photos');
      const compressed = await Promise.all(photos.map((p) => compressImage(p)));
      compressed.forEach((p) => fd.append('photos', p));

      const res = await fetch('/api/listings', { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.ok) {
        router.push(`/listing/${data.id}`);
      } else if (res.status === 401) {
        setErr(T('Нужно войти через Telegram.', 'Telegram orqali kirish kerak.'));
        setBusy(false);
      } else {
        setErr(T('Не удалось опубликовать. Попробуй ещё раз.', 'Joylab bo‘lmadi. Qayta urinib ko‘ring.'));
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
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {T('Чтобы подать объявление — войдите', 'E’lon berish uchun kiring')}
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T(
                'Откройте Bozor внутри Telegram — вход произойдёт автоматически.',
                'Bozor’ni Telegram ichida oching — kirish avtomatik bo‘ladi.'
              )}
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
          <span>{T('Новое объявление', 'Yangi e’lon')}</span>
        </div>

        <form onSubmit={submit}>
          {/* Категория и подкатегория */}
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
              {previews.map((src, i) => (
                <div className="photo-thumb" key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                  <span className="x" onClick={() => removePhoto(i)}>
                    ×
                  </span>
                </div>
              ))}
              {photos.length < MAX && (
                <div className="photo-add" onClick={() => fileRef.current?.click()}>
                  +
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addPhotos(e.target.files)} />
          </div>

          <div className="field">
            <label>{T('Название', 'Nomi')}</label>
            <input name="title" placeholder={T('Коротко и ясно', 'Qisqa va aniq')} />
          </div>

          <div className="field">
            <label>{priceLabel(catSlug, subSlug, lang) ?? tr(lang, 'price')}</label>
            <input name="price" inputMode="numeric" placeholder="0" />
          </div>

          {/* Состояние — только где уместно */}
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

          {/* Характеристики выбранного раздела */}
          {sub?.fields.map((field) => {
            // зависимое поле: варианты берём по значению родителя
            let opts = field.options;
            let asText = false;
            if (field.dependsOn) {
              const parentVal = values[field.dependsOn] || '';
              opts = field.optionsBy?.[parentVal];
              if (!opts || opts.length === 0) asText = true; // нет каталога — даём ввести вручную
            }
            const val = values[field.key] ?? '';
            return (
              <div className="field" key={field.key}>
                <label>
                  {fieldLabel(field, lang)}
                  {field.unit ? `, ${field.unit}` : ''}
                </label>
                {field.type === 'select' && !asText && opts ? (
                  <select name={field.key} value={val} onChange={(e) => setVal(field.key, e.target.value)}>
                    <option value="">{T('— выбрать —', '— tanlang —')}</option>
                    {opts.map((o) => (
                      <option key={o.v} value={o.v}>
                        {optLabel(o, lang)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.key}
                    value={val}
                    onChange={(e) => setVal(field.key, e.target.value)}
                    inputMode={field.type === 'number' ? 'numeric' : 'text'}
                  />
                )}
              </div>
            );
          })}

          {/* Местоположение */}
          <div className="field">
            <label>{T('Город / область', 'Shahar / viloyat')}</label>
            <select name="city" value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGION_NAMES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{T('Район / город', 'Tuman / shahar')}</label>
            <select name="district" defaultValue="">
              <option value="">{T('— выбрать —', '— tanlang —')}</option>
              {districtsOf(region).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>{T('Описание', 'Tavsif')}</label>
            <textarea name="description" placeholder={T('Подробности, состояние, детали…', 'Tafsilotlar, holati…')} />
          </div>

          {err && <div className="form-err">{err}</div>}

          <div style={{ padding: '4px 16px 20px' }}>
            <button type="submit" className="btn solid" style={{ width: '100%' }} disabled={busy}>
              {busy ? T('Публикуем…', 'Joylanmoqda…') : T('Опубликовать', 'Joylash')}
            </button>
          </div>
        </form>
      </div>
      <TabBar />
    </>
  );
}
