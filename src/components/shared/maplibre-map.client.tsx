'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Map,
  Marker,
  NavigationControl,
  AttributionControl,
} from 'react-map-gl/maplibre';
import {
  MAPLIBRE_STYLE_LIGHT,
  BRAND_PIN_COLOR,
  BRAND_PIN_RING_COLOR,
  BRAND_PIN_BORDER_COLOR,
} from '@/styles/maplibre-style';
import type { MaplibreMapProps } from './maplibre-map';

export function MaplibreMapClient({
  pins,
  center,
  zoom,
  height,
  styleUrl = MAPLIBRE_STYLE_LIGHT,
  ariaListLabel,
  interactive = true,
  className,
}: MaplibreMapProps) {
  return (
    <div className={className}>
      <ul className="sr-only" aria-label={ariaListLabel}>
        {pins.map((pin) => (
          <li key={pin.id}>
            {pin.href ? <a href={pin.href}>{pin.label}</a> : pin.label}
          </li>
        ))}
      </ul>
      <Map
        initialViewState={{ longitude: center[1], latitude: center[0], zoom }}
        style={{ width: '100%', height }}
        mapStyle={styleUrl}
        interactive={interactive}
        attributionControl={false}
      >
        <AttributionControl compact />
        {interactive ? (
          <NavigationControl position="top-right" showCompass={false} />
        ) : null}
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            longitude={pin.lng}
            latitude={pin.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              pin.onClick?.();
            }}
          >
            <button
              type="button"
              aria-label={pin.label}
              onClick={pin.onClick}
              className="block h-3.5 w-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0D10]"
              style={{
                background: BRAND_PIN_COLOR,
                border: `2px solid ${BRAND_PIN_BORDER_COLOR}`,
                boxShadow: `0 0 0 3px ${BRAND_PIN_RING_COLOR}`,
              }}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
}
