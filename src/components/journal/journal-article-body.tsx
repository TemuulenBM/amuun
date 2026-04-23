import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface JournalArticleBodyProps {
  blocks: PortableTextBlock[];
}

export function JournalArticleBody({ blocks }: JournalArticleBodyProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[12vh]">
      <div className="mx-auto max-w-2xl">
        <PortableTextRenderer value={blocks} />
      </div>
    </section>
  );
}
