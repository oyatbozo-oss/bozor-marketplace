'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';

interface Msg {
  id: string;
  body: string;
  mine: boolean;
  created_at: string;
}
interface Meta {
  otherName: string;
  listingId: string | null;
  listingTitle: string;
}

function timeOf(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function ChatPage() {
  const user = useAuth();
  const { lang } = useLang();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);

  const [meta, setMeta] = useState<Meta | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  useEffect(() => {
    if (!user || !id) return;
    let alive = true;
    const load = () =>
      fetch(`/api/chats/${id}/messages`)
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          if (d?.meta) setMeta(d.meta);
          if (Array.isArray(d?.messages)) setMessages(d.messages);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [user, id]);

  // автопрокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messages.length !== lastCount.current) {
      lastCount.current = messages.length;
      bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
    }
  }, [messages]);

  async function send() {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setText('');
    try {
      const res = await fetch(`/api/chats/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      const d = await res.json();
      if (d?.ok && d.message) {
        setMessages((m) => [...m, d.message]);
      }
    } catch {
      /* игнор */
    }
    setSending(false);
  }

  if (!user) {
    return (
      <div className="shell-chat">
        <div className="chat-head">
          <Link href="/chat" className="chat-back">←</Link>
          <span>{T('Чат', 'Chat')}</span>
        </div>
        <div className="notice">{T('Войдите через Telegram.', 'Telegram orqali kiring.')}</div>
      </div>
    );
  }

  return (
    <div className="shell-chat">
      <div className="chat-head">
        <Link href="/chat" className="chat-back">←</Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="chat-head-name">{meta?.otherName ?? '…'}</div>
          {meta?.listingId ? (
            <Link href={`/listing/${meta.listingId}`} className="chat-head-listing">
              {meta.listingTitle}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="chat-body" ref={bodyRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">{T('Напишите первым 👋', 'Birinchi bo‘lib yozing 👋')}</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`bubble ${m.mine ? 'mine' : 'their'}`}>
              <span>{m.body}</span>
              <i>{timeOf(m.created_at)}</i>
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          placeholder={T('Сообщение…', 'Xabar…')}
        />
        <button onClick={send} disabled={sending || !text.trim()}>➤</button>
      </div>
    </div>
  );
}
