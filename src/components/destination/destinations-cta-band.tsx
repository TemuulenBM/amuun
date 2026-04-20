import { LocaleLink } from '@/components/shared/locale-link';

interface DestinationsCtaBandProps {
  heading: string;
  body: string;
  buttonLabel: string;
  href?: string;
}

export function DestinationsCtaBand({
  heading,
  body,
  buttonLabel,
  href = '/custom-trip',
}: DestinationsCtaBandProps) {
  // Italic+bold split: first 2 words italic, rest bold
  const words = heading.split(' ');
  const firstPart = words.slice(0, 2).join(' ');
  const restPart = words.slice(2).join(' ');

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[18vh]">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-8">
        <h2 className="font-serif text-4xl font-semibold text-[#F7F7F5] md:text-5xl">
          <em className="italic font-normal">{firstPart}</em>
          {restPart ? <strong className="font-semibold"> {restPart}</strong> : null}
        </h2>
        <p className="body-luxury max-w-2xl text-[#C8C7C2]">{body}</p>
        <LocaleLink
          href={href}
          className="mt-4 inline-flex items-center gap-3 border border-[#D4A23A] px-8 py-4 text-sm uppercase tracking-[0.25em] text-[#D4A23A] transition hover:bg-[#D4A23A] hover:text-[#0B0D10]"
        >
          {buttonLabel}
        </LocaleLink>
      </div>
    </section>
  );
}
