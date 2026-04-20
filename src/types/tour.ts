import type { PortableTextBlock } from '@portabletext/react';

export type LocaleString = Partial<Record<'en' | 'ko' | 'mn', string>>;
export type LocaleText = Partial<Record<'en' | 'ko' | 'mn', string>>;
export type LocaleBlockContent = Partial<Record<'en' | 'ko' | 'mn', PortableTextBlock[]>>;

export interface SanityImageRef {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface ImageWithAlt {
  _type: 'imageWithAlt';
  asset: { _ref: string; _type: 'reference' };
  alt?: LocaleString;
  caption?: LocaleString;
}

export interface TourPricingData {
  currency: 'USD' | 'EUR' | 'KRW';
  perPerson: boolean;
  standard: number;
  deluxe: number;
  private: number;
  notes?: LocaleText;
}

export interface TourItineraryDay {
  _key: string;
  day: number;
  title: LocaleString;
  description: LocaleText;
  accommodation?: LocaleString;
  meals?: Array<'breakfast' | 'lunch' | 'dinner'>;
  image?: ImageWithAlt;
}

export interface TourDestinationRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  region?: string;
  heroImage?: ImageWithAlt;
}

export interface TourFaqRef {
  _id: string;
  question: LocaleString;
  answer: LocaleBlockContent;
  category?: string;
  order?: number;
}

export interface TourRelatedRef {
  _id: string;
  title: LocaleString;
  slug: { current: string };
  summary?: LocaleText;
  heroImage: ImageWithAlt;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  pricing?: Pick<TourPricingData, 'currency' | 'standard'>;
}

export interface TourSeo {
  metaTitle?: LocaleString;
  metaDescription?: LocaleText;
  ogImage?: ImageWithAlt;
}

export interface TourDetail {
  _id: string;
  _type: 'tour';
  title: LocaleString;
  slug: { current: string };
  summary: LocaleText;
  description?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  duration: number;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'>;
  included?: LocaleString[];
  excluded?: LocaleString[];
  itinerary?: TourItineraryDay[];
  mapRoute?: Array<{ _type: 'geopoint'; lat: number; lng: number; alt?: number }>;
  pricing: TourPricingData;
  destinations?: TourDestinationRef[];
  faqs?: TourFaqRef[];
  relatedTours?: TourRelatedRef[];
  featured?: boolean;
  order?: number;
  publishedAt: string;
  seo?: TourSeo;
}
