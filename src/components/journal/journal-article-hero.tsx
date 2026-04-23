'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap/register';

interface JournalArticleHeroProps {
  imageUrl: string;
  imageAlt: string;
  category: string;
  title: string;
  byline: string;
}

export function JournalArticleHero({
  imageUrl,
  imageAlt,
  category,
  title,
  byline,
}: JournalArticleHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(bg, { scale: 1.06, opacity: 0 });
      gsap.set(content, { y: 40, opacity: 0 });
      const tl = gsap.timeline();
      tl.to(bg, { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }).to(
        content,
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6',
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-end bg-[#0B0D10]">
      <div ref={bgRef} className="absolute inset-0">
        <Image src={imageUrl} alt={imageAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      </div>
      <div ref={contentRef} className="relative z-10 w-full px-[7vw] pb-[10vh]">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {category}
        </span>
        <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold text-[#F7F7F5] md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-[#C8C7C2]">
          {byline}
        </p>
      </div>
    </section>
  );
}
