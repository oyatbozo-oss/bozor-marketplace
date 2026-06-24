'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';

interface ChatRow {
  id: string;
  listingTitle: string;
  listingImage: string | null;
  otherName: string;
  lastBody: string;
  unread: number;
}

export default function ChatListPage() {
  const user = useAuth();
  const { lang } = useLang();
  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);
  const [chats, setChats] = useState<ChatRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    const load = () =>
      fetch('/api/chats')
        .then((r) => r.json())
        .then((d) => {
          if (alive && d?.chats) setChats(d.chats);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [user]);

  return (
    <>
      <Header />
      <div className="content">
        <div className="section-t">
          <span>{T('Сообщения', 'Xabarlar')}</span>
        </div>

        {!user ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Вы не вошли', 'Tizimga kirilmagan')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T('Откройте Bozor внутри Telegram, чтобы переписываться.', 'Yozishish uchun Bozor’ni Telegram ichida oching.')}
            </p>
          </div>
        ) : chats === null ? (
          <div className="loading">{T('Загрузка…', 'Yuklanmoqda…')}</div>
        ) : chats.length === 0 ? (
          <div className="notice">
            <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{T('Пока нет диалогов', 'Hozircha suhbatlar yo‘q')}</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {T('Напишите продавцу со страницы объявления — диалог появится здесь.', 'E’lon sahifasidan sotuvchiga yozing — suhbat shu yerda paydo bo‘ladi.')}
            </p>
          </div>
        ) : (
          <div className="chat-list">
            {chats.map((c) => (
              <Link key={c.id} href={`/chat/${c.id}`} className="chat-row">
                <div
                  className="chat-thumb"
                  style={c.listingImage ? { backgroundImage: `url(${c.listingImage})` } : undefined}
                >
                  {!c.listingImage && '📱'}
                </div>
                <div className="chat-row-body">
                  <div className="chat-row-top">
                    <span className="chat-name">{c.otherName}</span>
                    {c.unread > 0 && <span className="chat-badge">{c.unread}</span>}
                  </div>
                  <div className="chat-listing">{c.listingTitle}</div>
                  <div className="chat-last">{c.lastBody || T('Нет сообщений', 'Xabar yo‘q')}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <TabBar active="chat" />
    </>
  );
}
