import { config as loadEnv } from 'dotenv';
import { createClient } from '@sanity/client';

loadEnv({ path: '.env.local' });
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-04-17';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required in .env.local');
if (!token) throw new Error('SANITY_API_WRITE_TOKEN is required in .env.local');

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
