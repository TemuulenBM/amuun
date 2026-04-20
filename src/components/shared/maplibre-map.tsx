'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface MaplibrePin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface MaplibreMapProps {
  pins: MaplibrePin[];
  center: [number, number];
  zoom: number;
  height: number;
  styleUrl?: string;
  ariaListLabel: string;
  loadFailedMessage: string;
  interactive?: boolean;
  className?: string;
}

const MaplibreMapClient = dynamic<MaplibreMapProps>(
  () => import('./maplibre-map.client').then((m) => m.MaplibreMapClient),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center bg-[#11141A] text-[#9A9A95]"
        style={{ height: 480 }}
      >
        Loading map…
      </div>
    ),
  },
) as ComponentType<MaplibreMapProps>;

export function MaplibreMap(props: MaplibreMapProps) {
  return <MaplibreMapClient {...props} />;
}
