import type { StructureResolver } from 'sanity/structure';

import { singletonTypes } from './schemas';

export const structure: StructureResolver = (S) => {
  const listableTypes = ['tour', 'destination', 'blogPost', 'testimonial', 'teamMember', 'faq', 'legalPage', 'submission'];

  return S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...listableTypes.map((typeName) =>
        S.listItem()
          .title(labelFor(typeName))
          .schemaType(typeName)
          .child(S.documentTypeList(typeName).title(labelFor(typeName))),
      ),
    ]);
};

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
    case 'submission':
      return 'Submissions';
    default:
      return typeName;
  }
}

export { singletonTypes };
