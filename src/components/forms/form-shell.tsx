'use client';

import {
  type ReactNode,
  type FormEventHandler,
  useState,
  useRef,
  useCallback,
} from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { ConsentCheckbox } from './consent-checkbox';
import { SuccessCard } from './success-card';
import { TurnstileWidget, type TurnstileHandle } from './turnstile-widget';
import type { ApiResult } from '@/lib/forms/types';

interface FormShellProps {
  endpoint: string;
  buildPayload: () => Record<string, unknown>;
  onValidationErrors: (fields: Record<string, string>) => void;
  resetForm: () => void;
  siteKey: string | undefined;
  locale: 'en' | 'ko' | 'mn';
  children: ReactNode;
  consentError?: string;
  consentValue: boolean;
  onConsentChange: (value: boolean) => void;
  honeypotName?: string;
  submitLabelKey?: string;
}

export function FormShell({
  endpoint,
  buildPayload,
  onValidationErrors,
  resetForm,
  siteKey,
  locale,
  children,
  consentError,
  consentValue,
  onConsentChange,
  honeypotName = 'honeypot',
  submitLabelKey = 'submit',
}: FormShellProps) {
  const t = useTranslations('forms.common');
  const tError = useTranslations('forms.common.errors');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileHandle | null>(null);

  const handleToken = useCallback((t: string) => setToken(t), []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!consentValue) return;
    if (!token) {
      toast.error(tError('turnstile'));
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...buildPayload(), turnstileToken: token };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiResult;
      if (data.ok) {
        setSuccess(true);
        resetForm();
        turnstileRef.current?.reset();
        return;
      }
      if (data.error === 'VALIDATION') {
        onValidationErrors(data.fields);
        toast.error(tError('serviceUnavailable'));
        return;
      }
      if (data.error === 'TURNSTILE_FAILED') {
        toast.error(tError('turnstile'));
        turnstileRef.current?.reset();
        setToken('');
        return;
      }
      toast.error(tError('serviceUnavailable'));
    } catch {
      toast.error(tError('serviceUnavailable'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessCard
        onDismiss={() => {
          setSuccess(false);
          setToken('');
          turnstileRef.current?.reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Honeypot */}
      <input
        type="text"
        name={honeypotName}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {children}
      <ConsentCheckbox
        checked={consentValue}
        onChange={(e) => onConsentChange(e.currentTarget.checked)}
        error={consentError}
      />
      <TurnstileWidget
        ref={turnstileRef}
        siteKey={siteKey}
        onToken={handleToken}
        locale={locale}
      />
      <button
        type="submit"
        disabled={submitting || !consentValue}
        className="mt-2 inline-flex items-center justify-center gap-2 border border-[#0B0D10] bg-[#0B0D10] px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#F4F1EA] transition hover:bg-[#D4A23A] hover:text-[#0B0D10] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t('submitting') : t(submitLabelKey)}
      </button>
    </form>
  );
}
