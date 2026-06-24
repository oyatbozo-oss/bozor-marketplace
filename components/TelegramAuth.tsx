'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface TelegramWebApp {
  initData: string;
  ready: () => void;
  expand?: () => void;
}

/**
 * Авто-вход внутри Telegram Mini App.
 * Если открыто в Telegram и пользователь ещё не залогинен — отправляем
 * подписанные initData на сервер, ставим сессию и «мягко» обновляем серверные
 * данные через router.refresh() (без полной перезагрузки страницы).
 *
 * Защита от цикла: пробуем ровно один раз (tried) и не перезагружаем страницу —
 * поэтому даже если сессия не установится, приложение не «дёргается».
 */
export default function TelegramAuth({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const tried = useRef(false);

  useEffect(() => {
    if (loggedIn || tried.current) return;
    const tg = (
      window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
    ).Telegram?.WebApp;
    if (!tg) return; // открыто не в Telegram
    tg.ready();
    tg.expand?.();
    const initData = tg.initData;
    if (!initData) return;

    tried.current = true;
    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) router.refresh();
      })
      .catch(() => {
        /* тихо игнорируем — каталог работает и без входа */
      });
  }, [loggedIn, router]);

  return null;
}
