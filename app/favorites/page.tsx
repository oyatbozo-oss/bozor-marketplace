'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import ListingCard from '@/components/ListingCard';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';
import type { Listing } from '@/lib/types';

export default function FavoritesPage() {
  const user = useAuth();
  const { lang } = useLang();
  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);
  const [listings, setListings] = useState<Listing[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((d) => setListings(d?.listings ?? []))
      .catch(() => setListings([]));
  }, [user]);

  return (
    <>
      <Header />
      <div className="content">
        <div className="section-t">
          <span>{T('Избранное', 'Saralangan')}</span>
        </div>

        {!user ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>❤️</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Вы не вошли', 'Tizimga kirilmagan')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T('Откройте Bozor внутри Telegram, чтобы сохранять объявления.', 'E’lonlarni saqlash uchun Bozor’ni Telegram ichida oching.')}
            </p>
            <Link href="/" className="btn ghost" style={{ display: 'inline-block', marginTop: 14, padding: '12px 22px' }}>
              {T('На главную', 'Bosh sahifa')}
            </Link>
          </div>
        ) : listings === null ? (
          <div className="loading">{T('Загрузка…', 'Yuklanmoqda…')}</div>
        ) : listings.length === 0 ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>🤍</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Пока пусто', 'Hozircha bo‘sh')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T('Нажимайте ♥ на объявлениях — они появятся здесь.', 'E’lonlarda ♥ bosing — ular shu yerda paydo bo‘ladi.')}
            </p>
          </div>
        ) : (
          <div className="grid">
            {listings.map((it) => (
              <ListingCard key={it.id} item={it} favorited />
            ))}
          </div>
        )}
      </div>
      <TabBar />
    </>
  );
}
