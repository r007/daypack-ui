import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import {
  RatingZeroIcon,
  RatingHalfIcon,
  RatingOneIcon,
  RatingOneHalfIcon,
  RatingTwoIcon,
  RatingTwoHalfIcon,
  RatingThreeIcon,
  RatingThreeHalfIcon,
  RatingFourIcon,
  RatingFourHalfIcon,
  RatingFiveIcon,
} from '../Icon/icons';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rating value from 0 to 5. Half steps render as an icon; other values fall back to text. */
  amount?: number;
  /**
   * Maximum value, shown as "out of N" in text mode.
   * @default 5
   */
  max?: number;
  /** A word describing the rating: "excellent", "poor"… (text mode). */
  description?: string;
  /**
   * Show five circles instead of text. Only whole and half values 0–5 have an icon.
   * @default false
   */
  icon?: boolean;
}

const ICONS: Record<number, typeof RatingZeroIcon> = {
  0: RatingZeroIcon,
  0.5: RatingHalfIcon,
  1: RatingOneIcon,
  1.5: RatingOneHalfIcon,
  2: RatingTwoIcon,
  2.5: RatingTwoHalfIcon,
  3: RatingThreeIcon,
  3.5: RatingThreeHalfIcon,
  4: RatingFourIcon,
  4.5: RatingFourHalfIcon,
  5: RatingFiveIcon,
};

const useStyles = makeStyles({
  root: { fontFamily: vars.font.sans, fontSize: '11px', lineHeight: 1.5 },
  text: { display: 'inline-block' },
});

/** Numeric or five-circle rating with schema.org `aggregateRating` markup. */
export function Rating({
  amount,
  max = 5,
  description,
  icon = false,
  className,
  ...rest
}: RatingProps) {
  const s = useStyles();
  const hasAmount = amount !== undefined && amount !== null;
  const label = hasAmount ? `${amount} rating` : '';
  const RatingIcon = hasAmount ? ICONS[amount] : undefined;

  return (
    <div
      className={mergeClasses(s.root, className)}
      title={label || undefined}
      itemProp="aggregateRating"
      itemScope
      itemType="http://schema.org/AggregateRating"
      {...rest}
    >
      {hasAmount && icon && RatingIcon && (
        <>
          <meta itemProp="ratingValue" content={String(amount)} />
          <RatingIcon width="100px" height="12px" label={label} />
        </>
      )}

      {hasAmount && (!icon || !RatingIcon) && (
        <div className={s.text}>
          {description && `${description} `}
          <span itemProp="ratingValue">{amount}</span>
          {max ? ` out of ${max}` : null}
        </div>
      )}
    </div>
  );
}
