import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { legalPageBySlugQuery } from '@/sanity/lib/queries';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { LegalHero } from '@/components/legal/legal-hero';
import { LegalContent } from '@/components/legal/legal-content';
import type { LegalPage } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'terms' },
    { tags: ['legalPage'] },
  );
  const title = page?.seo?.title
    ? (resolveLocaleField(page.seo.title, locale) ?? 'Terms · Amuun')
    : 'Terms · Amuun';
  const description = page?.seo?.description
    ? (resolveLocaleField(page.seo.description, locale) ?? '')
    : '';
  return { title, description };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<LegalPage>(
    legalPageBySlugQuery,
    { slug: 'terms' },
    { tags: ['legalPage'] },
  );

  if (!page) notFound();

  const title = resolveLocaleField(page.title, locale) ?? 'Terms of Service';
  const blocks = (resolveLocaleField(page.content, locale) ?? []) as PortableTextBlock[];

  return (
    <>
      <LegalHero title={title} updatedAt={page.updatedAt} locale={locale} />
      <LegalContent blocks={blocks} />
      <Footer />
    </>
  );
}
