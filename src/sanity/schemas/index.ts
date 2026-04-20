import type { SchemaTypeDefinition } from 'sanity';

import { localeString } from './objects/localeString';
import { localeText } from './objects/localeText';
import { localeBlockContent } from './objects/localeBlockContent';
import { imageWithAlt } from './objects/imageWithAlt';
import { seo } from './objects/seo';
import { itineraryDay } from './objects/itineraryDay';
import { pricing } from './objects/pricing';

import { tour } from './documents/tour';
import { destination } from './documents/destination';
import { blogPost } from './documents/blogPost';
import { testimonial } from './documents/testimonial';
import { teamMember } from './documents/teamMember';
import { faq } from './documents/faq';
import { submission } from './documents/submission';
import { legalPage } from './documents/legalPage';
import { siteSettings } from './documents/siteSettings';

export const singletonTypes: readonly string[] = ['siteSettings'];

export const documentTypes: SchemaTypeDefinition[] = [
  tour,
  destination,
  blogPost,
  testimonial,
  teamMember,
  faq,
  submission,
  legalPage,
  siteSettings,
];

export const objectTypes: SchemaTypeDefinition[] = [
  localeString,
  localeText,
  localeBlockContent,
  imageWithAlt,
  seo,
  itineraryDay,
  pricing,
];

export const schemaTypes: SchemaTypeDefinition[] = [...objectTypes, ...documentTypes];
