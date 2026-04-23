import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { Stamp } from '@/components/shared/stamp';

export default async function NotFound() {
  const [e, stub] = await Promise.all([
    getTranslations('errors'),
    getTranslations('stub'),
  ]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B0D10] px-[7vw] text-center">
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden
          className="pointer-events-none absolute select-none font-serif font-semibold leading-none text-[#F7F7F5]"
          style={{ fontSize: 'clamp(160px, 22vw, 320px)', opacity: 0.04 }}
        >
          404
        </span>
        <Stamp className="relative z-10" />
      </div>

      <p className="eyebrow mt-10 mb-5 text-[#D4A23A]">{e('notFoundEyebrow')}</p>
      <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">
        {e('notFoundTitle')}
      </h1>
      <p className="mt-4 mb-12 max-w-xs font-mono text-xs tracking-wide text-[#F7F7F5]/40">
        {e('notFoundDesc')}
      </p>
      <Link href="/" className="cta-link">
        {stub('backHome')}
      </Link>
    </main>
  );
}
