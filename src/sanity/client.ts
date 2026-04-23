import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from './env';

export const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn });

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
