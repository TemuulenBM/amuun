import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { formatPrice } from '@/lib/format/price';
import type { LocaleString, LocaleText, ImageWithAlt, TourPricingData } from '@/types/tour';

interface ReverseTourItem {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  heroImage: ImageWithAlt;
  pricing: TourPricingData;
}

interface DestinationToursProps {
  tours: ReverseTourItem[];
  locale: Locale;
  heading: string;
  emptyMessage: string;
}

export function DestinationTours({ tours, locale, heading, emptyMessage }: DestinationToursProps) {
  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">{heading}</h2>
        {tours.length === 0 ? (
          <p className="mt-6 text-[#9A9A95]">{emptyMessage}</p>
        ) : (
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {tours.slice(0, 6).map((tour) => {
              const title = resolveLocaleField(tour.title, locale) ?? '';
              const summary = resolveLocaleField(tour.summary, locale) ?? '';
              const alt = resolveLocaleField(tour.heroImage.alt, locale) ?? title;
              const imgSrc = urlFor(tour.heroImage).width(1400).quality(85).url();
              const priceLabel = formatPrice(tour.pricing.standard, tour.pricing.currency, locale);
              const difficultyLabel =
                tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1);

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
                    {tour.duration} days · {difficultyLabel}
                  </span>
                  <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{title}</h3>
                  <p className="line-clamp-3 max-w-lg text-[#A7ACB4]">{summary}</p>
                  <div className="flex items-baseline justify-between border-t border-[#F7F7F5]/10 pt-4">
                    <span className="font-serif text-xl text-[#F7F7F5]">{priceLabel}</span>
                  </div>
                </LocaleLink>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
