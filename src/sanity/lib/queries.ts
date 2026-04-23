export const siteSettingsQuery = /* groq */ `
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  ...,
  "socialLinks": socialLinks[]{_key, platform, url},
  "certifications": certifications[]{_key, name, logo, url},
  "pressFeatures": pressFeatures[]{_key, publication, logo, url, quote},
  "partnerLogos": partnerLogos[]{_key, name, logo, url},
  "aboutHeroImage": aboutHeroImage { ..., alt },
  "aboutStory": aboutStory,
  "aboutImage": aboutImage { ..., alt }
}
`;

export const allToursQuery = /* groq */ `
*[_type == "tour" && defined(slug.current)] | order(featured desc, order asc) {
  _id, _type, title, slug, summary, duration, difficulty, seasons, heroImage, pricing, featured, publishedAt,
  "destinations": destinations[]->{_id, title, slug, region}
}
`;

export const featuredToursQuery = /* groq */ `
*[_type == "tour" && featured == true && defined(slug.current)] | order(order asc) [0...3] {
  _id, _type, title, slug, summary, duration, difficulty, heroImage, pricing
}
`;

export const tourBySlugQuery = /* groq */ `
*[_type == "tour" && slug.current == $slug][0]{
  ...,
  "destinations": destinations[]->{_id, title, slug, region, heroImage},
  "faqs": faqs[]->{_id, question, answer, category, order} | order(order asc),
  "relatedTours": relatedTours[]->{_id, title, slug, summary, heroImage, duration, difficulty, pricing}
}
`;

export const allDestinationsQuery = /* groq */ `
*[_type == "destination" && defined(slug.current)] | order(region asc) {
  _id, _type, title, slug, subtitle, region, heroImage, bestTime, highlights, coordinates
}
`;

export const destinationBySlugQuery = /* groq */ `
*[_type == "destination" && slug.current == $slug][0]{
  ...,
  "tours": *[_type == "tour" && references(^._id)]{
    _id, title, slug, summary, duration, difficulty, heroImage, pricing
  }
}
`;

export const allBlogPostsQuery = /* groq */ `
*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id, _type, title, slug, excerpt, category, heroImage, publishedAt,
  "author": author->{_id, name, role, photo}
}
`;

export const blogPostBySlugQuery = /* groq */ `
*[_type == "blogPost" && slug.current == $slug][0]{
  ...,
  "author": author->{_id, name, role, bio, photo},
  "relatedTours": relatedTours[]->{_id, title, slug, summary, heroImage, duration, difficulty}
}
`;

export const testimonialsQuery = /* groq */ `
*[_type == "testimonial"] | order(featured desc, submittedAt desc) {
  _id, _type, name, nationality, quote, avatar, featured, submittedAt,
  "tour": tour->{_id, title, slug}
}
`;

export const teamMembersQuery = /* groq */ `
*[_type == "teamMember"] | order(isFounder desc, order asc) {
  _id, _type, name, role, bio, photo, isFounder
}
`;

export const faqsQuery = /* groq */ `
*[_type == "faq"] | order(category asc, order asc) {
  _id, _type, question, answer, category, order
}
`;

export const legalPageBySlugQuery = /* groq */ `
*[_type == "legalPage" && slug == $slug][0]
`;

export const tourSlugsQuery = /* groq */ `
*[_type == "tour" && defined(slug.current)][].slug.current
`;

export const destinationSlugsQuery = /* groq */ `
*[_type == "destination" && defined(slug.current)][].slug.current
`;

export const blogPostSlugsQuery = /* groq */ `
*[_type == "blogPost" && defined(slug.current)][].slug.current
`;

export const recentSubmissionsByEmailQuery = /* groq */ `
  count(*[_type == "submission" && email == $email && _createdAt > $tenMinAgo])
`;
