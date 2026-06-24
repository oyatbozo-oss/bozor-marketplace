'use client';

import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import { useAuth } from '@/components/AuthProvider';
import { useLang } from '@/components/LangProvider';

export default function ChatPage() {
  const user = useAuth();
  const { lang } = useLang();
  const T = (ru: string, uz: string) => (lang === 'uz' ? uz : ru);

  return (
    <>
      <Header />
      <div className="content">
        <div className="notice">
          <div style={{ fontSize: 40, marginBottom: 10 }}>💬</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            {T('Чат скоро', 'Chat tez orada')}
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            {user
              ? T(
                  'Переписка с продавцами и покупателями появится в следующем обновлении.',
                  'Sotuvchilar va xaridorlar bilan yozishuv keyingi yangilanishda paydo bo‘ladi.'
                )
              : T(
                  'Войдите через Telegram, чтобы скоро общаться в чате.',
                  'Chatda yozishish uchun Telegram orqali kiring.'
                )}
          </p>
        </div>
      </div>
      <TabBar active="chat" />
    </>
  );
}
