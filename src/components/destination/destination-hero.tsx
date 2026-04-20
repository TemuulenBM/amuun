'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';

interface DestinationHeroProps {
  heroImageUrl: string;
  heroImageAlt: string;
  title: string;
  subtitle: string;
  regionLabel: string;
}

export function DestinationHero({
  heroImageUrl,
  heroImageAlt,
  title,
  subtitle,
  regionLabel,
}: DestinationHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrowEl = eyebrowRef.current;
    const headline = headlineRef.current;
    const subtitleEl = subtitleRef.current;
    if (!section || !eyebrowEl || !headline || !subtitleEl) return;

    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.set([eyebrowEl, headline, subtitleEl], { y: 30, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(eyebrowEl, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .to(headline, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .to(subtitleEl, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

      // Scroll pin
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=80%',
        pin: true,
        pinSpacing: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Italic first word + bold remainder (matches destinations-hero.tsx pattern)
  const spaceIndex = title.indexOf(' ');
  const firstWord = spaceIndex > 0 ? title.slice(0, spaceIndex) : title;
  const restWords = spaceIndex > 0 ? title.slice(spaceIndex) : '';

  return (
    <section ref={sectionRef} className="relative h-[90vh] overflow-hidden bg-[#0B0D10]">
      <Image
        src={heroImageUrl}
        alt={heroImageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-[#0B0D10]/60 to-transparent" />
      <div className="relative z-10 flex h-full items-end px-[7vw] pb-[12vh]">
        <div className="mx-auto w-full max-w-6xl">
          <span ref={eyebrowRef} className="eyebrow block text-[#D4A23A]">
            {regionLabel}
          </span>
          <h1
            ref={headlineRef}
            aria-label={title}
            className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]"
          >
            <em className="font-normal not-italic italic">{firstWord}</em>
            {restWords ? <strong className="font-semibold">{restWords}</strong> : null}
          </h1>
          <p
            ref={subtitleRef}
            className="mt-6 max-w-2xl text-sm uppercase tracking-[0.2em] text-[#C8C7C2]"
          >
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
