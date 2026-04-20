import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-[1.8] text-[#A7ACB4] font-light last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-6 font-serif text-3xl font-semibold text-[#F7F7F5]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 font-serif text-2xl font-semibold text-[#F7F7F5]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-[#D4A23A] pl-6 font-serif text-xl italic text-[#F7F7F5]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-[#F7F7F5]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href ?? '#'}
        className="text-[#D4A23A] underline-offset-4 hover:underline"
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 text-[#A7ACB4]">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2 pl-6 text-[#A7ACB4]">{children}</ol>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(1200).quality(85).url();
      return (
        <figure className="my-8">
          <div className="image-card">
            <Image
              src={url}
              alt={value?.alt?.en ?? ''}
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
          {value?.caption?.en ? (
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
              {value.caption.en}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: PortableTextBlock[];
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
