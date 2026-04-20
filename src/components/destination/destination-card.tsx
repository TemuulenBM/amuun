import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleString, ImageWithAlt } from '@/types/sanity';

interface DestinationCardData {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  subtitle?: LocaleString;
  region: string;
  bestTime?: LocaleString;
  highlights?: LocaleString[];
  heroImage: ImageWithAlt;
}

interface DestinationCardProps {
  destination: DestinationCardData;
  locale: Locale;
  imageOnRight?: boolean;
  bestTimeLabel: string;
  highlightsCountLabel: (count: number) => string;
  ctaLabel: string;
}

export function DestinationCard({
  destination,
  locale,
  imageOnRight = false,
  bestTimeLabel,
  highlightsCountLabel,
  ctaLabel,
}: DestinationCardProps) {
  const title = resolveLocaleField(destination.title, locale) ?? '';
  const subtitle = resolveLocaleField(destination.subtitle, locale) ?? '';
  const bestTime = resolveLocaleField(destination.bestTime, locale) ?? '';
  const heroAlt = resolveLocaleField(destination.heroImage.alt, locale) ?? title;
  const heroSrc = urlFor(destination.heroImage).width(1600).quality(85).url();
  const highlightsCount = destination.highlights?.length ?? 0;

  // Italic+bold split: first word italic, rest bold (matches established brand pattern)
  const titleWords = title.split(' ');
  const firstWord = titleWords[0] ?? title;
  const restWords = titleWords.slice(1).join(' ');

  const imageBlock = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
      <Image
        src={heroSrc}
        alt={heroAlt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center gap-6">
      <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
        <em className="italic font-normal">{firstWord}</em>
        {restWords ? <strong className="font-semibold"> {restWords}</strong> : null}
      </h3>
      {subtitle ? (
        <p className="text-sm uppercase tracking-[0.2em] text-[#9A9A95]">{subtitle}</p>
      ) : null}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[#C8C7C2]">
        <div>
          <dt className="text-[#9A9A95]">{bestTimeLabel}</dt>
          <dd>{bestTime || '—'}</dd>
        </div>
        <div>
          <dt className="text-[#9A9A95]">&nbsp;</dt>
          <dd>{highlightsCountLabel(highlightsCount)}</dd>
        </div>
      </dl>
      <LocaleLink
        href={`/destinations/${destination.slug.current}`}
        className="mt-2 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#D4A23A] hover:text-[#E8B958]"
      >
        {ctaLabel} →
      </LocaleLink>
    </div>
  );

  return (
    <article className="grid items-center gap-10 md:grid-cols-2">
      {imageOnRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </article>
  );
}
