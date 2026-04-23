'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { contactSchema, type ContactInput } from '@/lib/schemas/contact.schema';
import { FormShell } from './form-shell';
import { FormField } from './form-field';

interface ContactFormProps {
  locale: 'en' | 'ko' | 'mn';
  siteKey: string | undefined;
}

export function ContactForm({ locale, siteKey }: ContactFormProps) {
  const t = useTranslations('forms.common');
  const tc = useTranslations('forms.contact');
  const tErr = useTranslations('forms.common.errors');

  const {
    register,
    formState: { errors },
    getValues,
    setError,
    reset,
    watch,
    setValue,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      formType: 'contact',
      name: '',
      email: '',
      phone: '',
      message: '',
      subject: undefined,
      locale,
      consentAccepted: false as unknown as true,
      honeypot: '' as const,
      turnstileToken: '',
    },
  });

  const consent = watch('consentAccepted') === true;

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
      endpoint="/api/contact"
      locale={locale}
      siteKey={siteKey}
      buildPayload={() => getValues()}
      onValidationErrors={(fields) => {
        for (const [path, code] of Object.entries(fields)) {
          setError(path as keyof ContactInput, { type: 'server', message: code });
        }
      }}
      resetForm={() =>
        reset({
          formType: 'contact',
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: undefined,
          locale,
          consentAccepted: false as unknown as true,
          honeypot: '' as const,
          turnstileToken: '',
        })
      }
      consentValue={consent}
      onConsentChange={(v) => setValue('consentAccepted', v as true, { shouldValidate: true })}
      consentError={errors.consentAccepted ? mapErrorCode(errors.consentAccepted.message, 'consent') : undefined}
    >
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
      <FormField
        as="select"
        label={tc('subject.label')}
        {...register('subject')}
        error={errors.subject ? mapErrorCode(errors.subject.message, 'required') : undefined}
      >
        <option value="">{tc('subject.placeholder')}</option>
        <option value="general">{tc('subject.options.general')}</option>
        <option value="press">{tc('subject.options.press')}</option>
        <option value="partnership">{tc('subject.options.partnership')}</option>
        <option value="other">{tc('subject.options.other')}</option>
      </FormField>
      <FormField
        as="textarea"
        label={t('message')}
        {...register('message')}
        error={errors.message ? mapErrorCode(errors.message.message, 'minLength') : undefined}
      />
    </FormShell>
  );
}
