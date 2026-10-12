import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref' | 'width' | 'height'> {
  /** SVG contents. */
  children: React.ReactNode;
  /**
   * Accessible name. When omitted the icon is decorative and hidden from
   * assistive technology.
   */
  label?: string;
  /** Defaults to `1em`; if only one dimension is set, the icon is square. */
  width?: string | number;
  height?: string | number;
}

const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    lineHeight: 1,
    verticalAlign: 'middle',
  },
});

/** Base SVG wrapper. Icons inherit `currentColor` unless `fill` is set. */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  { children, label, width, height, fill, viewBox = '0 0 32 32', className, style, ...rest },
  ref,
) {
  const s = useStyles();
  const w = width ?? height ?? '1em';
  const h = height ?? width ?? '1em';

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={mergeClasses(s.root, className)}
      style={{ fill: fill ?? 'currentColor', width: w, height: h, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  );
});
