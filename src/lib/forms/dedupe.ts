import { sanityClient } from '@/sanity/client';
import { recentSubmissionsByEmailQuery } from '@/sanity/lib/queries';

const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

export async function hasRecentConfirmation(email: string): Promise<boolean> {
  try {
    const tenMinAgo = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString();
    const count = await sanityClient.fetch<number>(
      recentSubmissionsByEmailQuery,
      { email, tenMinAgo },
    );
    return typeof count === 'number' && count > 0;
  } catch (error: unknown) {
    console.warn('[forms/dedupe] lookup failed, defaulting to allow', {
      message: error instanceof Error ? error.message : 'unknown',
    });
    return false;
  }
}
