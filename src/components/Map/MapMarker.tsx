import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';

export type MapMarkerKind = 'default' | 'eat' | 'drink' | 'play' | 'see' | 'shop' | 'sleep' | 'transport';

export interface MapMarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Category; sets the pin color.
   * @default 'default'
   */
  kind?: MapMarkerKind;
  /** Short text inside the pin: a number (1–99) or a single letter. */
  label?: string;
  /**
   * Larger, emphasised pin for the active place.
   * @default false
   */
  selected?: boolean;
}

/** Category → color, matching the legacy POI palette. */
export const markerColors: Record<MapMarkerKind, string> = {
  default: vars.color.poiDefault,
  eat: vars.color.poiEat,
  drink: vars.color.accentBlue,
  play: vars.color.poiPlay,
  see: vars.color.poiSee,
  shop: vars.color.accentPink,
  sleep: vars.color.accentPurple,
  transport: vars.color.accentGray,
};

const useStyles = makeStyles({
  pin: {
    alignItems: 'center',
    backgroundColor: 'var(--dp-marker, #a8a9ae)',
    borderRadius: '50% 50% 50% 0',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box',
    color: vars.color.textOverlay,
    display: 'inline-flex',
    fontFamily: vars.font.sans,
    fontSize: '12px',
    fontWeight: vars.fontWeight.medium,
    height: '32px',
    justifyContent: 'center',
    transform: 'rotate(-45deg)',
    transitionProperty: 'transform',
    transitionDuration: vars.duration.fast,
    width: '32px',
  },
  selected: { transform: 'rotate(-45deg) scale(1.25)' },
  label: { transform: 'rotate(45deg)' },
  dot: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '100%', height: '10px', width: '10px' },
});

/**
 * Teardrop map pin in the category color. Use it for custom overlays or as
 * the visual for `InteractiveMap` markers. Decorative by itself: the place's
 * name must be exposed by the control that wraps it.
 */
export function MapMarker({ kind = 'default', label, selected = false, className, style, ...rest }: MapMarkerProps) {
  const s = useStyles();
  return (
    <span
      aria-hidden="true"
      className={mergeClasses(s.pin, selected && s.selected, className)}
      style={{ '--dp-marker': markerColors[kind], ...style } as React.CSSProperties}
      {...rest}
    >
      {label ? <span className={s.label}>{label}</span> : <span className={s.dot} />}
    </span>
  );
}
