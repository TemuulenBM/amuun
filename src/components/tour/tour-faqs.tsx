'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourFaqRef } from '@/types/tour';

interface TourFaqsProps {
  faqs: TourFaqRef[];
  locale: Locale;
}

export function TourFaqs({ faqs, locale }: TourFaqsProps) {
  const t = useTranslations('tour');
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow block">{t('faqsEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('faqs')}</h2>

        <div className="mt-12 divide-y divide-[#F7F7F5]/10">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            const question = resolveLocaleField(faq.question, locale) ?? '';
            const answer = resolveLocaleField(faq.answer, locale);
            return (
              <div key={faq._id} className="py-6">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq._id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq._id}`}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <span className="font-serif text-xl font-semibold text-[#F7F7F5]">{question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#D4A23A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  id={`faq-${faq._id}`}
                  hidden={!isOpen}
                  className="mt-4 max-w-2xl"
                >
                  {answer ? <PortableTextRenderer value={answer} /> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
