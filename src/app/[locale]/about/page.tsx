import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/lib/fetcher';
import { siteSettingsQuery, teamMembersQuery, testimonialsQuery } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { Footer } from '@/components/layout/footer';
import { AboutHero } from '@/components/about/about-hero';
import { AboutStory } from '@/components/about/about-story';
import { AboutTeam } from '@/components/about/about-team';
import { AboutTestimonials } from '@/components/about/about-testimonials';
import type { SiteSettings, TeamMember, Testimonial } from '@/types/sanity';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'about' });

  const [settings, allMembers, testimonials] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery, {}, { tags: ['siteSettings'] }),
    sanityFetch<TeamMember[]>(teamMembersQuery, {}, { tags: ['teamMember'] }),
    sanityFetch<Testimonial[]>(testimonialsQuery, {}, { tags: ['testimonial'] }),
  ]);

  const members = (allMembers ?? []).filter((m) => m._id !== 'team-temuulen').slice(0, 4);

  const heroImageUrl = settings?.aboutHeroImage?.asset
    ? urlFor(settings.aboutHeroImage).width(2000).quality(85).url()
    : null;

  const heroImageAlt = settings?.aboutHeroImage?.alt
    ? (resolveLocaleField(settings.aboutHeroImage.alt, locale) ?? 'Amuun — Mongolia')
    : 'Amuun — Mongolia';

  const storyBlocks = settings?.aboutStory
    ? (resolveLocaleField(settings.aboutStory, locale) as PortableTextBlock[] | null)
    : null;

  const storyImageUrl = settings?.aboutImage?.asset
    ? urlFor(settings.aboutImage).width(800).quality(85).url()
    : null;

  const storyImageAlt = settings?.aboutImage?.alt
    ? (resolveLocaleField(settings.aboutImage.alt, locale) ?? 'Amuun story')
    : 'Amuun story';

  const tagline = settings?.tagline ? (resolveLocaleField(settings.tagline, locale) ?? '') : '';

  return (
    <>
      <AboutHero
        imageUrl={heroImageUrl}
        imageAlt={heroImageAlt}
        eyebrow={t('eyebrow')}
        title={t('title')}
        tagline={tagline}
      />
      <AboutStory
        eyebrow={t('storyEyebrow')}
        heading={t('storyHeading')}
        storyBlocks={storyBlocks}
        imageUrl={storyImageUrl}
        imageAlt={storyImageAlt}
      />
      <AboutTeam
        eyebrow={t('teamEyebrow')}
        heading={t('teamHeading')}
        members={members}
        locale={locale}
      />
      <AboutTestimonials
        eyebrow={t('testimonialsEyebrow')}
        heading={t('testimonialsHeading')}
        testimonials={testimonials ?? []}
        locale={locale}
      />
      <Footer />
    </>
  );
}
