import { getTranslations } from 'next-intl/server';
import { LocaleLink } from '@/components/shared/locale-link';

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'YouTube', href: '#' },
] as const;

export async function Footer() {
  const t = await getTranslations('contact');
  const brand = await getTranslations('brand');

  return (
    <footer className="section-light px-[7vw] py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-[#0B0D10]/10 pt-8 md:flex-row">
        <LocaleLink
          href="/"
          className="font-serif text-2xl font-semibold text-[#0B0D10] transition-colors hover:text-[#D4A23A]"
        >
          {brand('name')}
        </LocaleLink>
        <span className="font-mono text-xs text-[#0B0D10]/50">{t('footer.copyright')}</span>
        <div className="flex gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50 transition-colors hover:text-[#D4A23A]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
