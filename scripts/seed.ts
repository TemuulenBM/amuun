import { writeClient } from './seed/client';
import { buildDestinations } from './seed/data/destinations';
import { buildFaqs } from './seed/data/faqs';
import { buildTeam } from './seed/data/team';
import { buildTestimonials } from './seed/data/testimonials';
import { buildTours } from './seed/data/tours';
import { buildBlogs } from './seed/data/blogs';
import { buildLegalPages } from './seed/data/legals';
import { buildSiteSettings } from './seed/data/settings';

type SanityDoc = { _id: string; _type: string; [key: string]: unknown };

async function createOrReplace(docs: SanityDoc[]): Promise<void> {
  let tx = writeClient.transaction();
  for (const doc of docs) tx = tx.createOrReplace(doc);
  await tx.commit();
}

async function run() {
  const t0 = Date.now();
  console.log('▶ Seeding Amuun Sanity dataset…');

  // Phase 1: leaf documents (no refs)
  console.log('→ uploading destination images + writing destinations');
  const destinations = await buildDestinations();
  await createOrReplace(destinations);
  console.log(`  ${destinations.length} destinations created`);

  console.log('→ writing FAQs');
  const faqs = buildFaqs();
  await createOrReplace(faqs);
  console.log(`  ${faqs.length} FAQs created`);

  console.log('→ uploading team portraits + writing team');
  const team = await buildTeam();
  await createOrReplace(team);
  console.log(`  ${team.length} team members created`);

  console.log('→ uploading tour images + writing tours');
  const tours = await buildTours();
  await createOrReplace(tours);
  console.log(`  ${tours.length} tours created`);

  console.log('→ writing testimonials');
  const testimonials = buildTestimonials();
  await createOrReplace(testimonials);
  console.log(`  ${testimonials.length} testimonials created`);

  console.log('→ uploading blog hero images + writing blog posts');
  const blogs = await buildBlogs();
  await createOrReplace(blogs);
  console.log(`  ${blogs.length} blog posts created`);

  console.log('→ writing legal pages');
  const legals = buildLegalPages();
  await createOrReplace(legals);
  console.log(`  ${legals.length} legal pages created`);

  console.log('→ uploading about images + writing site settings singleton');
  const settings = await buildSiteSettings();
  await createOrReplace([settings]);
  console.log('  site settings written');

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const total = destinations.length + faqs.length + team.length + tours.length + testimonials.length + blogs.length + legals.length + 1;
  console.log(`✅ Done. ${total} documents in ${elapsed}s.`);
}

run().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
