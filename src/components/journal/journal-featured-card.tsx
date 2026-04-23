import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';

interface JournalFeaturedCardProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  readArticleLabel: string;
}

export function JournalFeaturedCard({
  slug,
  imageUrl,
  imageAlt,
  category,
  publishedAt,
  title,
  excerpt,
  readArticleLabel,
}: JournalFeaturedCardProps) {
  const formattedDate = new Date(publishedAt)
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <LocaleLink
      href={`/journal/${slug}`}
      className="group relative block aspect-[16/7] overflow-hidden"
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 px-10 pb-10 md:px-16 md:pb-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {category} · {formattedDate}
        </span>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl font-semibold text-[#F7F7F5] md:text-5xl">
          {title}
        </h2>
        <p className="mt-4 line-clamp-2 max-w-xl text-[#C8C7C2]">{excerpt}</p>
        <span className="mt-6 inline-block font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
          {readArticleLabel} →
        </span>
      </div>
    </LocaleLink>
  );
}
