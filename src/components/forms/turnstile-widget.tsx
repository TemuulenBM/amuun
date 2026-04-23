'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { useRef, useImperativeHandle, forwardRef } from 'react';

interface TurnstileWidgetProps {
  siteKey: string | undefined;
  onToken: (token: string) => void;
  locale?: 'en' | 'ko' | 'mn';
}

export interface TurnstileHandle {
  reset: () => void;
}

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, onToken, locale = 'en' }, ref) {
    const widgetRef = useRef<TurnstileInstance | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => widgetRef.current?.reset(),
    }));

    if (!siteKey) {
      if (process.env.NODE_ENV !== 'production') {
        // Dev fallback: emit a non-empty token so the form can submit; server
        // verifier also skips in dev if the secret key is missing.
        if (typeof window !== 'undefined') {
          queueMicrotask(() => onToken('DEV_TURNSTILE_BYPASS'));
        }
      }
      return null;
    }

    return (
      <div aria-hidden="true">
        <Turnstile
          ref={widgetRef}
          siteKey={siteKey}
          onSuccess={onToken}
          options={{ size: 'invisible', language: locale }}
        />
      </div>
    );
  },
);
