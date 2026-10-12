import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { markerColors, type MapMarkerKind } from './MapMarker';

export interface MapPlace {
  /** Unique id. */
  id: string;
  /** `[latitude, longitude]`. */
  position: [number, number];
  /** Accessible name of the marker (and its tooltip). */
  title: string;
  kind?: MapMarkerKind;
  /** Short text inside the pin, e.g. its rank. */
  label?: string;
}

export interface InteractiveMapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Accessible name of the map region. Pair the map with a list of the same
   * places elsewhere on the page: that list is the accessible alternative.
   */
  label: string;
  /** Initial `[latitude, longitude]` of the view. Defaults to fitting all `places`. */
  center?: [number, number];
  /**
   * Initial zoom level.
   * @default 13
   */
  zoom?: number;
  /** Places to mark. */
  places?: MapPlace[];
  /** Id of the highlighted place. */
  selectedId?: string | null;
  /** Called when a marker is activated (click, Enter or Space). */
  onPlaceSelect?: (place: MapPlace) => void;
  /**
   * Raster tile URL template.
   * @default 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
   */
  tileUrl?: string;
  /**
   * Attribution required by your tile provider (HTML string).
   * @default '© OpenStreetMap contributors'
   */
  attribution?: string;
  /**
   * Height of the map. Numbers are px.
   * @default 400
   */
  height?: number | string;
  /** Message shown if the Leaflet package cannot be loaded. */
  fallback?: React.ReactNode;
}

const useStyles = makeStyles({
  root: { backgroundColor: vars.color.bgMap, borderRadius: '4px', overflow: 'hidden', position: 'relative', width: '100%', zIndex: 0 },
  fallback: { alignItems: 'center', color: vars.color.textLight, display: 'flex', fontFamily: vars.font.sans, fontSize: '14px', height: '100%', justifyContent: 'center', padding: '16px', textAlign: 'center' },
});

const pinHtml = (color: string, label: string, selected: boolean) => `
<span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;box-sizing:border-box;
background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg)${selected ? ' scale(1.25)' : ''};box-shadow:0 2px 6px rgba(0,0,0,.3);color:#fff;font:600 12px sans-serif">
<span style="transform:rotate(45deg)">${label ? label.replace(/[<>&]/g, '') : '<i style="display:block;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.9)"></i>'}</span></span>`;

// Resolved lazily so Leaflet (an optional peer, ~40 KB gzipped) is only
// fetched by pages that actually render a map.
type LeafletModule = typeof import('leaflet');

/**
 * Pannable, zoomable map powered by Leaflet, loaded on demand. Markers are
 * keyboard focusable and labelled. Leaflet is an **optional peer
 * dependency**: install `leaflet` and import `leaflet/dist/leaflet.css` once
 * in your app.
 *
 * @example
 * import 'leaflet/dist/leaflet.css';
 * <InteractiveMap label="Sights in Paris" places={sights} onPlaceSelect={open} />
 */
export function InteractiveMap({
  label,
  center,
  zoom = 13,
  places = [],
  selectedId,
  onPlaceSelect,
  tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  height = 400,
  fallback = 'The map could not be loaded.',
  className,
  style,
  ...rest
}: InteractiveMapProps) {
  const s = useStyles();
  const ref = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);
  const onSelectRef = React.useRef(onPlaceSelect);
  React.useEffect(() => {
    onSelectRef.current = onPlaceSelect;
  });

  // Serialise the data that should rebuild the markers.
  const placesKey = JSON.stringify(places);
  const initial = React.useRef({ center, zoom, tileUrl, attribution });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let cancelled = false;
    let map: import('leaflet').Map | undefined;

    import('leaflet')
      .then((leafletModule: LeafletModule & { default?: LeafletModule }) => {
        if (cancelled) return;
        const L = leafletModule.default ?? leafletModule;
        const list = JSON.parse(placesKey) as MapPlace[];
        const start = initial.current;
        map = L.map(el, { zoomControl: true, keyboard: true }).setView(start.center ?? list[0]?.position ?? [0, 0], start.zoom);
        L.tileLayer(start.tileUrl, { attribution: start.attribution, maxZoom: 19 }).addTo(map);

        const markers = list.map((place) => {
          const icon = L.divIcon({
            className: '',
            html: pinHtml(markerColors[place.kind ?? 'default'], place.label ?? '', place.id === selectedId),
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });
          const marker = L.marker(place.position, { icon, title: place.title, alt: place.title, keyboard: true }).addTo(map!);
          marker.on('click', () => onSelectRef.current?.(place));
          return marker;
        });
        if (!start.center && markers.length > 1) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [placesKey, selectedId]);

  return (
    <div className={mergeClasses(s.root, className)} style={{ height, ...style }} {...rest}>
      {failed ? (
        <div className={s.fallback}>{fallback}</div>
      ) : (
        <div ref={ref} role="region" aria-label={label} style={{ height: '100%', width: '100%' }} />
      )}
    </div>
  );
}
