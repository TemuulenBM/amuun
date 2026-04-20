import fs from 'node:fs';
import path from 'node:path';
import { writeClient } from './client';

export interface UploadedAsset {
  _type: 'image';
  asset: { _type: 'reference'; _ref: string };
}

const cache = new Map<string, UploadedAsset>();

export async function uploadLocalImage(filename: string): Promise<UploadedAsset> {
  if (cache.has(filename)) return cache.get(filename)!;
  const fullPath = path.join(process.cwd(), 'public', 'images', filename);
  const buffer = fs.readFileSync(fullPath);
  const asset = await writeClient.assets.upload('image', buffer, { filename });
  const result: UploadedAsset = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
  cache.set(filename, result);
  return result;
}

export async function uploadRemoteImage(url: string, filename: string): Promise<UploadedAsset> {
  if (cache.has(url)) return cache.get(url)!;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const asset = await writeClient.assets.upload('image', buffer, { filename });
  const result: UploadedAsset = {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
  cache.set(url, result);
  return result;
}

export function imageWithAlt(asset: UploadedAsset, alt: { en: string; ko: string; mn: string }) {
  return {
    ...asset,
    alt: { _type: 'localeString', ...alt },
  };
}
