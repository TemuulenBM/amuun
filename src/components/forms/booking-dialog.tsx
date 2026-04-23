'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { BookingForm } from './booking-form';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourSlug: string;
  tourTitle: string;
  defaultTier?: 'standard' | 'deluxe' | 'private';
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  trigger?: ReactNode;
}

export function BookingDialog({
  open,
  onOpenChange,
  tourSlug,
  tourTitle,
  defaultTier,
  locale,
  siteKey,
}: BookingDialogProps) {
  const tb = useTranslations('forms.booking');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Focus close button on open — focus trap delegated to Escape + outside click.
    closeBtnRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previouslyFocused.current?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-dialog-title"
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-16 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-[#F4F1EA] p-8 lg:p-12"
      >
        <button
          ref={closeBtnRef}
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 border border-[#0B0D10]/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10] transition hover:bg-[#0B0D10] hover:text-[#F4F1EA]"
          aria-label={tb('close')}
        >
          ✕
        </button>
        <h2
          id="booking-dialog-title"
          className="mb-2 font-serif text-3xl text-[#0B0D10]"
        >
          {tb('title')}
        </h2>
        <p className="mb-8 text-[14px] leading-relaxed text-[#0B0D10]/70">
          {tb('intro')}
        </p>
        <BookingForm
          locale={locale}
          siteKey={siteKey}
          tourSlug={tourSlug}
          tourTitle={tourTitle}
          defaultTier={defaultTier}
        />
      </div>
    </div>
  );
}
