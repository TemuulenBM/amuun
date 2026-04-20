'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { TourItineraryDay, ImageWithAlt } from '@/types/tour';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';

interface TourItineraryProps {
  days: TourItineraryDay[];
  locale: Locale;
}

function imageUrl(image: ImageWithAlt | undefined) {
  if (!image) return undefined;
  return urlFor(image).width(1400).quality(85).url();
}

export function TourItinerary({ days, locale }: TourItineraryProps) {
  const t = useTranslations('tour');
  const [activeKey, setActiveKey] = useState(days[0]?._key ?? '');
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = panelsRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveKey(visible.target.getAttribute('data-key') ?? '');
      },
      { root: null, threshold: [0.4, 0.6], rootMargin: '-30% 0px -30% 0px' },
    );
    const panels = root.querySelectorAll('[data-key]');
    panels.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [days]);

  if (days.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('itineraryEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('itinerary')}</h2>

        <div className="mt-16 grid gap-10 md:grid-cols-[220px_1fr]">
          <nav className="hidden md:block">
            <ol className="sticky top-[20vh] space-y-3">
              {days.map((day) => {
                const isActive = day._key === activeKey;
                const title = resolveLocaleField(day.title, locale) ?? '';
                return (
                  <li key={day._key}>
                    <a
                      href={`#day-${day.day}`}
                      className={`flex flex-col gap-1 border-l-2 pl-4 py-1 transition-colors ${
                        isActive
                          ? 'border-[#D4A23A] text-[#D4A23A]'
                          : 'border-[#F7F7F5]/10 text-[#A7ACB4] hover:text-[#F7F7F5]'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                        {t('dayLabel')} {String(day.day).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-sm">{title}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div ref={panelsRef} className="space-y-20">
            {days.map((day) => {
              const title = resolveLocaleField(day.title, locale) ?? '';
              const description = resolveLocaleField(day.description, locale) ?? '';
              const accommodation = resolveLocaleField(day.accommodation, locale);
              const imgSrc = imageUrl(day.image);
              const imgAlt = resolveLocaleField(day.image?.alt, locale) ?? title;
              return (
                <article
                  key={day._key}
                  id={`day-${day.day}`}
                  data-key={day._key}
                  className="scroll-mt-[20vh]"
                >
                  {imgSrc ? (
                    <div className="image-card mb-8 aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        width={1400}
                        height={933}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#D4A23A]">
                    {t('dayLabel')} {String(day.day).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-serif text-3xl font-semibold text-[#F7F7F5]">{title}</h3>
                  <p className="mt-6 max-w-2xl text-base leading-[1.8] text-[#A7ACB4] font-light">
                    {description}
                  </p>
                  <dl className="mt-8 grid gap-4 border-t border-[#F7F7F5]/10 pt-6 text-sm sm:grid-cols-2">
                    {accommodation ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                          {t('accommodation')}
                        </dt>
                        <dd className="mt-1 text-[#F7F7F5]">{accommodation}</dd>
                      </div>
                    ) : null}
                    {day.meals && day.meals.length > 0 ? (
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                          {t('meals')}
                        </dt>
                        <dd className="mt-1 flex flex-wrap gap-2 text-[#F7F7F5]">
                          {day.meals.map((m) => (
                            <span
                              key={m}
                              className="border border-[#D4A23A]/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#D4A23A]"
                            >
                              {t(m)}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
