import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { tourBySlugQuery, tourSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourDetail } from '@/types/tour';
import { Footer } from '@/components/layout/footer';
import { TourHero } from '@/components/tour/tour-hero';
import { TourOverview } from '@/components/tour/tour-overview';
import { TourIncludedExcluded } from '@/components/tour/tour-included-excluded';
import { TourPricing } from '@/components/tour/tour-pricing';
import { TourRelated } from '@/components/tour/tour-related';
import { TourStatStrip } from '@/components/tour/tour-stat-strip';
import { routing } from '@/i18n/routing';

interface TourPageParams {
  locale: Locale;
  slug: string;
}

export async function generateStaticParams() {
  const slugs = (await sanityFetch<string[]>(tourSlugsQuery, {}, { tags: ['tour'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TourPageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tour = await sanityFetch<TourDetail>(
    tourBySlugQuery,
    { slug },
    { tags: ['tour', slug] },
  );
  if (!tour) return { title: 'Amuun' };

  const title = resolveLocaleField(tour.seo?.metaTitle, locale) ?? resolveLocaleField(tour.title, locale) ?? 'Amuun';
  const description = resolveLocaleField(tour.seo?.metaDescription, locale) ?? resolveLocaleField(tour.summary, locale);
  const ogImageSrc = tour.seo?.ogImage ?? tour.heroImage;
  const ogImage = ogImageSrc ? urlFor(ogImageSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Amuun`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<TourPageParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tour = await sanityFetch<TourDetail>(
    tourBySlugQuery,
    { slug },
    { tags: ['tour', slug] },
  );
  if (!tour) notFound();

  const title = resolveLocaleField(tour.title, locale) ?? '';
  const summary = resolveLocaleField(tour.summary, locale) ?? '';
  const heroAlt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
  const heroUrl = urlFor(tour.heroImage).width(2000).quality(85).url();
  const eyebrowParts = [
    `${tour.duration} ${tour.seasons.join(' / ')}`,
    tour.difficulty,
  ];
  const eyebrow = eyebrowParts.filter(Boolean).join(' · ').toUpperCase();

  return (
    <main className="relative bg-[#0B0D10]">
      <TourHero
        heroImageUrl={heroUrl}
        heroImageAlt={heroAlt}
        title={title}
        summary={summary}
        eyebrow={eyebrow}
        statStrip={
          <TourStatStrip
            duration={tour.duration}
            difficulty={tour.difficulty}
            pricing={tour.pricing}
            locale={locale}
          />
        }
      />
      <TourOverview
        summary={summary}
        description={resolveLocaleField(tour.description, locale)}
        destinations={tour.destinations}
        locale={locale}
      />
      <TourPricing pricing={tour.pricing} tourSlug={tour.slug.current} locale={locale} />
      <TourIncludedExcluded included={tour.included} excluded={tour.excluded} locale={locale} />
      {tour.relatedTours && tour.relatedTours.length > 0 ? (
        <TourRelated tours={tour.relatedTours} locale={locale} />
      ) : null}
      <Footer />
    </main>
  );
}
