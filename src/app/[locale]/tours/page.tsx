import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { allToursQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { formatPrice } from '@/lib/format/price';
import { Footer } from '@/components/layout/footer';
import type { LocaleString, LocaleText, ImageWithAlt, TourPricingData } from '@/types/tour';

interface TourCardItem {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>;
  heroImage: ImageWithAlt;
  pricing: TourPricingData;
  featured?: boolean;
}

interface ToursPageParams {
  locale: Locale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ToursPageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'toursListing' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ToursListingPage({
  params,
}: {
  params: Promise<ToursPageParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('toursListing');
  const tourT = await getTranslations('tour');

  const tours = (await sanityFetch<TourCardItem[]>(allToursQuery, {}, { tags: ['tour'] })) ?? [];

  return (
    <main className="relative min-h-screen bg-[#0B0D10]">
      <section className="px-[7vw] pt-[28vh] pb-[10vh]">
        <div className="mx-auto max-w-6xl">
          <span className="eyebrow block">{t('eyebrow')}</span>
          <h1 className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]">
            {t('title')}
          </h1>
          <p className="body-luxury mt-8 max-w-xl">{t('subtitle')}</p>
        </div>
      </section>

      <section className="px-[7vw] pb-[18vh]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2">
            {tours.map((tour) => {
              const title = resolveLocaleField(tour.title, locale) ?? '';
              const summary = resolveLocaleField(tour.summary, locale) ?? '';
              const alt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
              const imgSrc = urlFor(tour.heroImage).width(1400).quality(85).url();
              const priceLabel = formatPrice(tour.pricing.standard, tour.pricing.currency, locale);
              const difficultyLabel = tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1);

              return (
                <LocaleLink
                  key={tour._id}
                  href={`/tours/${tour.slug.current}`}
                  className="group flex flex-col gap-5"
                >
                  <div className="image-card aspect-[4/5] overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={alt}
                      width={1400}
                      height={1750}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
                    {tour.duration} {t('durationSuffix')} · {difficultyLabel}
                  </span>
                  <h2 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{title}</h2>
                  <p className="line-clamp-3 max-w-lg text-[#A7ACB4]">{summary}</p>
                  <div className="flex items-baseline justify-between border-t border-[#F7F7F5]/10 pt-4">
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
                      {t('viewExpedition')} →
                    </span>
                    <span className="font-serif text-xl text-[#F7F7F5]">
                      {tourT('pricingFrom')} {priceLabel}
                    </span>
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
