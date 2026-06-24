import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LangProvider } from '@/components/LangProvider';

export const metadata: Metadata = {
  title: 'Bozor — маркетплейс объявлений',
  description: 'Смартфоны в Ташкенте. Bozor — современный маркетплейс Узбекистана.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a7c5a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <LangProvider>
          <div className="shell">{children}</div>
        </LangProvider>
      </body>
    </html>
  );
}
