'use client';

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';

export default function ProfilePage() {
  const user = useAuth();
  const { lang } = useLang();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <>
      <Header />
      <div className="content">
        {user ? (
          <>
            <div
              style={{
                background: 'linear-gradient(135deg,var(--green),#0f9168)',
                color: '#fff',
                padding: '22px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                className="ava"
                style={{
                  width: 60,
                  height: 60,
                  fontSize: 22,
                  background: user.photo
                    ? `center/cover url(${user.photo})`
                    : 'rgba(255,255,255,.2)',
                }}
              >
                {!user.photo && (user.name?.[0] ?? '?')}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{user.name}</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>
                  {user.username ? `@${user.username} · ` : ''}
                  {lang === 'uz' ? 'Tasdiqlangan' : 'Вход через Telegram'}
                </div>
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <button className="btn ghost" onClick={logout} style={{ width: '100%' }}>
                {lang === 'uz' ? 'Chiqish' : 'Выйти'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: '#33564a' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {lang === 'uz' ? 'Tizimga kirilmagan' : 'Вы не вошли'}
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
              {lang === 'uz'
                ? 'Kirish uchun Bozor’ni Telegram ichida oching.'
                : 'Чтобы войти, откройте Bozor внутри Telegram — вход произойдёт автоматически.'}
            </p>
          </div>
        )}
      </div>
      <TabBar active="profile" />
    </>
  );
}
