import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { Testimonial } from '@/types/sanity';

interface AboutTestimonialsProps {
  eyebrow: string;
  heading: string;
  testimonials: Testimonial[];
  locale: Locale;
}

export function AboutTestimonials({ eyebrow, heading, testimonials, locale }: AboutTestimonialsProps) {
  const featured = testimonials.filter((t) => t.featured);
  const [hero, ...rest] = featured;
  const gridItems = rest.slice(0, 3);

  if (!hero) return null;

  const heroQuote = resolveLocaleField(hero.quote, locale);

  return (
    <section className="bg-[#0D0F14] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-serif text-3xl font-semibold text-[#F7F7F5] md:text-4xl">
          {heading}
        </h2>

        {/* Hero testimonial */}
        <div className="mt-16">
          <div className="font-serif text-7xl leading-none text-[#D4A23A] opacity-30">&ldquo;</div>
          <blockquote className="-mt-4 max-w-4xl font-serif text-2xl italic leading-relaxed text-[#F7F7F5] md:text-4xl">
            {heroQuote}
          </blockquote>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
            {hero.name}
            {hero.nationality ? ` · ${hero.nationality.toUpperCase()}` : ''}
          </p>
        </div>

        {/* 3-col grid */}
        {gridItems.length > 0 ? (
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {gridItems.map((t) => {
              const quote = resolveLocaleField(t.quote, locale);
              return (
                <div key={t._id} className="border border-[#1E2128] p-8">
                  <div className="font-serif text-4xl leading-none text-[#D4A23A] opacity-40">
                    &ldquo;
                  </div>
                  <blockquote className="-mt-2 font-serif text-lg italic leading-relaxed text-[#E8E7E2]">
                    {quote}
                  </blockquote>
                  <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[#D4A23A]">
                    {t.name}
                    {t.nationality ? ` · ${t.nationality.toUpperCase()}` : ''}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
