'use client';

import Link from 'next/link';
import { useLang } from './LangProvider';
import { tr } from '@/lib/i18n';

export default function TabBar() {
  const { lang } = useLang();
  return (
    <div className="tabbar">
      <Link href="/" className="tab active">
        <span className="ic">🏠</span>
        <span>{tr(lang, 't_home')}</span>
      </Link>
      <div className="tab">
        <span className="ic">🔍</span>
        <span>{tr(lang, 't_search')}</span>
      </div>
      <div className="tab post">
        <span className="ic">＋</span>
        <span>{tr(lang, 't_post')}</span>
      </div>
      <div className="tab">
        <span className="ic">💬</span>
        <span>{tr(lang, 't_chat')}</span>
      </div>
      <div className="tab">
        <span className="ic">👤</span>
        <span>{tr(lang, 't_prof')}</span>
      </div>
    </div>
  );
}
