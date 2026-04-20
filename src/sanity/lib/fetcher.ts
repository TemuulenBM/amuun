import { sanityClient } from '../client';
import { projectId } from '../env';

interface FetchOptions {
  tags?: string[];
  revalidate?: number | false;
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: FetchOptions = {},
): Promise<T | null> {
  if (!projectId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set; returning null.');
    }
    return null;
  }
  try {
    return await sanityClient.fetch<T>(query, params, {
      next: {
        tags: options.tags,
        revalidate: options.revalidate ?? 3600,
      },
    });
  } catch (error: unknown) {
    console.error('[sanity] fetch failed', error);
    return null;
  }
}
