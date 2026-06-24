'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/lib/types';

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx>({
  lang: 'ru',
  toggle: () => {},
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ru');

  // Восстанавливаем выбор языка из браузера после монтирования.
  useEffect(() => {
    const saved = localStorage.getItem('bozor-lang');
    if (saved === 'ru' || saved === 'uz') setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('bozor-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang((l) => (l === 'ru' ? 'uz' : 'ru'));

  return <Ctx.Provider value={{ lang, toggle, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
