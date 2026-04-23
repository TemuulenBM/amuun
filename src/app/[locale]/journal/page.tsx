import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { allBlogPostsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { JournalHero } from '@/components/journal/journal-hero';
import { JournalFeaturedCard } from '@/components/journal/journal-featured-card';
import { JournalCard } from '@/components/journal/journal-card';
import type { LocaleString, LocaleText, ImageWithAlt } from '@/types/sanity';

interface BlogPostCardItem {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  excerpt?: LocaleText;
  category: string;
  heroImage: ImageWithAlt;
  publishedAt: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'journalListing' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function JournalListingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('journalListing');

  const posts =
    (await sanityFetch<BlogPostCardItem[]>(allBlogPostsQuery, {}, { tags: ['blogPost'] })) ?? [];

  const [featured, ...rest] = posts;

  return (
    <main className="relative min-h-screen bg-[#0B0D10]">
      <JournalHero eyebrow={t('eyebrow')} heading={t('title')} intro={t('subtitle')} />

      {featured ? (
        <section className="px-[7vw] pb-[8vh] pt-[6vh]">
          <div className="mx-auto max-w-6xl">
            <JournalFeaturedCard
              slug={featured.slug.current}
              imageUrl={urlFor(featured.heroImage).width(2000).quality(85).url()}
              imageAlt={resolveLocaleField(featured.heroImage.alt, locale) ?? ''}
              category={featured.category}
              publishedAt={featured.publishedAt}
              title={resolveLocaleField(featured.title, locale) ?? ''}
              excerpt={resolveLocaleField(featured.excerpt, locale) ?? ''}
              readArticleLabel={t('readArticle')}
            />
          </div>
        </section>
      ) : null}

      {rest.length > 0 ? (
        <section className="px-[7vw] pb-[18vh]">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 md:grid-cols-2">
              {rest.map((post) => (
                <JournalCard
                  key={post._id}
                  slug={post.slug.current}
                  imageUrl={urlFor(post.heroImage).width(900).quality(80).url()}
                  imageAlt={resolveLocaleField(post.heroImage.alt, locale) ?? ''}
                  category={post.category}
                  publishedAt={post.publishedAt}
                  title={resolveLocaleField(post.title, locale) ?? ''}
                  excerpt={resolveLocaleField(post.excerpt, locale) ?? ''}
                  readArticleLabel={t('readArticle')}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
