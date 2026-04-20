'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap/register';
import { Stamp } from '@/components/shared/stamp';
import { LocaleLink } from '@/components/shared/locale-link';

interface ExperienceSectionProps {
  id: string;
  zIndex: number;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  bgImageSrc?: string;
}

export function ExperienceSection({
  id,
  zIndex,
  eyebrow,
  headline,
  body,
  cta,
  href,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  bgImageSrc,
}: ExperienceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const image = imageRef.current;
    const stamp = stampRef.current;
    if (!section || !text || !image || !stamp) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });

      const textStartX = imagePosition === 'right' ? '-55vw' : '55vw';
      const imageStartX = imagePosition === 'right' ? '55vw' : '-55vw';

      scrollTl.fromTo(text, { x: textStartX, opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0);
      scrollTl.fromTo(image, { x: imageStartX, opacity: 0, scale: 0.92 }, { x: 0, opacity: 1, scale: 1, ease: 'none' }, 0);
      scrollTl.fromTo(stamp, { scale: 0.2, opacity: 0, rotate: imagePosition === 'right' ? -120 : 120 }, { scale: 1, opacity: 1, rotate: 0, ease: 'none' }, 0.05);

      const textExitX = imagePosition === 'right' ? '-18vw' : '18vw';
      const imageExitX = imagePosition === 'right' ? '18vw' : '-18vw';

      scrollTl.fromTo(text, { x: 0, opacity: 1 }, { x: textExitX, opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(image, { x: 0, opacity: 1 }, { x: imageExitX, opacity: 0.25, ease: 'power2.in' }, 0.7);
      scrollTl.fromTo(stamp, { y: 0, opacity: 1 }, { y: '18vh', opacity: 0.3, ease: 'power2.in' }, 0.7);
    }, section);

    return () => ctx.revert();
  }, [imagePosition]);

  const textContent = (
    <div ref={textRef} className="will-change-transform">
      <span className="eyebrow block mb-6">{eyebrow}</span>
      <h2 className="headline-section max-w-[40vw] font-serif font-semibold text-[#F7F7F5]">
        {headline}
      </h2>
      <p className="body-luxury mt-8 max-w-[34vw]">{body}</p>
      <LocaleLink href={href} className="cta-link mt-8">
        {cta}
        <ArrowRight size={14} />
      </LocaleLink>
    </div>
  );

  const imageContent = (
    <div
      ref={imageRef}
      className={`image-card will-change-transform ${
        imagePosition === 'right'
          ? 'absolute right-[7vw] top-[18vh] h-[64vh] w-[30vw]'
          : 'absolute left-[7vw] top-[18vh] h-[64vh] w-[38vw]'
      }`}
    >
      <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
    </div>
  );

  return (
    <section ref={sectionRef} id={id} className="section-pinned" style={{ zIndex }}>
      {bgImageSrc ? (
        <>
          <img src={bgImageSrc} alt="" className="bg-image" />
          <div className="dark-overlay" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[#0B0D10]" />
      )}

      {imagePosition === 'right' ? (
        <>
          <div className="absolute left-[7vw] top-[26vh]">{textContent}</div>
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          <div className="absolute right-[7vw] top-[26vh] max-w-[38vw]">{textContent}</div>
        </>
      )}

      <div ref={stampRef} className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 will-change-transform">
        <Stamp />
      </div>
    </section>
  );
}
