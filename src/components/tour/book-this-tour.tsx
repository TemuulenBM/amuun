'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BookingDialog } from '@/components/forms/booking-dialog';

type Tier = 'standard' | 'deluxe' | 'private';

interface BookThisTourProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  tourSlug: string;
  tourTitle: string;
  variant: 'primary' | 'tier';
  tier?: Tier;
}

export function BookThisTour({
  locale,
  siteKey,
  tourSlug,
  tourTitle,
  variant,
  tier,
}: BookThisTourProps) {
  const tb = useTranslations('forms.booking');
  const [open, setOpen] = useState(false);

  const tierLabel = tier ? tb(`tierLabel.${tier}`) : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === 'primary'
            ? 'inline-flex items-center gap-2 border border-[#D4A23A] bg-[#D4A23A] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0B0D10] transition hover:bg-transparent hover:text-[#D4A23A]'
            : 'inline-flex items-center justify-center gap-2 border border-[#F4F1EA]/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#F4F1EA] transition hover:border-[#D4A23A] hover:text-[#D4A23A]'
        }
      >
        {variant === 'primary'
          ? tb('trigger')
          : tb('triggerTier', { tier: tierLabel ?? '' })}
      </button>
      <BookingDialog
        open={open}
        onOpenChange={setOpen}
        tourSlug={tourSlug}
        tourTitle={tourTitle}
        defaultTier={tier}
        locale={locale}
        siteKey={siteKey}
      />
    </>
  );
}
