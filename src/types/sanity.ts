import type { PortableTextBlock } from 'sanity';

export type Locale = 'en' | 'ko' | 'mn';

export interface LocaleString {
  en: string;
  ko: string;
  mn: string;
}

export interface LocaleText {
  en: string;
  ko: string;
  mn: string;
}

export interface LocaleBlockContent {
  en: PortableTextBlock[];
  ko: PortableTextBlock[];
  mn: PortableTextBlock[];
}

export interface SanityImageAsset {
  _ref: string;
  _type: 'reference';
}

export interface SanityImage {
  _type: 'image';
  asset: SanityImageAsset;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface ImageWithAlt extends SanityImage {
  alt: LocaleString;
  caption?: LocaleString;
}

export interface Seo {
  title?: LocaleString;
  description?: LocaleText;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

export type Meal = 'breakfast' | 'lunch' | 'dinner';

export interface ItineraryDay {
  _key?: string;
  day: number;
  title: LocaleString;
  description: LocaleText;
  accommodation?: LocaleString;
  meals?: Meal[];
  image?: ImageWithAlt;
}

export type Currency = 'USD' | 'EUR' | 'KRW';

export interface Pricing {
  currency: Currency;
  perPerson: boolean;
  standard: number;
  deluxe: number;
  private: number;
  notes?: LocaleText;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export interface Geopoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
  alt?: number;
}

export interface Reference<T extends string = string> {
  _ref: string;
  _type: 'reference';
  _weak?: boolean;
  _typeName?: T;
}

export type Difficulty = 'easy' | 'moderate' | 'challenging' | 'expert';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface BaseDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

export interface Destination extends BaseDocument {
  _type: 'destination';
  title: LocaleString;
  slug: Slug;
  subtitle?: LocaleString;
  story?: LocaleBlockContent;
  region: 'central' | 'gobi' | 'western' | 'northern' | 'terelj';
  coordinates?: Geopoint;
  bestTime?: LocaleString;
  highlights?: LocaleString[];
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  seo?: Seo;
}

export interface Faq extends BaseDocument {
  _type: 'faq';
  question: LocaleString;
  answer: LocaleText;
  category: 'general' | 'booking' | 'during' | 'visa';
  order?: number;
}

export interface TeamMember extends BaseDocument {
  _type: 'teamMember';
  name: string;
  role: LocaleString;
  bio?: LocaleText;
  photo: SanityImage;
  isFounder?: boolean;
  order?: number;
}

export interface Testimonial extends BaseDocument {
  _type: 'testimonial';
  name: string;
  nationality: string;
  quote: LocaleText;
  avatar?: SanityImage;
  tour?: Reference<'tour'>;
  featured?: boolean;
  submittedAt: string;
}

export interface BlogPost extends BaseDocument {
  _type: 'blogPost';
  title: LocaleString;
  slug: Slug;
  excerpt?: LocaleText;
  content?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  category: 'culture' | 'tips' | 'stories' | 'photography';
  author?: Reference<'teamMember'>;
  relatedTours?: Reference<'tour'>[];
  publishedAt: string;
  seo?: Seo;
}

export interface Tour extends BaseDocument {
  _type: 'tour';
  title: LocaleString;
  slug: Slug;
  summary: LocaleText;
  description?: LocaleBlockContent;
  heroImage: ImageWithAlt;
  gallery?: ImageWithAlt[];
  duration: number;
  difficulty: Difficulty;
  seasons: Season[];
  included?: LocaleString[];
  excluded?: LocaleString[];
  itinerary?: ItineraryDay[];
  mapRoute?: Geopoint[];
  pricing: Pricing;
  destinations?: Reference<'destination'>[];
  faqs?: Reference<'faq'>[];
  relatedTours?: Reference<'tour'>[];
  featured?: boolean;
  order?: number;
  publishedAt: string;
  seo?: Seo;
}

export type FormType = 'contact' | 'customTrip' | 'booking';
export type SubmissionStatus = 'new' | 'responded' | 'archived';
export type SubmissionLocale = 'en' | 'ko' | 'mn';

export interface SubmissionPayload {
  subject?: 'general' | 'press' | 'partnership' | 'other';
  partySize?: number;
  travelStartDate?: string;
  travelEndDate?: string;
  interests?: Array<'culture' | 'nature' | 'adventure' | 'food'>;
  budgetRange?: 'under-3k' | '3k-5k' | '5k-10k' | '10k-plus';
  tourSlug?: string;
  tourTitle?: string;
  preferredStartDate?: string;
  adults?: number;
  children?: number;
  tier?: 'standard' | 'deluxe' | 'private';
  specialRequests?: string;
}

export interface SubmissionMeta {
  ip?: string;
  userAgent?: string;
  referrer?: string;
  submittedAt?: string;
}

export interface Submission extends BaseDocument {
  _type: 'submission';
  formType: FormType;
  status: SubmissionStatus;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  locale?: SubmissionLocale;
  consentAccepted?: boolean;
  consentedAt?: string;
  payload?: SubmissionPayload;
  meta?: SubmissionMeta;
}

export interface LegalPage extends BaseDocument {
  _type: 'legalPage';
  slug: 'privacy' | 'terms';
  title: LocaleString;
  content: LocaleBlockContent;
  updatedAt: string;
  seo?: Seo;
}

export interface SocialLink {
  _key?: string;
  platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin' | 'x';
  url: string;
}

export interface Certification {
  _key?: string;
  name: string;
  logo: SanityImage;
  url?: string;
}

export interface PressFeature {
  _key?: string;
  publication: string;
  logo?: SanityImage;
  url?: string;
  quote?: LocaleText;
}

export interface PartnerLogo {
  _key?: string;
  name: string;
  logo: SanityImage;
  url?: string;
}

export interface SiteSettings extends BaseDocument {
  _type: 'siteSettings';
  siteName: string;
  tagline?: LocaleString;
  socialLinks?: SocialLink[];
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: LocaleText;
    mapUrl?: string;
  };
  certifications?: Certification[];
  pressFeatures?: PressFeature[];
  partnerLogos?: PartnerLogo[];
  aboutHeroImage?: ImageWithAlt;
  aboutStory?: LocaleBlockContent;
  aboutImage?: ImageWithAlt;
  defaultSeo?: Seo;
}

export type AnyDocument =
  | Tour
  | Destination
  | BlogPost
  | Testimonial
  | TeamMember
  | Faq
  | Submission
  | LegalPage
  | SiteSettings;
