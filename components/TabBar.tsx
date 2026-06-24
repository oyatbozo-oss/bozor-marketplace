'use client';

import Link from 'next/link';
import { useLang } from './LangProvider';
import { tr } from '@/lib/i18n';

type Tab = 'home' | 'search' | 'chat' | 'profile';

export default function TabBar({ active = 'home' }: { active?: Tab }) {
  const { lang } = useLang();
  return (
    <div className="tabbar">
      <Link href="/" className={`tab ${active === 'home' ? 'active' : ''}`}>
        <span className="ic">🏠</span>
        <span>{tr(lang, 't_home')}</span>
      </Link>
      <Link href="/search" className={`tab ${active === 'search' ? 'active' : ''}`}>
        <span className="ic">🔍</span>
        <span>{tr(lang, 't_search')}</span>
      </Link>
      <Link href="/new" className="tab post">
        <span className="ic">＋</span>
        <span>{tr(lang, 't_post')}</span>
      </Link>
      <Link href="/chat" className={`tab ${active === 'chat' ? 'active' : ''}`}>
        <span className="ic">💬</span>
        <span>{tr(lang, 't_chat')}</span>
      </Link>
      <Link href="/profile" className={`tab ${active === 'profile' ? 'active' : ''}`}>
        <span className="ic">👤</span>
        <span>{tr(lang, 't_prof')}</span>
      </Link>
    </div>
  );
}
