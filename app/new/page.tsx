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

const MAX = 10;

export default function NewListingPage() {
  const user = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cond, setCond] = useState<Condition>('used');
  const [region, setRegion] = useState('Ташкент (город)');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);

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
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    fd.set('condition', cond);

    const title = (fd.get('title') ?? '').toString().trim();
    const price = (fd.get('price') ?? '').toString().replace(/[^\d]/g, '');
    if (!title || !price) {
      setErr(T('Заполни название и цену.', 'Nomi va narxni to‘ldiring.'));
      return;
    }

    setBusy(true);
    try {
      // Сжимаем и конвертируем фото в WebP перед загрузкой
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
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => addPhotos(e.target.files)}
            />
          </div>

          <div className="field">
            <label>{T('Название', 'Nomi')}</label>
            <input name="title" placeholder={T('Напр.: iPhone 13 128GB', 'Masalan: iPhone 13 128GB')} />
          </div>

          <div className="field">
            <label>{tr(lang, 'price')}</label>
            <input name="price" inputMode="numeric" placeholder="0" />
          </div>

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

          <div className="field">
            <label>{tr(lang, 'brand')}</label>
            <input name="brand" list="brands" placeholder="iPhone, Samsung, Xiaomi…" />
            <datalist id="brands">
              <option value="iPhone" />
              <option value="Samsung" />
              <option value="Xiaomi" />
              <option value="Realme" />
              <option value="Honor" />
              <option value="Google" />
              <option value="OnePlus" />
            </datalist>
          </div>

          <div className="field">
            <label>{tr(lang, 'model')}</label>
            <input name="model" placeholder={T('Напр.: 13 Pro', 'Masalan: 13 Pro')} />
          </div>

          <div className="field">
            <label>{tr(lang, 'memory')}</label>
            <input name="memory" list="mem" placeholder="128 GB" />
            <datalist id="mem">
              <option value="64 GB" />
              <option value="128 GB" />
              <option value="256 GB" />
              <option value="512 GB" />
              <option value="1 TB" />
            </datalist>
          </div>

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
            <textarea name="description" placeholder={T('Состояние, комплект, причина продажи…', 'Holati, to‘plami, sotuv sababi…')} />
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
