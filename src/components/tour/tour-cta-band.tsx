import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/shared/locale-link';

interface TourCtaBandProps {
  tourSlug: string;
}

export async function TourCtaBand({ tourSlug }: TourCtaBandProps) {
  const t = await getTranslations('tour');
  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[18vh]">
      <div className="mx-auto max-w-3xl border-t border-b border-[#D4A23A]/30 py-16 text-center">
        <h2 className="headline-subsection font-serif text-[#F7F7F5]">{t('ctaHeadline')}</h2>
        <p className="mt-6 text-base leading-relaxed text-[#A7ACB4]">{t('ctaBody')}</p>

        <LocaleLink
          href={`/contact?tour=${tourSlug}`}
          className="mt-10 inline-flex items-center gap-3 bg-[#D4A23A] px-10 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#0B0D10] transition-colors hover:bg-[#F7F7F5]"
        >
          {t('ctaPrimary')}
          <span aria-hidden>→</span>
        </LocaleLink>

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
