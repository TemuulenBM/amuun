'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';

interface TourHeroProps {
  heroImageUrl: string;
  heroImageAlt: string;
  title: string;
  summary: string;
  eyebrow: string;
  statStrip: React.ReactNode;
}

export function TourHero({
  heroImageUrl,
  heroImageAlt,
  title,
  summary,
  eyebrow,
  statStrip,
}: TourHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('tour');

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const bg = bgRef.current;
    const stamp = stampRef.current;
    if (!section || !headline || !bg || !stamp) return;

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 1.06, opacity: 0 });
      gsap.set(headline, { y: 40, opacity: 0 });
      gsap.set(stamp, { scale: 0.6, opacity: 0, rotate: -90 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(bg, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .to(headline, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
        .to(stamp, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, '-=0.5');
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[100svh] w-full overflow-hidden">
      <img
        ref={bgRef}
        src={heroImageUrl}
        alt={heroImageAlt}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/70 via-[#0B0D10]/30 to-[#0B0D10]/80" />

      <div className="relative z-10 flex h-full flex-col items-start justify-end px-[7vw] pb-[14vh]">
        <span className="eyebrow block">{eyebrow}</span>
        <h1
          ref={headlineRef}
          className="headline-section mt-6 max-w-[70vw] font-serif font-semibold text-[#F7F7F5]"
        >
          {title}
        </h1>
        <p className="body-luxury mt-6 max-w-xl">{summary}</p>
        <div className="mt-10">{statStrip}</div>
      </div>

      <div ref={stampRef} className="absolute bottom-[4vh] right-[4vw] will-change-transform">
        <Stamp />
      </div>

      <div className="absolute bottom-[4vh] left-[7vw] flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4]">
        <span>{t('scroll')}</span>
        <span className="h-px w-10 bg-[#D4A23A]" aria-hidden />
      </div>
    </section>
  );
}
