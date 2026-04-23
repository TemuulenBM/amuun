import Image from 'next/image';
import { LocaleLink } from '@/components/shared/locale-link';

interface JournalCardProps {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  readArticleLabel: string;
}

export function JournalCard({
  slug,
  imageUrl,
  imageAlt,
  category,
  publishedAt,
  title,
  excerpt,
  readArticleLabel,
}: JournalCardProps) {
  const formattedDate = new Date(publishedAt)
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();

  return (
    <LocaleLink href={`/journal/${slug}`} className="group flex flex-col gap-5">
      <div className="image-card aspect-[4/5] overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={900}
          height={1125}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
        {category} · {formattedDate}
      </span>
      <h2 className="font-serif text-2xl font-semibold text-[#F7F7F5]">{title}</h2>
      <p className="line-clamp-3 text-sm text-[#A7ACB4]">{excerpt}</p>
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#D4A23A]">
        {readArticleLabel} →
      </span>
    </LocaleLink>
  );
}
