import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';

interface LegalContentProps {
  blocks: PortableTextBlock[];
}

export function LegalContent({ blocks }: LegalContentProps) {
  return (
    <section className="bg-[#0B0D10] px-[7vw] py-[10vh]">
      <div className="mx-auto max-w-2xl">
        <PortableTextRenderer value={blocks} />
      </div>
    </section>
  );
}
