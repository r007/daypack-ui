import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { focusRing } from '../../theme/focus';

export type AvatarSize = 24 | 40 | 48 | 80 | 104;

export interface AvatarProps {
  /** Image URL. */
  src: string;
  /**
   * Describe the person; leave empty when the name is rendered next to the avatar.
   * With `href`, the alt text becomes the link's accessible name, so it should not be empty.
   * @default ''
   */
  alt?: string;
  /**
   * Diameter in px.
   * @default 80
   */
  size?: AvatarSize;
  /** Wraps the image in a link to this URL. */
  href?: string;
  /** Applied to the outermost element. */
  id?: string;
  className?: string;
  /** Merged over the width/height set by `size`. */
  style?: React.CSSProperties;
}

const useStyles = makeStyles({
  image: {
    borderRadius: '100%',
    display: 'inline-block',
    objectFit: 'cover',
    verticalAlign: 'middle',
  },
  anchor: { ':focus-visible': focusRing },
  anchorImage: { display: 'block', height: '100%', width: '100%' },
});

/** Circular user image, optionally linked. */
export function Avatar({ src, alt = '', size = 80, href, id, className, style }: AvatarProps) {
  const s = useStyles();
  const dims = { width: size, height: size, ...style };

  if (href) {
    return (
      <a id={id} href={href} className={mergeClasses(s.image, s.anchor, className)} style={dims}>
        <img className={mergeClasses(s.image, s.anchorImage)} src={src} alt={alt} />
      </a>
    );
  }
  return <img id={id} className={mergeClasses(s.image, className)} style={dims} src={src} alt={alt} />;
}
