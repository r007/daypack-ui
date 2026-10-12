import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { placeholderLetter } from '../Placeholder';

export type ImageRatio = 'video' | 'poster' | 'square' | number;

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  /** Image URL. */
  src: string;
  /**
   * Text alternative. Required: use `""` for purely decorative images so
   * they are skipped by screen readers.
   */
  alt: string;
  /**
   * Reserve a box with this shape so the page does not jump while loading.
   * `video` is 16:9, `poster` is 4:5, `square` is 1:1, or pass width ÷ height
   * (e.g. `4 / 3`). Without it the image keeps its natural size.
   */
  ratio?: ImageRatio;
  /**
   * How the image fills its box when `ratio` is set.
   * @default 'cover'
   */
  fit?: 'cover' | 'contain';
  /**
   * Shown instead of the image if it fails to load. Defaults to a gray tile
   * with the first letter of `alt`; pass `null` to render nothing.
   */
  fallback?: React.ReactNode;
  /**
   * Native lazy loading. Turn off for above-the-fold images.
   * @default true
   */
  lazy?: boolean;
  /** Class for the wrapping box (the `<img>` itself takes `className`). */
  wrapperClassName?: string;
}

const RATIOS = { video: 16 / 9, poster: 4 / 5, square: 1 } as const;

const useStyles = makeStyles({
  box: { backgroundColor: vars.color.bgMap, overflow: 'hidden', position: 'relative', width: '100%' },
  img: { display: 'block', maxWidth: '100%' },
  fill: { height: '100%', inset: 0, position: 'absolute', width: '100%' },
  cover: { objectFit: 'cover' },
  contain: { objectFit: 'contain' },
  fallback: {
    alignItems: 'center',
    color: '#c4c7cc',
    display: 'flex',
    fontFamily: vars.font.serif,
    fontSize: '32px',
    height: '100%',
    justifyContent: 'center',
    minHeight: '64px',
    textTransform: 'uppercase',
    width: '100%',
  },
});

/**
 * Image with a reserved aspect ratio, native lazy loading and a fallback for
 * broken URLs. Replaces the legacy `CoverPhoto`, `ImageLoader` and `ImageHero`.
 *
 * @example
 * <Image src="/paris.jpg" alt="The Eiffel Tower at dusk" ratio="video" />
 */
export function Image({
  src,
  alt,
  ratio,
  fit = 'cover',
  fallback,
  lazy = true,
  className,
  wrapperClassName,
  onError,
  ...rest
}: ImageProps) {
  const s = useStyles();
  // Remember *which* source failed, so a new `src` automatically gets a fresh chance.
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const failed = failedSrc === src;

  const content = failed ? (
    fallback === undefined ? (
      <div className={s.fallback} aria-hidden="true">
        {placeholderLetter(alt)}
      </div>
    ) : (
      fallback
    )
  ) : (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      className={mergeClasses(s.img, ratio !== undefined && s.fill, ratio !== undefined && s[fit], className)}
      onError={(event) => {
        setFailedSrc(src);
        onError?.(event);
      }}
      {...rest}
    />
  );

  if (ratio === undefined) return failed ? <div className={mergeClasses(s.box, wrapperClassName)}>{content}</div> : content;

  const aspectRatio = typeof ratio === 'number' ? ratio : RATIOS[ratio];
  return (
    <div className={mergeClasses(s.box, wrapperClassName)} style={{ aspectRatio }}>
      {content}
    </div>
  );
}
