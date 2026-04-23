import { getEnv } from '@/lib/env';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const { TURNSTILE_SECRET_KEY } = getEnv();
  if (!TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[forms/turnstile] TURNSTILE_SECRET_KEY not set; skipping verification in development');
      return true;
    }
    return false;
  }

  const body = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body });
    if (!res.ok) return false;
    const data = (await res.json()) as TurnstileResponse;
    return data.success === true;
  } catch (error: unknown) {
    console.error('[forms/turnstile] verify failed', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}
