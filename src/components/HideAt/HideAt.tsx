import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { media } from '../../theme/media';

export interface HideAtProps extends React.HTMLAttributes<HTMLElement> {
  /** Hide below this viewport width in px (i.e. show only from it upward). */
  below?: number;
  /** Hide from this viewport width in px upward (i.e. show only below it). */
  from?: number;
  /**
   * Element to render.
   * @default 'div'
   */
  as?: 'div' | 'span' | 'section' | 'li';
}

const BELOW = [480, 600, 768, 1024, 1200] as const;
const FROM = BELOW;

// Static classes for the standard breakpoints keep CSS atomic and cacheable.
const useStyles = makeStyles({
  below480: { [media({ below: 480 })]: { display: 'none' } },
  below600: { [media({ below: 600 })]: { display: 'none' } },
  below768: { [media({ below: 768 })]: { display: 'none' } },
  below1024: { [media({ below: 1024 })]: { display: 'none' } },
  below1200: { [media({ below: 1200 })]: { display: 'none' } },
  from480: { [media({ minWidth: 480 })]: { display: 'none' } },
  from600: { [media({ minWidth: 600 })]: { display: 'none' } },
  from768: { [media({ minWidth: 768 })]: { display: 'none' } },
  from1024: { [media({ minWidth: 1024 })]: { display: 'none' } },
  from1200: { [media({ minWidth: 1200 })]: { display: 'none' } },
});

/**
 * Hide content at certain viewport widths with CSS only (no JS measurement,
 * no layout flash). Supported breakpoints: 480, 600, 768, 1024, 1200.
 *
 * Note that `display: none` also removes content from the accessibility tree,
 * so use it for content that is truly redundant at that size.
 *
 * @example
 * <HideAt below={768}><SidebarAd /></HideAt>   // desktop only
 * <HideAt from={768}><MobileMenu /></HideAt>   // mobile only
 */
export function HideAt({ below, from, as: Element = 'div', className, ...rest }: HideAtProps) {
  const s = useStyles();
  if (below !== undefined && !(BELOW as readonly number[]).includes(below)) {
    throw new Error(`<HideAt below={${below}}>: use one of ${BELOW.join(', ')}.`);
  }
  if (from !== undefined && !(FROM as readonly number[]).includes(from)) {
    throw new Error(`<HideAt from={${from}}>: use one of ${FROM.join(', ')}.`);
  }
  const classes = mergeClasses(
    below !== undefined && s[`below${below}` as keyof typeof s],
    from !== undefined && s[`from${from}` as keyof typeof s],
    className,
  );
  return <Element className={classes} {...(rest as React.HTMLAttributes<HTMLElement>)} />;
}
