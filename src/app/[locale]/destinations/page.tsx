import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { allDestinationsQuery } from '@/sanity/lib/queries';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { DestinationsHero } from '@/components/destination/destinations-hero';
import { DestinationsOverviewMap } from '@/components/destination/destinations-overview-map';
import {
  DestinationRegionSection,
  type RegionSectionData,
} from '@/components/destination/destination-region-section';
import { DestinationsCtaBand } from '@/components/destination/destinations-cta-band';
import type { MaplibrePin } from '@/components/shared/maplibre-map';
import type { Destination } from '@/types/sanity';
import type { ImageWithAlt as TourImageWithAlt, LocaleString as TourLocaleString } from '@/types/tour';

type DestinationForCard = {
  _id: string;
  title: TourLocaleString;
  slug: { current: string };
  subtitle?: TourLocaleString;
  region: string;
  bestTime?: TourLocaleString;
  highlights?: TourLocaleString[];
  heroImage: TourImageWithAlt;
};

const REGION_ORDER = ['central', 'gobi', 'western', 'northern', 'terelj'] as const;
type RegionSlug = (typeof REGION_ORDER)[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'destinations' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}/destinations`,
      languages: {
        en: '/en/destinations',
        ko: '/ko/destinations',
        mn: '/mn/destinations',
      },
    },
  };
}

export default async function DestinationsListingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('destinations');

  const destinations =
    (await sanityFetch<Destination[]>(allDestinationsQuery, {}, { tags: ['destination'] })) ?? [];

  const grouped: Record<RegionSlug, Destination[]> = {
    central: [],
    gobi: [],
    western: [],
    northern: [],
    terelj: [],
  };
  for (const dest of destinations) {
    if (dest.region in grouped) grouped[dest.region as RegionSlug].push(dest);
  }

  const pins: MaplibrePin[] = destinations
    .filter((d) => d.coordinates)
    .map((d) => ({
      id: d.region,
      lat: d.coordinates!.lat,
      lng: d.coordinates!.lng,
      label: t('map.pinLabel', {
        title: resolveLocaleField(d.title, locale) ?? '',
        region: t(`regions.${d.region as RegionSlug}.label`),
      }),
    }));

  const sections: RegionSectionData[] = REGION_ORDER.filter((r) => grouped[r].length > 0).map(
    (r) => ({
      regionSlug: r,
      regionLabel: t(`regions.${r}.label`),
      regionTagline: t(`regions.${r}.tagline`),
      destinations: grouped[r] as unknown as DestinationForCard[],
    }),
  );

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: destinations.map((d, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/${locale}/destinations/${d.slug.current}`,
      name: resolveLocaleField(d.title, locale) ?? '',
    })),
  };

  return (
    <main className="relative bg-[#0B0D10]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <DestinationsHero
        eyebrow={t('hero.eyebrow')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <DestinationsOverviewMap
        pins={pins}
        ariaListLabel={t('map.regionListLabel')}
        loadFailedMessage={t('map.loadFailed')}
      />
      {sections.map((s) => (
        <DestinationRegionSection
          key={s.regionSlug}
          {...s}
          locale={locale}
          bestTimeLabel={t('card.bestTime')}
          highlightsCountLabel={(count) => t('card.highlightsCount', { count })}
          ctaLabel={t('card.cta')}
        />
      ))}
      <DestinationsCtaBand
        heading={t('cta.heading')}
        body={t('cta.body')}
        buttonLabel={t('cta.button')}
      />
      <Footer />
    </main>
  );
}
