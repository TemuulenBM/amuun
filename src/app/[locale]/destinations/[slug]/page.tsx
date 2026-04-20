import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { destinationBySlugQuery, destinationSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { DestinationHero } from '@/components/destination/destination-hero';
import { DestinationStatStrip } from '@/components/destination/destination-stat-strip';
import { DestinationStory } from '@/components/destination/destination-story';
import { DestinationGallery } from '@/components/destination/destination-gallery';
import { DestinationLocationMap } from '@/components/destination/destination-location-map';
import { DestinationTours } from '@/components/destination/destination-tours';
import { DestinationsCtaBand } from '@/components/destination/destinations-cta-band';
import { routing } from '@/i18n/routing';
import type { Destination } from '@/types/sanity';
import type {
  LocaleString,
  LocaleText,
  ImageWithAlt as TourImageWithAlt,
  TourPricingData,
} from '@/types/tour';

interface DestinationDetail extends Destination {
  tours?: Array<{
    _id: string;
    title: LocaleString;
    slug: { current: string };
    summary: LocaleText;
    duration: number;
    difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
    heroImage: TourImageWithAlt;
    pricing: TourPricingData;
  }>;
}

export async function generateStaticParams() {
  const slugs =
    (await sanityFetch<string[]>(destinationSlugsQuery, {}, { tags: ['destination'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dest = await sanityFetch<DestinationDetail>(
    destinationBySlugQuery,
    { slug },
    { tags: ['destination', slug] },
  );
  if (!dest) return { title: 'Amuun' };
  const title =
    resolveLocaleField(dest.seo?.title, locale) ??
    resolveLocaleField(dest.title, locale) ??
    'Amuun';
  const description =
    resolveLocaleField(dest.seo?.description, locale) ??
    resolveLocaleField(dest.subtitle, locale) ??
    undefined;
  const ogSrc = dest.seo?.ogImage ?? dest.heroImage;
  const ogImage = ogSrc ? urlFor(ogSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Amuun`,
    description,
    alternates: {
      canonical: `/${locale}/destinations/${slug}`,
      languages: {
        en: `/en/destinations/${slug}`,
        ko: `/ko/destinations/${slug}`,
        mn: `/mn/destinations/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const dest = await sanityFetch<DestinationDetail>(
    destinationBySlugQuery,
    { slug },
    { tags: ['destination', slug] },
  );
  if (!dest) notFound();

  const title = resolveLocaleField(dest.title, locale) ?? '';
  const subtitle = resolveLocaleField(dest.subtitle, locale) ?? '';
  const heroAlt = resolveLocaleField(dest.heroImage.alt, locale) ?? title;
  const heroSrc = urlFor(dest.heroImage).width(2000).quality(85).url();
  const regionLabel = t(
    `regions.${dest.region as 'central' | 'gobi' | 'western' | 'northern' | 'terelj'}.label`,
  );

  const stats = [
    { label: t('detail.region'), value: regionLabel },
    { label: t('card.bestTime'), value: resolveLocaleField(dest.bestTime, locale) ?? '—' },
    { label: t('detail.highlights'), value: String(dest.highlights?.length ?? 0) },
    { label: t('detail.toursAvailable'), value: String(dest.tours?.length ?? 0) },
  ];

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: title,
    description: subtitle,
    image: heroSrc,
    containedInPlace: { '@type': 'Country', name: 'Mongolia' },
  };
  if (dest.coordinates) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: dest.coordinates.lat,
      longitude: dest.coordinates.lng,
    };
  }

  return (
    <main className="relative bg-[#0B0D10]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationHero
        heroImageUrl={heroSrc}
        heroImageAlt={heroAlt}
        title={title}
        subtitle={subtitle}
        regionLabel={regionLabel}
      />
      <DestinationStatStrip items={stats} />
      <DestinationStory
        story={dest.story}
        highlights={dest.highlights}
        storyHeading={t('detail.story')}
        highlightsHeading={t('detail.highlights')}
        locale={locale}
      />
      {dest.gallery && dest.gallery.length > 0 ? (
        <DestinationGallery images={dest.gallery} locale={locale} />
      ) : null}
      {dest.coordinates ? (
        <DestinationLocationMap
          lat={dest.coordinates.lat}
          lng={dest.coordinates.lng}
          label={title}
          heading={t('detail.location')}
          ariaListLabel={t('map.regionListLabel')}
          loadFailedMessage={t('map.loadFailed')}
        />
      ) : null}
      <DestinationTours
        tours={dest.tours ?? []}
        locale={locale}
        heading={t('detail.toursHeading', { destination: title })}
        emptyMessage={t('detail.noTours')}
      />
      <DestinationsCtaBand
        heading={t('cta.heading')}
        body={t('cta.body')}
        buttonLabel={t('cta.button')}
      />
      <Footer />
    </main>
  );
}
