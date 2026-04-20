import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { tourBySlugQuery, tourSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourDetail } from '@/types/tour';
import { Footer } from '@/components/layout/footer';
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

  return (
    <main className="relative bg-[#0B0D10]">
      <section className="min-h-screen px-[7vw] pt-[20vh] pb-[10vh]">
        <span className="eyebrow block">Tour detail skeleton</span>
        <h1 className="mt-6 font-serif text-5xl font-semibold text-[#F7F7F5]">
          {resolveLocaleField(tour.title, locale)}
        </h1>
        <p className="mt-6 max-w-xl text-[#A7ACB4]">
          {resolveLocaleField(tour.summary, locale)}
        </p>
        <pre className="mt-10 overflow-auto text-xs text-[#A7ACB4]/60">
          {JSON.stringify(
            {
              duration: tour.duration,
              difficulty: tour.difficulty,
              seasons: tour.seasons,
              pricing: tour.pricing,
              itineraryDays: tour.itinerary?.length ?? 0,
              galleryCount: tour.gallery?.length ?? 0,
              faqs: tour.faqs?.length ?? 0,
              related: tour.relatedTours?.length ?? 0,
            },
            null,
            2,
          )}
        </pre>
      </section>
      <Footer />
    </main>
  );
}
