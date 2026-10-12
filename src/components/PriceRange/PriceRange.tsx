import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { VisuallyHidden } from '../VisuallyHidden';

export interface PriceRangeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Price tier, from 1 (cheapest) to `max`. */
  value: number;
  /**
   * Number of tiers shown.
   * @default 3
   */
  max?: number;
  /**
   * Currency symbol repeated for each tier.
   * @default '$'
   */
  symbol?: string;
  /**
   * Screen-reader text template: `{value}` and `{max}` are replaced.
   * @default 'Price range: {value} out of {max}'
   */
  label?: string;
}

const useStyles = makeStyles({
  root: { fontFamily: vars.font.sans, fontSize: '13px', fontWeight: vars.fontWeight.medium, letterSpacing: '1px', whiteSpace: 'nowrap' },
  active: { color: vars.color.textPrimary },
  inactive: { color: vars.color.borderLight },
});

/**
 * Price tier as repeated currency symbols with the unused ones dimmed ("$$$").
 *
 * @example
 * <PriceRange value={2} />   // $$$ with the last symbol dimmed
 */
export function PriceRange({ value, max = 3, symbol = '$', label = 'Price range: {value} out of {max}', className, ...rest }: PriceRangeProps) {
  const s = useStyles();
  const filled = Math.min(Math.max(0, Math.round(value)), max);
  return (
    <span className={mergeClasses(s.root, className)} {...rest}>
      <span aria-hidden="true">
        <span className={s.active}>{symbol.repeat(filled)}</span>
        <span className={s.inactive}>{symbol.repeat(max - filled)}</span>
      </span>
      <VisuallyHidden>{label.replace('{value}', String(filled)).replace('{max}', String(max))}</VisuallyHidden>
    </span>
  );
}
