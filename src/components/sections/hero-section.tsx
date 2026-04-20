'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const t = useTranslations('hero');
  const brand = useTranslations('brand');

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const stamp = stampRef.current;
    const bg = bgRef.current;
    if (!section || !headline || !stamp || !bg) return;

    const ctx = gsap.context(() => {
      gsap.set(headline.querySelectorAll('.word'), { y: 40, opacity: 0, rotateX: 18 });
      gsap.set(stamp, { scale: 0.6, opacity: 0, rotate: -90 });
      gsap.set(bg, { scale: 1.06, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(bg, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
        .to(headline.querySelectorAll('.word'), {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.08, ease: 'power3.out',
        }, '-=0.8')
        .to(stamp, {
          scale: 1, opacity: 1, rotate: 0,
          duration: 1, ease: 'back.out(1.6)',
        }, '-=0.5');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.to(headline.querySelectorAll('.word'), { y: 0, opacity: 1, duration: 0.3 });
            gsap.to(stamp, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(bg, { scale: 1, y: 0, duration: 0.3 });
          },
        },
      });

      scrollTl.fromTo(
        headline.querySelectorAll('.word'),
        { y: 0, opacity: 1 },
        { y: '-22vh', opacity: 0, ease: 'power2.in' },
        0.7,
      );
      scrollTl.fromTo(stamp, { scale: 1, opacity: 1 }, { scale: 1.35, opacity: 0.35, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(bg, { scale: 1, y: 0 }, { scale: 1.08, y: '-6vh', ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned z-10 flex items-center justify-center">
      <img
        ref={bgRef}
        src="/images/hero-desert.jpg"
        alt={brand('tagline')}
        className="bg-image will-change-transform"
      />
      <div className="dark-overlay" />

      <div className="relative z-10 px-4 text-center">
        <div ref={stampRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform">
          <Stamp />
        </div>

        <div ref={headlineRef} className="relative perspective-1000">
          <h1 className="headline-hero font-serif font-semibold text-[#F7F7F5]">
            <span className="word inline-block">{t('line1')}</span>
          </h1>
          <h1 className="headline-hero mt-2 font-serif font-semibold text-[#F7F7F5]">
            <span className="word inline-block">{t('line2')}</span>
          </h1>
        </div>

        <p className="mt-8 max-w-md mx-auto text-lg font-light text-[#A7ACB4] md:text-xl">
          {brand('tagline')}
        </p>
      </div>

      <div className="absolute bottom-[3vh] left-[3vw] right-[3vw] flex items-end justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4] md:text-xs">
          {t('left')}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#A7ACB4] md:text-xs">
          {t('right')}
        </span>
      </div>
    </section>
  );
}
