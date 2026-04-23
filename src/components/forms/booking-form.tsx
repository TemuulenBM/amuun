'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  bookingSchema,
  type BookingInput,
} from '@/lib/schemas/booking.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface BookingFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
  tourSlug: string;
  tourTitle: string;
  defaultTier?: 'standard' | 'deluxe' | 'private';
}

const labelCls =
  'mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';

export function BookingForm({
  locale,
  siteKey,
  tourSlug,
  tourTitle,
  defaultTier,
}: BookingFormProps) {
  const t = useTranslations('forms.common');
  const tb = useTranslations('forms.booking');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema) as unknown as Resolver<BookingInput>,
    mode: 'onBlur',
    defaultValues: {
      formType: 'booking',
      name: '',
      email: '',
      phone: '',
      message: '',
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
      tourSlug,
      tourTitle,
      preferredStartDate: undefined as unknown as Date,
      adults: 2,
      children: 0,
      tier: defaultTier ?? 'standard',
      specialRequests: '',
    },
  });

  const consent = watch('consentAccepted') === true;
  const currentTier = watch('tier');

  function mapErrorCode(code: string | undefined, fallbackKey: string): string {
    if (!code) return tErr(fallbackKey);
    try {
      return tErr(code);
    } catch {
      return tErr(fallbackKey);
    }
  }

  return (
    <FormShell
      endpoint="/api/booking"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof BookingInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'booking',
          name: '',
          email: '',
          phone: '',
          message: '',
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
          tourSlug,
          tourTitle,
          preferredStartDate: undefined as unknown as Date,
          adults: 2,
          children: 0,
          tier: defaultTier ?? 'standard',
          specialRequests: '',
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
      <p className={labelCls}>{tb('tour')}</p>
      <p className="-mt-4 font-serif text-xl text-[#0B0D10]">{tourTitle}</p>

      <FormField
        label={t('name')}
        autoComplete="name"
        {...register('name')}
        error={errors.name ? mapErrorCode(errors.name.message, 'required') : undefined}
      />
      <FormField
        label={t('email')}
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email ? mapErrorCode(errors.email.message, 'email') : undefined}
      />
      <FormField
        label={t('phone')}
        type="tel"
        autoComplete="tel"
        {...register('phone')}
        error={errors.phone ? mapErrorCode(errors.phone.message, 'minLength') : undefined}
      />

      <div>
        <p className={labelCls}>{tb('tierLabel.label')}</p>
        <div className="flex gap-2">
          {(['standard', 'deluxe', 'private'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setValue('tier', tier, { shouldValidate: true })}
              aria-pressed={currentTier === tier}
              className={`flex-1 border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                currentTier === tier
                  ? 'border-[#0B0D10] bg-[#0B0D10] text-[#F4F1EA]'
                  : 'border-[#0B0D10]/30 text-[#0B0D10] hover:border-[#D4A23A]'
              }`}
            >
              {tb(`tierLabel.${tier}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label={tb('adults')}
          type="number"
          min={1}
          max={20}
          {...register('adults', { valueAsNumber: true })}
          error={errors.adults ? mapErrorCode(errors.adults.message, 'partySize') : undefined}
        />
        <FormField
          label={tb('children')}
          type="number"
          min={0}
          max={20}
          {...register('children', { valueAsNumber: true })}
          error={errors.children ? mapErrorCode(errors.children.message, 'partySize') : undefined}
        />
      </div>

      <FormField
        label={tb('preferredDate')}
        type="date"
        {...register('preferredStartDate', { valueAsDate: true })}
        error={
          errors.preferredStartDate
            ? mapErrorCode(errors.preferredStartDate.message, 'dateTooSoon')
            : undefined
        }
      />

      <FormField
        as="textarea"
        label={tb('specialRequests')}
        rows={3}
        {...register('specialRequests')}
        error={errors.specialRequests ? mapErrorCode(errors.specialRequests.message, 'maxLength') : undefined}
      />

      <FormField
        as="textarea"
        label={t('message')}
        rows={5}
        {...register('message')}
        error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
      />
    </FormShell>
  );
}
