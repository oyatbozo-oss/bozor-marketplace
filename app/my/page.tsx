'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';
import { money } from '@/lib/i18n';
import { firstImage } from '@/lib/types';
import type { Listing } from '@/lib/types';

export default function MyListingsPage() {
  const user = useAuth();
  const { lang } = useLang();
  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetch('/api/my/listings')
      .then((r) => r.json())
      .then((d) => setListings(d?.listings ?? []))
      .catch(() => setListings([]));
  }
  useEffect(() => {
    if (user) load();
  }, [user]);

  async function setStatus(id: string, status: 'active' | 'sold') {
    setBusyId(id);
    await fetch(`/api/listings/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setBusyId(null);
    load();
  }
  async function remove(id: string) {
    if (!confirm(T('Удалить объявление безвозвратно?', 'E’lon butunlay o‘chirilsinmi?'))) return;
    setBusyId(id);
    await fetch(`/api/listings/${id}`, { method: 'DELETE' }).catch(() => {});
    setBusyId(null);
    load();
  }

  const statusLabel = (s: string | null) =>
    s === 'sold' ? T('Продано', 'Sotildi')
      : s === 'moderation' ? T('На модерации', 'Tekshiruvda')
      : s === 'blocked' ? T('Заблокировано', 'Bloklangan')
      : T('Активно', 'Faol');

  return (
    <>
      <Header />
      <div className="content">
        <div className="section-t">
          <span>{T('Мои объявления', 'Mening e’lonlarim')}</span>
        </div>

        {!user ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Вы не вошли', 'Tizimga kirilmagan')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>{T('Откройте Bozor внутри Telegram.', 'Bozor’ni Telegram ichida oching.')}</p>
          </div>
        ) : listings === null ? (
          <div className="loading">{T('Загрузка…', 'Yuklanmoqda…')}</div>
        ) : listings.length === 0 ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('У вас нет объявлений', 'E’lonlaringiz yo‘q')}</div>
            <Link href="/new" className="btn solid" style={{ display: 'inline-block', marginTop: 12, padding: '12px 22px' }}>
              {T('Подать объявление', 'E’lon berish')}
            </Link>
          </div>
        ) : (
          <div className="my-list">
            {listings.map((it) => {
              const img = firstImage(it);
              return (
                <div className="my-row" key={it.id}>
                  <Link href={`/listing/${it.id}`} className="my-main">
                    <div className="chat-thumb" style={img ? { backgroundImage: `url(${img})` } : undefined}>
                      {!img && '📱'}
                    </div>
                    <div className="my-body">
                      <div className="price">{money(it.price)} <span style={{ fontSize: 11, color: 'var(--muted)' }}>{lang === 'uz' ? 'so‘m' : 'сум'}</span></div>
                      <div className="my-title">{it.title}</div>
                      <span className={`st-badge st-${it.status}`}>{statusLabel(it.status)}</span>
                    </div>
                  </Link>
                  <div className="my-actions">
                    <Link href={`/listing/${it.id}/edit`} className="my-act">{T('Изменить', 'Tahrirlash')}</Link>
                    {it.status === 'active' ? (
                      <button className="my-act" disabled={busyId === it.id} onClick={() => setStatus(it.id, 'sold')}>{T('Снять', 'Olib tashlash')}</button>
                    ) : (
                      <button className="my-act" disabled={busyId === it.id} onClick={() => setStatus(it.id, 'active')}>{T('Опубликовать', 'Joylash')}</button>
                    )}
                    <button className="my-act danger" disabled={busyId === it.id} onClick={() => remove(it.id)}>{T('Удалить', 'O‘chirish')}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <TabBar active="profile" />
    </>
  );
}
