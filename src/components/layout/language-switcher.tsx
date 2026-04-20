'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { useTransition } from 'react';

type Locale = (typeof routing.locales)[number];

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: 'KO' },
  { code: 'mn', label: 'MN' },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.12em]">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => switchTo(l.code)}
          disabled={isPending}
          className={`transition-colors ${
            locale === l.code ? 'text-[#D4A23A]' : 'text-[#F7F7F5]/60 hover:text-[#D4A23A]'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
