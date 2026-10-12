import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';

export interface TileGridProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Minimum tile width in px. Columns are added as space allows.
   * @default 280
   */
  minTileWidth?: number;
  /**
   * Gap between tiles in px.
   * @default 30
   */
  gap?: number;
  /**
   * Element to render. Use `ul` / `ol` when the children are `<li>`s.
   * @default 'div'
   */
  as?: 'div' | 'ul' | 'ol' | 'section';
}

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gap: 'var(--dp-tile-gap, 30px)',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, var(--dp-tile-min, 280px)), 1fr))',
  },
  list: { listStyleType: 'none', margin: 0, padding: 0 },
});

/**
 * Responsive grid that reflows by available width rather than by breakpoint.
 *
 * @example
 * <TileGrid as="ul">{guides.map((g) => <li key={g.id}><Card>…</Card></li>)}</TileGrid>
 */
export function TileGrid({ minTileWidth = 280, gap = 30, as: Element = 'div', className, style, ...rest }: TileGridProps) {
  const s = useStyles();
  return (
    <Element
      className={mergeClasses(s.root, (Element === 'ul' || Element === 'ol') && s.list, className)}
      style={{ '--dp-tile-min': `${minTileWidth}px`, '--dp-tile-gap': `${gap}px`, ...style } as React.CSSProperties}
      {...(rest as React.HTMLAttributes<HTMLElement>)}
    />
  );
}
