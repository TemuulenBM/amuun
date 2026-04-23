import { getTranslations } from 'next-intl/server';
import { BookThisTour } from '@/components/tour/book-this-tour';
import type { Locale } from '@/lib/locale/resolve-locale-field';

interface TourCtaBandProps {
  tourSlug: string;
  tourTitle: string;
  locale: Locale;
  siteKey: string | undefined;
}

export async function TourCtaBand({ tourSlug, tourTitle, locale, siteKey }: TourCtaBandProps) {
  const t = await getTranslations('tour');
  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[18vh]">
      <div className="mx-auto max-w-3xl border-t border-b border-[#D4A23A]/30 py-16 text-center">
        <h2 className="headline-subsection font-serif text-[#F7F7F5]">{t('ctaHeadline')}</h2>
        <p className="mt-6 text-base leading-relaxed text-[#A7ACB4]">{t('ctaBody')}</p>

        <div className="mt-10 flex justify-center">
          <BookThisTour
            variant="primary"
            locale={locale}
            siteKey={siteKey}
            tourSlug={tourSlug}
            tourTitle={tourTitle}
          />
        </div>

        <div className="mt-6">
          <a
            href="#"
            className="font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4] transition-colors hover:text-[#D4A23A]"
          >
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  );
}
