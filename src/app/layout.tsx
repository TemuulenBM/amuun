import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Amuun', template: '%s · Amuun' },
  description: "Private expeditions across the world's last wild horizon.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get('x-locale') ?? 'en';
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
