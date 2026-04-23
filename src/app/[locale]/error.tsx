'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Stamp } from '@/components/shared/stamp';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const e = useTranslations('errors');
  const stub = useTranslations('stub');
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-[#0B0D10] px-[7vw] text-center">
      <div className="relative flex items-center justify-center">
        <span
          aria-hidden
          className="pointer-events-none absolute select-none font-serif font-semibold leading-none text-[#F7F7F5]"
          style={{ fontSize: 'clamp(160px, 22vw, 320px)', opacity: 0.04 }}
        >
          500
        </span>
        <Stamp className="relative z-10" />
      </div>

      <p className="eyebrow mt-10 mb-5 text-[#D4A23A]">{e('errorEyebrow')}</p>
      <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">
        {e('errorTitle')}
      </h1>
      <p className="mt-4 mb-12 max-w-xs font-mono text-xs tracking-wide text-[#F7F7F5]/40">
        {e('errorDesc')}
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <button onClick={reset} className="cta-link">
          {e('retry')}
        </button>
        <span className="hidden text-[#F7F7F5]/20 sm:block">·</span>
        <button onClick={() => router.push('/')} className="cta-link">
          {stub('backHome')}
        </button>
      </div>
    </main>
  );
}
