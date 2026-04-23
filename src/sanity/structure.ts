import type { StructureResolver } from 'sanity/structure';

import { singletonTypes } from './schemas';

const listableContentTypes = [
  'tour',
  'destination',
  'blogPost',
  'testimonial',
  'teamMember',
  'faq',
  'legalPage',
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...listableContentTypes.map((typeName) =>
        S.listItem()
          .title(labelFor(typeName))
          .schemaType(typeName)
          .child(S.documentTypeList(typeName).title(labelFor(typeName))),
      ),
      S.divider(),
      S.listItem()
        .title('Submissions')
        .child(
          S.list()
            .title('Submissions')
            .items([
              S.listItem()
                .title('All')
                .child(S.documentTypeList('submission').title('All submissions')),
              S.listItem()
                .title('Contact')
                .child(
                  S.documentTypeList('submission')
                    .title('Contact')
                    .filter('_type == "submission" && formType == "contact"'),
                ),
              S.listItem()
                .title('Custom Trip')
                .child(
                  S.documentTypeList('submission')
                    .title('Custom Trip')
                    .filter('_type == "submission" && formType == "customTrip"'),
                ),
              S.listItem()
                .title('Booking')
                .child(
                  S.documentTypeList('submission')
                    .title('Booking')
                    .filter('_type == "submission" && formType == "booking"'),
                ),
              S.divider(),
              S.listItem()
                .title('Archived')
                .child(
                  S.documentTypeList('submission')
                    .title('Archived')
                    .filter('_type == "submission" && status == "archived"'),
                ),
            ]),
        ),
    ]);

function labelFor(typeName: string): string {
  switch (typeName) {
    case 'tour':
      return 'Tours';
    case 'destination':
      return 'Destinations';
    case 'blogPost':
      return 'Journal articles';
    case 'testimonial':
      return 'Testimonials';
    case 'teamMember':
      return 'Team members';
    case 'faq':
      return 'FAQs';
    case 'legalPage':
      return 'Legal pages';
    default:
      return typeName;
  }
}

export { singletonTypes };
