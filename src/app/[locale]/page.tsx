import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/hero-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { ContactSection } from '@/components/sections/contact-section';
import { GlobalSnap } from '@/components/sections/global-snap';
import { Footer } from '@/components/layout/footer';

const EXPERIENCES = [
  { id: 'gobi', slug: 'gobi-crossing', zIndex: 20, imageSrc: '/images/gobi-crossing.jpg', imageAlt: '4x4 crossing the Gobi desert', imagePosition: 'right' as const },
  { id: 'taiga', slug: 'reindeer-camp', zIndex: 30, imageSrc: '/images/taiga-reindeer.jpg', imageAlt: 'Tsaatan reindeer herder in misty forest', imagePosition: 'left' as const },
  { id: 'dunes', slug: 'singing-dunes', zIndex: 40, imageSrc: '/images/dunes-climb.jpg', imageAlt: 'Golden sand dunes with climber', imagePosition: 'right' as const },
  { id: 'canyon', slug: 'khermen-canyon', zIndex: 50, imageSrc: '/images/canyon-descent.jpg', imageAlt: 'Red rock canyon badlands', imagePosition: 'left' as const },
  { id: 'altai', slug: 'altai-five-peaks', zIndex: 60, imageSrc: '/images/altai-peaks.jpg', imageAlt: 'Snow-capped Altai peaks', imagePosition: 'right' as const },
  { id: 'volcano', slug: 'white-lake', zIndex: 70, imageSrc: '/images/volcano-lake.jpg', imageAlt: 'Crater lake in extinct volcano', imagePosition: 'left' as const },
  { id: 'karakorum', slug: 'ancient-capital', zIndex: 80, imageSrc: '/images/karakorum.jpg', imageAlt: 'Erdene Zuu monastery with stone turtle', imagePosition: 'right' as const },
] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('experiences');

  return (
    <main className="relative bg-[#0B0D10]">
      <GlobalSnap />
      <HeroSection />

      {EXPERIENCES.map((exp) => (
        <ExperienceSection
          key={exp.id}
          id={exp.id}
          zIndex={exp.zIndex}
          eyebrow={t(`${exp.id}.eyebrow`)}
          headline={t(`${exp.id}.headline`)}
          body={t(`${exp.id}.body`)}
          cta={t(`${exp.id}.cta`)}
          href={`/tours/${exp.slug}`}
          imageSrc={exp.imageSrc}
          imageAlt={exp.imageAlt}
          imagePosition={exp.imagePosition}
        />
      ))}

      <ContactSection />
      <Footer />
    </main>
  );
}
