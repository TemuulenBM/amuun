'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap/register';

interface JournalHeroProps {
  eyebrow: string;
  heading: string;
  intro: string;
}

export function JournalHero({ eyebrow, heading, intro }: JournalHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrowEl = eyebrowRef.current;
    const headline = headlineRef.current;
    const introEl = introRef.current;
    if (!section || !eyebrowEl || !headline || !introEl) return;

    const ctx = gsap.context(() => {
      gsap.set([eyebrowEl, headline, introEl], { y: 30, opacity: 0 });
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(eyebrowEl, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .to(headline, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .to(introEl, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

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

  const commaIdx = heading.indexOf(',');
  const splitIdx = commaIdx > 0 ? commaIdx + 1 : heading.indexOf(' ');
  const firstPart = splitIdx > 0 ? heading.slice(0, splitIdx) : heading;
  const secondPart = splitIdx > 0 ? heading.slice(splitIdx) : '';

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[80vh] items-end bg-[#0B0D10] px-[7vw] pb-[10vh] pt-[28vh]"
    >
      <div className="mx-auto max-w-6xl">
        <span ref={eyebrowRef} className="eyebrow block text-[#D4A23A]">
          {eyebrow}
        </span>
        <h1
          ref={headlineRef}
          aria-label={heading}
          className="headline-hero mt-6 max-w-4xl font-serif font-semibold text-[#F7F7F5]"
        >
          <em className="font-normal not-italic italic">{firstPart}</em>
          {secondPart ? <strong className="font-semibold">{secondPart}</strong> : null}
        </h1>
        <p ref={introRef} className="body-luxury mt-10 max-w-2xl text-[#C8C7C2]">
          {intro}
        </p>
      </div>
    </section>
  );
}
