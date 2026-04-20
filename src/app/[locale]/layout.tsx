import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { GrainOverlay } from '@/components/sections/grain-overlay';
import { CornerRules } from '@/components/layout/corner-rules';
import { Header } from '@/components/layout/header';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Amuun · Private expeditions across Mongolia',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <GrainOverlay />
            <CornerRules />
            <Header />
            {children}
            <ToasterProvider />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
