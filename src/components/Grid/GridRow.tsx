import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';

export interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' },
});

/** Flex row that holds <GridColumn>s. */
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
