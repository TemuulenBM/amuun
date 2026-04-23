'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface SuccessCardProps {
  onDismiss: () => void;
}

export function SuccessCard({ onDismiss }: SuccessCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslations('forms.common.success');

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-6 border border-[#0B0D10]/20 bg-[#F4F1EA] px-8 py-16 text-center outline-none"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 140 140"
        width="120"
        height="120"
        className="text-[#D4A23A]"
      >
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M48 72 L64 88 L94 54"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2 className="font-serif text-3xl text-[#0B0D10]">{t('title')}</h2>
      <p className="max-w-md text-[15px] leading-relaxed text-[#0B0D10]/70">
        {t('body')}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-2 border border-[#0B0D10]/30 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10] transition hover:bg-[#0B0D10] hover:text-[#F4F1EA]"
      >
        {t('dismiss')}
      </button>
    </div>
  );
}
