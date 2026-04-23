interface LegalHeroProps {
  title: string;
  updatedAt: string;
  locale: string;
}

export function LegalHero({ title, updatedAt, locale }: LegalHeroProps) {
  const formatted = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <section className="bg-[#0B0D10] px-[7vw] pt-[18vh] pb-[10vh]">
      <div className="mx-auto max-w-2xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A23A]">
          Legal
        </span>
        <h1 className="mt-4 font-serif text-5xl font-semibold text-[#F7F7F5] md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A7ACB4]">
          Last updated {formatted}
        </p>
      </div>
    </section>
  );
}
