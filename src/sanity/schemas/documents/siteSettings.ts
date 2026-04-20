import { defineArrayMember, defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'trust', title: 'Trust signals' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string', initialValue: 'Amuun', group: 'brand', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'localeString', group: 'brand' }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'X', value: 'x' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', type: 'url', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact info',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        defineField({ name: 'address', title: 'Address', type: 'localeText' }),
        defineField({ name: 'mapUrl', title: 'Map URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'certifications',
      title: 'Certifications',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'certification',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
    defineField({
      name: 'pressFeatures',
      title: 'Press features',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pressFeature',
          fields: [
            defineField({ name: 'publication', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'quote', type: 'localeText' }),
          ],
          preview: { select: { title: 'publication', media: 'logo' } },
        }),
      ],
    }),
    defineField({
      name: 'partnerLogos',
      title: 'Partner logos',
      type: 'array',
      group: 'trust',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'partnerLogo',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'url' }),
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        }),
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
});
