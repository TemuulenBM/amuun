interface StatItem {
  label: string;
  value: string;
}

interface DestinationStatStripProps {
  items: StatItem[];
}

export function DestinationStatStrip({ items }: DestinationStatStripProps) {
  return (
    <section className="relative -mt-16 px-[7vw]">
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1E2128] bg-[#1E2128] md:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="bg-[#0B0D10] p-6">
              <dt className="text-xs uppercase tracking-[0.2em] text-[#9A9A95]">{item.label}</dt>
              <dd className="mt-3 font-serif text-xl text-[#F7F7F5]">
                <em className="italic font-normal">{item.value}</em>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
