'use client';

import { MaplibreMap, type MaplibrePin } from '@/components/shared/maplibre-map';

interface DestinationsOverviewMapProps {
  pins: MaplibrePin[];
  ariaListLabel: string;
  loadFailedMessage: string;
}

export function DestinationsOverviewMap({
  pins,
  ariaListLabel,
  loadFailedMessage,
}: DestinationsOverviewMapProps) {
  const enrichedPins: MaplibrePin[] = pins.map((pin) => ({
    ...pin,
    onClick: () => {
      const target = document.getElementById(`region-${pin.id}`);
      if (!target) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    },
  }));

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[6vh]">
      <div className="mx-auto max-w-6xl">
        <MaplibreMap
          pins={enrichedPins}
          center={[46.8, 103.8]}
          zoom={5}
          height={600}
          ariaListLabel={ariaListLabel}
          loadFailedMessage={loadFailedMessage}
          className="overflow-hidden rounded-2xl border border-[#1E2128]"
        />
      </div>
    </section>
  );
}
