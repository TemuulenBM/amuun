import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/shared/locale-link';
import { formatPrice } from '@/lib/format/price';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { TourPricingData } from '@/types/tour';

interface TourPricingProps {
  pricing: TourPricingData;
  tourSlug: string;
  locale: Locale;
}

export async function TourPricing({ pricing, tourSlug, locale }: TourPricingProps) {
  const t = await getTranslations('tour');
  const tiers = [
    { key: 'standard' as const, label: t('pricingStandard'), amount: pricing.standard },
    { key: 'deluxe' as const, label: t('pricingDeluxe'), amount: pricing.deluxe },
    { key: 'private' as const, label: t('pricingPrivate'), amount: pricing.private },
  ];
  const perLabel = pricing.perPerson ? t('pricingPerPerson') : t('pricingPerGroup');
  const notes = resolveLocaleField(pricing.notes, locale);

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('pricingEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('pricing')}</h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.key} className="image-card flex flex-col gap-6 p-10">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#D4A23A]">
                {tier.label}
              </span>
              <div>
                <div className="font-serif text-5xl font-semibold text-[#F7F7F5]">
                  {formatPrice(tier.amount, pricing.currency, locale)}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
                  {perLabel}
                </div>
              </div>
              <LocaleLink
                href={`/contact?tour=${tourSlug}&tier=${tier.key}`}
                className="mt-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A] transition-colors hover:text-[#F7F7F5]"
              >
                {t('pricingInquire')}
                <span aria-hidden>→</span>
              </LocaleLink>
            </article>
          ))}
        </div>

        {notes ? (
          <p className="mt-10 max-w-2xl font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
            {notes}
          </p>
        ) : null}
      </div>
    </section>
  );
}
