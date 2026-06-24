'use client';

import { useLang } from './LangProvider';

export default function Header() {
  const { lang, toggle } = useLang();
  return (
    <div className="appbar">
      <div className="brand">
        <span className="dot">B</span> Bozor
      </div>
      <div className="spacer" />
      <button className="langtog" onClick={toggle}>
        {lang === 'ru' ? 'UZ' : 'RU'}
      </button>
      <div className="iconbtn">🔔</div>
    </div>
  );
}
