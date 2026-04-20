import { MaplibreMap, type MaplibrePin } from '@/components/shared/maplibre-map';

interface DestinationLocationMapProps {
  lat: number;
  lng: number;
  label: string;
  heading: string;
  ariaListLabel: string;
  loadFailedMessage: string;
}

export function DestinationLocationMap({
  lat,
  lng,
  label,
  heading,
  ariaListLabel,
  loadFailedMessage,
}: DestinationLocationMapProps) {
  const pins: MaplibrePin[] = [{ id: 'self', lat, lng, label }];

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <h2 className="eyebrow text-[#D4A23A]">{heading}</h2>
        <div className="mt-10">
          <MaplibreMap
            pins={pins}
            center={[lat, lng]}
            zoom={6}
            height={400}
            ariaListLabel={ariaListLabel}
            loadFailedMessage={loadFailedMessage}
            className="overflow-hidden rounded-2xl border border-[#1E2128]"
          />
        </div>
      </div>
    </section>
  );
}
