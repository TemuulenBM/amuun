import { getTranslations } from 'next-intl/server';
import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourDestinationRef } from '@/types/tour';

interface TourOverviewProps {
  summary: string;
  description?: PortableTextBlock[];
  destinations?: TourDestinationRef[];
  locale: Locale;
}

export async function TourOverview({ summary, description, destinations, locale }: TourOverviewProps) {
  const t = await getTranslations('tour');
  const regions = Array.from(
    new Set((destinations ?? []).map((d) => d.region).filter((v): v is string => !!v)),
  );

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_0.6fr]">
        <div>
          <span className="eyebrow block">{t('overviewEyebrow')}</span>
          <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('overview')}</h2>
          <p className="mt-10 max-w-xl font-serif text-2xl leading-[1.4] text-[#F7F7F5]">
            {summary}
          </p>
          {description ? (
            <div className="mt-10 max-w-2xl">
              <PortableTextRenderer value={description} />
            </div>
          ) : null}

          {destinations && destinations.length > 0 ? (
            <div className="mt-12 flex flex-wrap gap-3">
              {destinations.map((dest) => {
                const destTitle = resolveLocaleField(dest.title, locale) ?? '';
                return (
                  <LocaleLink
                    key={dest._id}
                    href={`/destinations/${dest.slug.current}`}
                    className="inline-flex items-center gap-2 border border-[#D4A23A]/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A] transition-colors hover:bg-[#D4A23A] hover:text-[#0B0D10]"
                  >
                    {destTitle}
                  </LocaleLink>
                );
              })}
            </div>
          ) : null}
        </div>

        {regions.length > 0 ? (
          <aside className="space-y-6 border-l border-[#D4A23A]/20 pl-10">
            <span className="eyebrow block">Regions</span>
            <ul className="space-y-3 font-serif text-xl text-[#F7F7F5]">
              {regions.map((region) => (
                <li key={region} className="border-b border-[#F7F7F5]/10 pb-3 last:border-none">
                  {region}
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
