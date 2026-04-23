import type { PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface AboutStoryProps {
  eyebrow: string;
  heading: string;
  storyBlocks: PortableTextBlock[] | null;
  imageUrl: string | null;
  imageAlt: string;
}

export function AboutStory({ eyebrow, heading, storyBlocks, imageUrl, imageAlt }: AboutStoryProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
            {heading}
          </h2>
          {storyBlocks ? (
            <div className="mt-8 space-y-6 font-serif text-lg leading-relaxed text-[#C8C7C2]">
              <PortableTextRenderer value={storyBlocks} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col justify-center">
          <div className="w-12 h-0.5 bg-[#D4A23A] mb-6" />
          <div className="relative aspect-[3/4] overflow-hidden bg-[#1E2128]">
            {imageUrl ? (
              <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
