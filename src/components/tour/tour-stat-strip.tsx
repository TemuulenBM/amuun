import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/lib/locale/resolve-locale-field';
import { formatPrice } from '@/lib/format/price';
import type { TourPricingData } from '@/types/tour';

interface TourStatStripProps {
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  pricing: TourPricingData;
  locale: Locale;
}

export async function TourStatStrip({ duration, difficulty, pricing, locale }: TourStatStripProps) {
  const t = await getTranslations('tour');
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const priceLabel = formatPrice(pricing.standard, pricing.currency, locale);

  return (
    <div className="inline-flex flex-wrap items-center gap-x-6 gap-y-2 border border-[#D4A23A]/40 bg-[#0B0D10]/70 px-6 py-4 backdrop-blur-sm">
      <Stat italic={`${duration}`} bold={t('statDays')} />
      <Divider />
      <Stat italic={difficultyLabel} bold={t('statExpedition')} />
      <Divider />
      <Stat italic={t('pricingFrom')} bold={priceLabel} />
    </div>
  );
}

function Stat({ italic, bold }: { italic: string; bold: string }) {
  return (
    <span className="flex items-baseline gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5]">
      <em className="font-serif text-base italic text-[#D4A23A] normal-case tracking-normal">
        {italic}
      </em>
      <strong className="font-semibold">{bold}</strong>
    </span>
  );
}

function Divider() {
  return <span className="hidden h-4 w-px bg-[#D4A23A]/30 sm:block" aria-hidden />;
}
