import type { Locale } from '@/lib/locale/resolve-locale-field';

const INTL_LOCALES: Record<Locale, string> = {
  en: 'en-US',
  ko: 'ko-KR',
  mn: 'mn-MN',
};

export function formatPrice(
  amount: number,
  currency: 'USD' | 'EUR' | 'KRW',
  locale: Locale,
): string {
  return new Intl.NumberFormat(INTL_LOCALES[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}
