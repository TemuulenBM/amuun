export type Locale = 'en' | 'ko' | 'mn';

export function resolveLocaleField<T>(
  field: Partial<Record<Locale, T>> | undefined | null,
  locale: Locale,
  fallbackLocale: Locale = 'en',
): T | undefined {
  if (!field) return undefined;
  const direct = field[locale];
  if (direct !== undefined && direct !== null && direct !== '') return direct;
  const fallback = field[fallbackLocale];
  if (fallback !== undefined && fallback !== null && fallback !== '') return fallback;
  const first = Object.values(field).find(
    (v): v is T => v !== undefined && v !== null && v !== '',
  );
  return first;
}
