import { createClient } from 'next-sanity';
import { getEnv } from '@/lib/env';
import { apiVersion, dataset, projectId, useCdn } from './env';

export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn });

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: getEnv().SANITY_API_WRITE_TOKEN,
});
