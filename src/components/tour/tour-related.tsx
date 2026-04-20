import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import type { TourRelatedRef } from '@/types/tour';

interface TourRelatedProps {
  tours: TourRelatedRef[];
  locale: Locale;
}

export async function TourRelated({ tours, locale }: TourRelatedProps) {
  const t = await getTranslations('tour');
  if (tours.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('relatedEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('related')}</h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {tours.map((tour) => {
            const title = resolveLocaleField(tour.title, locale) ?? '';
            const summary = resolveLocaleField(tour.summary, locale) ?? '';
            const imgSrc = urlFor(tour.heroImage).width(900).quality(80).url();
            const alt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
            return (
              <LocaleLink
                key={tour._id}
                href={`/tours/${tour.slug.current}`}
                className="group flex flex-col gap-4"
              >
                <div className="image-card aspect-[4/5] overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={alt}
                    width={900}
                    height={1125}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
                  {tour.duration} · {tour.difficulty}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#F7F7F5]">{title}</h3>
                <p className="line-clamp-2 text-sm text-[#A7ACB4]">{summary}</p>
                <span className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
                  {t('viewExpedition')} →
                </span>
              </LocaleLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
