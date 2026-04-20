import { cache } from 'react';
import { sanityClient } from '../client';
import { projectId } from '../env';

interface FetchOptions {
  tags?: string[];
  revalidate?: number | false;
}

async function fetchInternal<T>(
  query: string,
  paramsKey: string,
  tagsKey: string,
  revalidate: number | false,
): Promise<T | null> {
  if (!projectId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set; returning null.');
    }
    return null;
  }
  try {
    return await sanityClient.fetch<T>(query, JSON.parse(paramsKey), {
      next: {
        tags: tagsKey ? JSON.parse(tagsKey) : undefined,
        revalidate,
      },
    });
  } catch (error: unknown) {
    console.error('[sanity] fetch failed', error);
    return null;
  }
}

// Wrap in React.cache so repeated calls (e.g. generateMetadata + page render
// with the same query/params) dedupe at the request scope.
const cachedFetch = cache(fetchInternal);

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: FetchOptions = {},
): Promise<T | null> {
  return cachedFetch<T>(
    query,
    JSON.stringify(params),
    options.tags ? JSON.stringify(options.tags) : '',
    options.revalidate ?? 3600,
  );
}
