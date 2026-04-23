'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ConsentCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const ConsentCheckbox = forwardRef<HTMLInputElement, ConsentCheckboxProps>(
  function ConsentCheckbox({ error, id = 'consentAccepted', ...rest }, ref) {
    const t = useTranslations('forms.common');

    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          aria-required="true"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-4 w-4 cursor-pointer accent-[#D4A23A]"
          {...rest}
        />
        <div className="flex-1">
          <label htmlFor={id} className="text-[13px] leading-relaxed text-[#0B0D10]">
            {t.rich('consent', {
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="underline decoration-[#D4A23A] underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
              terms: (chunks) => (
                <Link
                  href="/terms"
                  className="underline decoration-[#D4A23A] underline-offset-4"
                >
                  {chunks}
                </Link>
              ),
            })}
          </label>
          {error ? (
            <p id={`${id}-error`} className="mt-1 text-[12px] text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  },
);
