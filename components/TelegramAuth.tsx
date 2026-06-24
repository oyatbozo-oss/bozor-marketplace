'use client';

import { useEffect } from 'react';

interface TelegramWebApp {
  initData: string;
  ready: () => void;
  expand?: () => void;
}

/**
 * Авто-вход внутри Telegram Mini App.
 * Если открыто в Telegram и пользователь ещё не залогинен — отправляем
 * подписанные initData на сервер, ставим сессию и перезагружаем страницу.
 * Параметр loggedIn (с сервера) защищает от бесконечной перезагрузки.
 */
export default function TelegramAuth({ loggedIn }: { loggedIn: boolean }) {
  useEffect(() => {
    if (loggedIn) return;
    const tg = (
      window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
    ).Telegram?.WebApp;
    if (!tg) return; // открыто не в Telegram — пропускаем
    tg.ready();
    tg.expand?.();
    const initData = tg.initData;
    if (!initData) return;

    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res?.ok) window.location.reload();
      })
      .catch(() => {
        /* тихо игнорируем — каталог работает и без входа */
      });
  }, [loggedIn]);

  return null;
}
