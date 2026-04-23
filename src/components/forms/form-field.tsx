'use client';

import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  as?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
  rows?: number;
}

const labelCls =
  'mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#0B0D10]/70';
const inputCls =
  'w-full rounded-none border border-[#0B0D10]/30 bg-[#F4F1EA] px-4 py-3 font-sans text-[15px] text-[#0B0D10] outline-none transition focus:border-[#D4A23A] focus:ring-2 focus:ring-[#D4A23A]/40';
const inputErrorCls =
  'border-red-600 focus:border-red-600 focus:ring-red-600/40';
const errorCls = 'mt-1 text-[12px] text-red-700';
const hintCls = 'mt-1 text-[12px] text-[#0B0D10]/60';

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { label, error, hint, as = 'input', id, name, children, rows, ...rest },
    ref,
  ) {
    const fieldId = id ?? name;
    const errorId = error ? `${fieldId}-error` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    const commonProps = {
      id: fieldId,
      name,
      'aria-invalid': Boolean(error) || undefined,
      'aria-describedby': describedBy,
      className: `${inputCls} ${error ? inputErrorCls : ''}`,
    };

    return (
      <div>
        <label htmlFor={fieldId} className={labelCls}>
          {label}
        </label>
        {as === 'textarea' ? (
          <textarea
            {...(commonProps as unknown as InputHTMLAttributes<HTMLTextAreaElement>)}
            {...(rest as unknown as InputHTMLAttributes<HTMLTextAreaElement>)}
            rows={rows ?? 5}
          />
        ) : as === 'select' ? (
          <select
            {...(commonProps as unknown as InputHTMLAttributes<HTMLSelectElement>)}
            {...(rest as unknown as InputHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input ref={ref} {...commonProps} {...rest} />
        )}
        {hint ? (
          <p id={hintId} className={hintCls}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className={errorCls} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
