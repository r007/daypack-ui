import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';

export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cross-axis alignment of the columns (CSS `align-items`). */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' },
});

/**
 * Wrapping flex row that holds `GridColumn`s.
 *
 * @example
 * <GridRow><GridColumn md={6}>…</GridColumn><GridColumn md={6} includeGutter>…</GridColumn></GridRow>
 */
export const GridRow = React.forwardRef<HTMLDivElement, GridRowProps>(function GridRow(
  { alignItems, className, style, ...rest },
  ref,
) {
  const s = useStyles();
  return (
    <div
      ref={ref}
      className={mergeClasses(s.root, className)}
      style={alignItems ? { alignItems, ...style } : style}
      {...rest}
    />
  );
});
