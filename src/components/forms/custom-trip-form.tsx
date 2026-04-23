'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  customTripSchema,
  type CustomTripInput,
  interestEnum,
  budgetEnum,
} from '@/lib/schemas/custom-trip.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface CustomTripFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
}

const fieldsetCls = 'border-t border-[#0B0D10]/20 pt-6';
const legendCls =
  'mb-4 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';

export function CustomTripForm({ locale, siteKey }: CustomTripFormProps) {
  const t = useTranslations('forms.common');
  const tc = useTranslations('forms.customTrip');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<CustomTripInput>({
    resolver: zodResolver(customTripSchema) as unknown as Resolver<CustomTripInput>,
    mode: 'onBlur',
    defaultValues: {
      formType: 'customTrip',
      name: '',
      email: '',
      phone: '',
      message: '',
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
      partySize: 2,
      travelStartDate: undefined as unknown as Date,
      travelEndDate: undefined as unknown as Date,
      interests: [],
      budgetRange: undefined as unknown as (typeof budgetEnum)['_output'],
    },
  });

  const consent = watch('consentAccepted') === true;
  const selectedInterests = watch('interests') ?? [];

  function toggleInterest(value: (typeof interestEnum)['_output']) {
    const current = new Set(selectedInterests);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue('interests', Array.from(current), { shouldValidate: true });
  }

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
      endpoint="/api/custom-trip"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof CustomTripInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'customTrip',
          name: '',
          email: '',
          phone: '',
          message: '',
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
          partySize: 2,
          travelStartDate: undefined as unknown as Date,
          travelEndDate: undefined as unknown as Date,
          interests: [],
          budgetRange: undefined as unknown as (typeof budgetEnum)['_output'],
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
      <fieldset>
        <legend className={legendCls}>{tc('fieldsets.aboutYou')}</legend>
        <div className="flex flex-col gap-6">
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
        </div>
      </fieldset>

      <fieldset className={fieldsetCls}>
        <legend className={legendCls}>{tc('fieldsets.yourJourney')}</legend>
        <div className="flex flex-col gap-6">
          <FormField
            label={tc('partySize')}
            type="number"
            min={1}
            max={20}
            hint={tc('partySizeHint')}
            {...register('partySize', { valueAsNumber: true })}
            error={errors.partySize ? mapErrorCode(errors.partySize.message, 'partySize') : undefined}
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label={tc('travelWindow.start')}
              type="date"
              {...register('travelStartDate', { valueAsDate: true })}
              error={
                errors.travelStartDate
                  ? mapErrorCode(errors.travelStartDate.message, 'dateTooSoon')
                  : undefined
              }
            />
            <FormField
              label={tc('travelWindow.end')}
              type="date"
              {...register('travelEndDate', { valueAsDate: true })}
              error={
                errors.travelEndDate
                  ? mapErrorCode(errors.travelEndDate.message, 'dateRangeOrder')
                  : undefined
              }
            />
          </div>

          <div>
            <span className={legendCls}>{tc('interests.label')}</span>
            <div className="flex flex-wrap gap-2">
              {(['culture', 'nature', 'adventure', 'food'] as const).map((value) => {
                const active = selectedInterests.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleInterest(value)}
                    aria-pressed={active}
                    className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                      active
                        ? 'border-[#0B0D10] bg-[#0B0D10] text-[#F4F1EA]'
                        : 'border-[#0B0D10]/30 text-[#0B0D10] hover:border-[#D4A23A]'
                    }`}
                  >
                    {tc(`interests.${value}`)}
                  </button>
                );
              })}
            </div>
            {errors.interests ? (
              <p className="mt-1 text-[12px] text-red-700" role="alert">
                {mapErrorCode(errors.interests.message, 'minLength')}
              </p>
            ) : null}
          </div>

          <FormField
            as="select"
            label={tc('budget.label')}
            {...register('budgetRange')}
            error={errors.budgetRange ? mapErrorCode(errors.budgetRange.message, 'required') : undefined}
          >
            <option value="">{tc('budget.placeholder')}</option>
            <option value="under-3k">{tc('budget.options.under-3k')}</option>
            <option value="3k-5k">{tc('budget.options.3k-5k')}</option>
            <option value="5k-10k">{tc('budget.options.5k-10k')}</option>
            <option value="10k-plus">{tc('budget.options.10k-plus')}</option>
          </FormField>

          <FormField
            as="textarea"
            label={t('message')}
            {...register('message')}
            error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
          />
        </div>
      </fieldset>
    </FormShell>
  );
}
