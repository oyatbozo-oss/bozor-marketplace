import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { LangProvider } from '@/components/LangProvider';
import { AuthProvider } from '@/components/AuthProvider';
import TelegramAuth from '@/components/TelegramAuth';
import { getSessionUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Bozor — маркетплейс объявлений',
  description: 'Смартфоны в Ташкенте. Bozor — современный маркетплейс Узбекистана.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a7c5a',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  return (
    <html lang="ru">
      <head>
        {/* SDK Telegram Mini App — нужен для авто-входа внутри Telegram */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider user={user}>
          <LangProvider>
            <TelegramAuth loggedIn={!!user} />
            <div className="shell">{children}</div>
          </LangProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
