import type { PortableTextBlock } from '@portabletext/react';
import { PortableTextRenderer } from '@/lib/sanity/portable-text';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { LocaleBlockContent, LocaleString } from '@/types/sanity';

interface DestinationStoryProps {
  story?: LocaleBlockContent;
  highlights?: LocaleString[];
  storyHeading: string;
  highlightsHeading: string;
  locale: Locale;
}

export function DestinationStory({
  story,
  highlights = [],
  storyHeading,
  highlightsHeading,
  locale,
}: DestinationStoryProps) {
  const blocks = story ? (story[locale] as PortableTextBlock[] | undefined) : null;

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="eyebrow text-[#D4A23A]">{storyHeading}</h2>
          <div className="mt-6 space-y-6 font-serif text-lg leading-relaxed text-[#E8E7E2]">
            {blocks ? <PortableTextRenderer value={blocks} /> : null}
          </div>
        </div>
        {highlights.length > 0 ? (
          <aside>
            <h3 className="eyebrow text-[#D4A23A]">{highlightsHeading}</h3>
            <ul className="mt-6 space-y-3 text-sm text-[#C8C7C2]">
              {highlights.map((h, idx) => {
                const text = resolveLocaleField(h, locale);
                return (
                  <li key={idx} className="flex gap-3">
                    <span aria-hidden className="text-[#D4A23A]">
                      ·
                    </span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
