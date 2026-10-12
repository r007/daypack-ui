import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { Container } from '../Container';

export type GradientType = 'linear' | 'radial' | 'corner';

export interface GradientOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `linear` fades up from the bottom, `radial` darkens the edges, `corner`
   * darkens from the bottom-left.
   * @default 'linear'
   */
  type?: GradientType;
  /**
   * Any CSS color; the overlay fades it from `opacity` to transparent.
   * @default '#000'
   */
  color?: string;
  /**
   * Strength at the darkest point, 0–1.
   * @default 0.6
   */
  opacity?: number;
}

const useStyles = makeStyles({
  overlay: { inset: 0, pointerEvents: 'none', position: 'absolute' },
  root: {
    backgroundColor: vars.color.bgOverlay,
    color: vars.color.textOverlay,
    isolation: 'isolate',
    overflow: 'hidden',
    position: 'relative',
  },
  image: { height: '100%', inset: 0, objectFit: 'cover', position: 'absolute', width: '100%' },
  content: {
    alignItems: 'flex-end',
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    paddingBottom: '32px',
    paddingTop: '32px',
    position: 'relative',
    [media({ minWidth: 768 })]: { paddingBottom: '56px' },
  },
  contentCenter: { alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  inner: { width: '100%' },
});

/** Decorative scrim for keeping text legible over photos. Position it inside a `position: relative` box. */
export function GradientOverlay({ type = 'linear', color = '#000', opacity = 0.6, className, style, ...rest }: GradientOverlayProps) {
  const s = useStyles();
  const tint = `color-mix(in srgb, ${color} ${Math.round(opacity * 100)}%, transparent)`;
  const background =
    type === 'radial'
      ? `radial-gradient(ellipse at center, transparent 40%, ${tint} 100%)`
      : type === 'corner'
        ? `linear-gradient(to top right, ${tint}, transparent 65%)`
        : `linear-gradient(to top, ${tint}, transparent 70%)`;
  return <div aria-hidden="true" className={mergeClasses(s.overlay, className)} style={{ background, ...style }} {...rest} />;
}

export interface MastheadProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Background image URL. */
  image: string;
  /**
   * Text alternative of the image. Usually `""`: the headline already says
   * what the page is about.
   * @default ''
   */
  alt?: string;
  /**
   * Height of the hero. Numbers are px; strings are any CSS length.
   * @default 480
   */
  height?: number | string;
  /**
   * Scrim over the image so text stays readable.
   * @default 'linear'
   */
  overlay?: GradientType | 'none';
  /**
   * Where the content sits.
   * @default 'bottom'
   */
  align?: 'bottom' | 'center';
  /**
   * Eager-load the image (turn on for the main hero).
   * @default true
   */
  priority?: boolean;
  /** Hero content: usually a `PageHeader` or a heading, strapline and a `Button`. White text by default. */
  children?: React.ReactNode;
}

/**
 * Full-width hero with a background photo, a legibility scrim and
 * slotted content. Combine several in a `Carousel` for a rotating hero.
 *
 * @example
 * <Masthead image="/paris.jpg" height={560}>
 *   <h1>Paris</h1>
 * </Masthead>
 */
export function Masthead({
  image,
  alt = '',
  height = 480,
  overlay = 'linear',
  align = 'bottom',
  priority = true,
  children,
  className,
  style,
  ...rest
}: MastheadProps) {
  const s = useStyles();
  return (
    <section className={mergeClasses(s.root, className)} style={{ height, ...style }} {...rest}>
      <img className={s.image} src={image} alt={alt} loading={priority ? undefined : 'lazy'} decoding="async" />
      {overlay !== 'none' && <GradientOverlay type={overlay} />}
      <div className={mergeClasses(s.content, align === 'center' && s.contentCenter)}>
        <Container className={s.inner}>{children}</Container>
      </div>
    </section>
  );
}
