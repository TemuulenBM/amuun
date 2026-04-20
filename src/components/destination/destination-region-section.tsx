import type { Locale } from '@/lib/locale/resolve-locale-field';
import { DestinationCard } from './destination-card';
import type { LocaleString, ImageWithAlt } from '@/types/sanity';

export interface RegionSectionData {
  regionSlug: 'central' | 'gobi' | 'western' | 'northern' | 'terelj';
  regionLabel: string;
  regionTagline: string;
  destinations: Array<{
    _id: string;
    title: LocaleString;
    slug: { current: string };
    subtitle?: LocaleString;
    region: string;
    bestTime?: LocaleString;
    highlights?: LocaleString[];
    heroImage: ImageWithAlt;
  }>;
}

interface DestinationRegionSectionProps extends RegionSectionData {
  locale: Locale;
  bestTimeLabel: string;
  highlightsCountLabel: (count: number) => string;
  ctaLabel: string;
}

export function DestinationRegionSection({
  regionSlug,
  regionLabel,
  regionTagline,
  destinations,
  locale,
  bestTimeLabel,
  highlightsCountLabel,
  ctaLabel,
}: DestinationRegionSectionProps) {
  const taglineWords = regionTagline.split(' ');
  const taglineFirst = taglineWords[0] ?? regionTagline;
  const taglineRest = taglineWords.slice(1).join(' ');

  return (
    <section
      id={`region-${regionSlug}`}
      className="scroll-mt-20 border-t border-[#1E2128] px-[7vw] py-[14vh]"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-[8vh] flex flex-col gap-3">
          <span className="eyebrow text-[#D4A23A]">{regionLabel}</span>
          <h2 className="font-serif text-4xl font-semibold text-[#F7F7F5] md:text-5xl">
            <em className="italic font-normal">{taglineFirst}</em>
            {taglineRest ? <strong className="font-semibold"> {taglineRest}</strong> : null}
          </h2>
        </header>
        <div className="flex flex-col gap-[10vh]">
          {destinations.map((dest, idx) => (
            <DestinationCard
              key={dest._id}
              destination={dest}
              locale={locale}
              imageOnRight={idx % 2 === 1}
              bestTimeLabel={bestTimeLabel}
              highlightsCountLabel={highlightsCountLabel}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
