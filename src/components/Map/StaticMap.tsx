import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { MapMarker } from './MapMarker';

export interface StaticMapProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * URL of a pre-rendered map image (from your tile/static-map provider).
   */
  src: string;
  /**
   * What the map shows. Describe the location, e.g. "Map of the Marais
   * district, Paris".
   */
  alt: string;
  /** Make the map a link, e.g. to a full interactive map or directions. */
  href?: string;
  /**
   * Shape (width ÷ height).
   * @default 16 / 9
   */
  ratio?: number;
  /**
   * Draw a pin in the center.
   * @default true
   */
  marker?: boolean;
  /** Text under the map, such as the address. */
  caption?: React.ReactNode;
}

const useStyles = makeStyles({
  figure: { margin: 0 },
  frame: { backgroundColor: vars.color.bgMap, display: 'block', overflow: 'hidden', position: 'relative', textDecorationLine: 'none', ':focus-visible': focusRing },
  image: { display: 'block', height: '100%', objectFit: 'cover', width: '100%' },
  pin: { left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -85%)' },
  caption: { color: vars.color.textLight, fontFamily: vars.font.sans, fontSize: '13px', marginTop: '8px' },
});

/**
 * A map as a plain image, optionally linking to the full map. Cheap and
 * accessible: no JavaScript map library is loaded.
 *
 * @example
 * <StaticMap src={mapUrl} alt="Map of the Marais, Paris" href="/map?place=marais" caption="Rue des Rosiers" />
 */
export function StaticMap({ src, alt, href, ratio = 16 / 9, marker = true, caption, className, style, ...rest }: StaticMapProps) {
  const s = useStyles();
  const content = (
    <>
      <img className={s.image} src={src} alt={alt} loading="lazy" />
      {marker && <MapMarker className={s.pin} />}
    </>
  );
  return (
    <figure className={mergeClasses(s.figure, className)} style={style} {...rest}>
      {href ? (
        <a className={s.frame} href={href} style={{ aspectRatio: ratio }}>
          {content}
        </a>
      ) : (
        <div className={s.frame} style={{ aspectRatio: ratio }}>
          {content}
        </div>
      )}
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
