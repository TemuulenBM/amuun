import { getTranslations } from 'next-intl/server';
import { Check, X } from 'lucide-react';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleString } from '@/types/tour';

interface TourIncludedExcludedProps {
  included?: LocaleString[];
  excluded?: LocaleString[];
  locale: Locale;
}

export async function TourIncludedExcluded({
  included,
  excluded,
  locale,
}: TourIncludedExcludedProps) {
  const t = await getTranslations('tour');
  if ((!included || included.length === 0) && (!excluded || excluded.length === 0)) return null;

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        {included && included.length > 0 ? (
          <div>
            <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{t('included')}</h3>
            <ul className="mt-8 space-y-4">
              {included.map((item, i) => {
                const text = resolveLocaleField(item, locale) ?? '';
                return (
                  <li key={`inc-${i}`} className="flex items-start gap-3 text-[#F7F7F5]">
                    <Check size={18} className="mt-1 shrink-0 text-[#D4A23A]" aria-hidden />
                    <span className="text-base leading-relaxed">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {excluded && excluded.length > 0 ? (
          <div>
            <h3 className="font-serif text-3xl font-semibold text-[#F7F7F5]">{t('excluded')}</h3>
            <ul className="mt-8 space-y-4">
              {excluded.map((item, i) => {
                const text = resolveLocaleField(item, locale) ?? '';
                return (
                  <li key={`exc-${i}`} className="flex items-start gap-3 text-[#A7ACB4]">
                    <X size={18} className="mt-1 shrink-0 text-[#A7ACB4]/60" aria-hidden />
                    <span className="text-base leading-relaxed">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
