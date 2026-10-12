import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { media } from '../../theme/media';
import { gutter, shiftOffset, span } from './gridMath';

export type ColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ColumnShift = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface GridColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Use percentages instead of pixel widths so the column scales with its parent.
   * @default false
   */
  fluid?: boolean;
  /** Column span (1–12) from 480px up. Below 480px columns are full width. */
  sm?: ColumnCount;
  /** Left offset in columns (0–11) from 480px up. */
  smShift?: ColumnShift;
  /** Column span (1–12) from 768px up. Inherits `sm` when omitted. */
  md?: ColumnCount;
  /** Left offset in columns from 768px up. Inherits `smShift` when omitted. */
  mdShift?: ColumnShift;
  /** Column span (1–12) from 1024px up. Inherits `md` when omitted. */
  lg?: ColumnCount;
  /** Left offset in columns from 1024px up. Inherits `mdShift` when omitted. */
  lgShift?: ColumnShift;
  /**
   * Add a 30px gutter next to the column. Ignored for 12-column spans. Leave
   * it off the first column in a row so the row fills exactly.
   * @default false
   */
  includeGutter?: boolean;
  /**
   * Which side the gutter goes on when `includeGutter` is set.
   * @default 'before'
   */
  gutterPosition?: 'before' | 'after';
}

type Range = 'sm' | 'md' | 'lg';
interface RangeValues {
  width?: string;
  marginLeft?: string;
  marginRight?: string;
}

const RANGES: Range[] = ['sm', 'md', 'lg'];

/**
 * Resolve the width/margins that apply in each breakpoint range.
 * Values cascade mobile-first: a range inherits whatever the previous range
 * set unless it overrides it. Exported for testing.
 */
export function resolveColumnValues({
  fluid = false,
  includeGutter = false,
  gutterPosition = 'before',
  ...bp
}: Pick<
  GridColumnProps,
  'fluid' | 'includeGutter' | 'gutterPosition' | 'sm' | 'smShift' | 'md' | 'mdShift' | 'lg' | 'lgShift'
>): Record<Range, RangeValues> {
  const result = { sm: {}, md: {}, lg: {} } as Record<Range, RangeValues>;
  let inherited: RangeValues = {};

  for (const range of RANGES) {
    const columns = bp[range];
    const shift = bp[`${range}Shift` as const];
    const own: RangeValues = {};

    // Like the legacy grid, a range with neither span nor shift sets nothing of its own.
    if (columns || shift) {
      const withGutter = columns !== 12 && includeGutter;
      const before = withGutter && gutterPosition === 'before';
      const after = withGutter && gutterPosition === 'after';

      if (shift) own.marginLeft = shiftOffset(shift, fluid, before ? 1 : 0);
      else if (before) own.marginLeft = gutter(fluid);
      if (after) own.marginRight = gutter(fluid);
      if (columns) own.width = span(columns, fluid);
    }

    inherited = { ...inherited, ...own };
    result[range] = inherited;
  }
  return result;
}

const useStyles = makeStyles({
  base: { position: 'relative', width: '100%' },
  smWidth: { [media({ minWidth: 480, below: 768 })]: { width: 'var(--dp-col-sm-w)' } },
  smLeft: { [media({ minWidth: 480, below: 768 })]: { marginLeft: 'var(--dp-col-sm-ml)' } },
  smRight: { [media({ minWidth: 480, below: 768 })]: { marginRight: 'var(--dp-col-sm-mr)' } },
  mdWidth: { [media({ minWidth: 768, below: 1024 })]: { width: 'var(--dp-col-md-w)' } },
  mdLeft: { [media({ minWidth: 768, below: 1024 })]: { marginLeft: 'var(--dp-col-md-ml)' } },
  mdRight: { [media({ minWidth: 768, below: 1024 })]: { marginRight: 'var(--dp-col-md-mr)' } },
  lgWidth: { [media({ minWidth: 1024 })]: { width: 'var(--dp-col-lg-w)' } },
  lgLeft: { [media({ minWidth: 1024 })]: { marginLeft: 'var(--dp-col-lg-ml)' } },
  lgRight: { [media({ minWidth: 1024 })]: { marginRight: 'var(--dp-col-lg-mr)' } },
});

/**
 * A column in a 12-column responsive grid (80px columns, 30px gutters,
 * 1290px wide). Breakpoints are mobile-first: a value applies from its
 * breakpoint upward until a larger one overrides it. Use inside `GridRow`.
 */
export const GridColumn = React.forwardRef<HTMLDivElement, GridColumnProps>(function GridColumn(
  { fluid, sm, smShift, md, mdShift, lg, lgShift, includeGutter, gutterPosition, className, style, ...rest },
  ref,
) {
  const s = useStyles();
  const values = resolveColumnValues({ fluid, sm, smShift, md, mdShift, lg, lgShift, includeGutter, gutterPosition });

  const classes: (string | false | undefined)[] = [s.base];
  const cssVars: Record<string, string> = {};

  for (const range of RANGES) {
    const { width, marginLeft, marginRight } = values[range];
    if (width) {
      classes.push(s[`${range}Width`]);
      cssVars[`--dp-col-${range}-w`] = width;
    }
    if (marginLeft) {
      classes.push(s[`${range}Left`]);
      cssVars[`--dp-col-${range}-ml`] = marginLeft;
    }
    if (marginRight) {
      classes.push(s[`${range}Right`]);
      cssVars[`--dp-col-${range}-mr`] = marginRight;
    }
  }

  return (
    <div
      ref={ref}
      className={mergeClasses(...classes, className)}
      style={{ ...cssVars, ...style }}
      {...rest}
    />
  );
});
