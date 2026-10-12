import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { CheckmarkIcon } from '../Icon/icons';

export interface AmenityListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Amenity names. */
  items: string[];
  /**
   * Number of columns from 600px; always one on phones.
   * @default 2
   */
  columns?: 1 | 2 | 3;
}

const useStyles = makeStyles({
  list: { color: vars.color.textPrimary, fontFamily: vars.font.sans, fontSize: '14px', listStyleType: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'flex-start', breakInside: 'avoid', columnGap: '10px', display: 'flex', lineHeight: 1.5, paddingBottom: '10px' },
  check: { color: vars.color.accentGreen, flexShrink: 0, fontSize: '16px', marginTop: '2px' },
});

const columnCounts = { 1: 1, 2: 2, 3: 3 } as const;

/**
 * Checklist of amenities or features, laid out in balanced columns.
 *
 * @example
 * <AmenityList items={['Free Wi-Fi', 'Breakfast included', 'Pool']} columns={2} />
 */
export function AmenityList({ items, columns = 2, className, style, ...rest }: AmenityListProps) {
  const s = useStyles();
  return (
    <ul
      className={mergeClasses(s.list, className)}
      style={{ columnCount: columnCounts[columns], columnGap: 32, ...style }}
      {...rest}
    >
      {items.map((item) => (
        <li key={item} className={s.item}>
          <CheckmarkIcon aria-hidden="true" className={s.check} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
