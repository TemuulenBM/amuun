import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { blogPostBySlugQuery, blogPostSlugsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { JournalArticleHero } from '@/components/journal/journal-article-hero';
import { JournalArticleBody } from '@/components/journal/journal-article-body';
import { JournalRelatedTours } from '@/components/journal/journal-related-tours';
import { routing } from '@/i18n/routing';
import type { LocaleString, LocaleText, LocaleBlockContent, ImageWithAlt, TourRelatedRef } from '@/types/tour';

interface AuthorRef {
  _id: string;
  name: string;
  role: LocaleString;
}

interface BlogPostDetail {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  excerpt?: LocaleText;
  content?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  category: string;
  author?: AuthorRef;
  relatedTours?: TourRelatedRef[];
  publishedAt: string;
  seo?: {
    metaTitle?: LocaleString;
    metaDescription?: LocaleText;
    ogImage?: ImageWithAlt;
  };
}

function estimateReadTime(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks?.length) return 1;
  const text = blocks
    .map((b) => {
      const block = b as { children?: Array<{ text: string }> };
      return block.children?.map((c) => c.text).join(' ') ?? '';
    })
    .join(' ');
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

export async function generateStaticParams() {
  const slugs =
    (await sanityFetch<string[]>(blogPostSlugsQuery, {}, { tags: ['blogPost'] })) ?? [];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await sanityFetch<BlogPostDetail>(
    blogPostBySlugQuery,
    { slug },
    { tags: ['blogPost', slug] },
  );
  if (!post) return { title: 'Amuun' };

  const title =
    resolveLocaleField(post.seo?.metaTitle, locale) ??
    resolveLocaleField(post.title, locale) ??
    'Amuun';
  const description =
    resolveLocaleField(post.seo?.metaDescription, locale) ??
    resolveLocaleField(post.excerpt, locale);
  const ogImageSrc = post.seo?.ogImage ?? post.heroImage;
  const ogImage = ogImageSrc ? urlFor(ogImageSrc).width(1200).height(630).url() : undefined;

  return {
    title: `${title} · Journal · Amuun`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, t] = await Promise.all([
    sanityFetch<BlogPostDetail>(blogPostBySlugQuery, { slug }, { tags: ['blogPost', slug] }),
    getTranslations('journalArticle'),
  ]);

  if (!post) notFound();

  const title = resolveLocaleField(post.title, locale) ?? '';
  const imageUrl = urlFor(post.heroImage).width(2000).quality(85).url();
  const imageAlt = resolveLocaleField(post.heroImage.alt, locale) ?? title;
  const contentBlocks = resolveLocaleField(post.content, locale);
  const readTime = estimateReadTime(contentBlocks);
  const authorName = post.author?.name ?? 'Temuulen';
  const authorRole = resolveLocaleField(post.author?.role, locale) ?? 'Voidex Studio';
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const byline = `by ${authorName} · ${authorRole} · ${formattedDate} · ${t('readTime', { minutes: readTime })}`;

  return (
    <main className="relative min-h-screen bg-[#0B0D10]">
      <JournalArticleHero
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        category={post.category}
        title={title}
        byline={byline}
      />

      {contentBlocks?.length ? <JournalArticleBody blocks={contentBlocks} /> : null}

      {post.relatedTours?.length ? (
        <JournalRelatedTours tours={post.relatedTours} locale={locale} />
      ) : null}

      <Footer />
    </main>
  );
}
