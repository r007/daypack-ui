import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { Bullet } from '../Bullet';

export interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Price amount (rounded to whole units for display). */
  amount: number | string;
  /**
   * Sale price. When greater than 0 it is displayed and `amount` is shown as
   * the old price (in `card` and `booking` contexts).
   */
  discountedAmount?: number | string;
  /** Unit of the price, e.g. "per night". */
  rate?: string;
  /**
   * ISO 4217 currency code, formatted with `Intl.NumberFormat` using the narrow symbol.
   * @default 'USD'
   */
  currency?: string;
  /**
   * BCP 47 locale used to format the amount.
   * @default 'en-US'
   */
  locale?: string;
  /**
   * Large red price with a raised currency symbol.
   * @default false
   */
  emphasized?: boolean;
  /**
   * Lighter weight and slightly larger size.
   * @default false
   */
  thin?: boolean;
  /**
   * Filled red tag appearance.
   * @default false
   */
  tag?: boolean;
  /**
   * Layout the price sits in; adjusts the rate position and the sale presentation.
   */
  parent?: 'booking' | 'listItem' | 'card';
  /** With `parent="booking"`, `partnerActivity` prefixes the price with "From". */
  poiType?: 'poi' | 'hotel' | 'partnerActivity';
}

const belowMd = media({ below: 768 });
const fromMd = media({ minWidth: 768 });

const useStyles = makeStyles({
  root: {
    fontFamily: vars.font.sans,
    lineHeight: 1,
    fontSize: '18px',
    position: 'relative',
    '::after': { content: '" "', display: 'block', clear: 'both' },
  },
  emphasized: { fontSize: '36px' },
  emphasizedListItem: { [belowMd]: { fontSize: '22px' } },
  tag: {
    backgroundColor: vars.color.accentRed,
    color: vars.color.bgPrimary,
    display: 'inline-block',
    fontSize: '12px',
    padding: `${6 / 12}em ${8 / 12}em ${4 / 12}em`,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  rootThin: { fontSize: '20px' },

  amount: { display: 'inline-block', fontSize: '1em', lineHeight: 1 },
  amountEmphasized: { color: vars.color.accentRed, fontWeight: 300 },
  amountTag: { fontWeight: 600 },
  amountThin: { fontWeight: 300 },
  symbol: { fontSize: `${(18 / 36) * 100}%`, position: 'relative', top: '-.65em' },

  rate: { fontSize: `${14 / 36}em`, fontWeight: 300, lineHeight: 1 },
  rateListItem: {
    [belowMd]: { display: 'inline-block', fontSize: '9px', fontWeight: 400, lineHeight: 16 / 9 },
    [fromMd]: { marginTop: `${3 / 14}em` },
  },
  rateBooking: { bottom: '5px', display: 'inline-block', position: 'absolute', right: 0 },

  bullet: { [fromMd]: { display: 'none' } },

  from: { color: vars.color.accentGray, fontWeight: 400, marginBottom: '7px' },
  onSale: {
    [belowMd]: { paddingTop: '14px', textAlign: 'center' },
    [fromMd]: {
      borderLeft: `1px solid ${vars.color.borderPrimary}`,
      float: 'right',
      fontWeight: 400,
      padding: '2px 0 2px 14px',
      textAlign: 'right',
    },
  },
  oldPrice: { color: vars.color.accentGray, paddingTop: '4px' },

  cardWas: {
    color: vars.color.accentGray,
    fontSize: '11px',
    marginBottom: '8px',
    marginLeft: '5px',
    textTransform: 'uppercase',
  },
  crossed: { textDecorationLine: 'line-through' },
});

function useFormatter(currency: string, locale: string) {
  return React.useMemo(() => {
    const fmt = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    });
    return {
      full: (n: number) => fmt.format(n),
      parts: (n: number) => {
        const parts = fmt.formatToParts(n);
        return {
          symbol: parts.filter((p) => p.type === 'currency').map((p) => p.value).join(''),
          number: parts.filter((p) => p.type !== 'currency').map((p) => p.value).join('').trim(),
        };
      },
    };
  }, [currency, locale]);
}

/** A standalone price, optionally discounted, with a rate such as "per night". */
export function Price({
  amount,
  discountedAmount = 0,
  rate,
  currency = 'USD',
  locale = 'en-US',
  emphasized = false,
  thin = false,
  tag = false,
  parent,
  poiType,
  className,
  ...rest
}: PriceProps) {
  const s = useStyles();
  const fmt = useFormatter(currency, locale);

  const original = Number(amount) || 0;
  const discounted = Number(discountedAmount) || 0;
  const hasPrice = original > 0 || discounted > 0;
  const shown = discounted > 0 ? discounted : original;
  const { symbol, number } = fmt.parts(shown);

  return (
    <div
      className={mergeClasses(
        s.root,
        emphasized && s.emphasized,
        emphasized && parent === 'listItem' && s.emphasizedListItem,
        thin && s.rootThin,
        tag && s.tag,
        className,
      )}
      {...rest}
    >
      {parent === 'booking' && poiType === 'partnerActivity' && hasPrice && (
        <div className={mergeClasses(s.rate, s.from)}>From</div>
      )}

      {parent === 'card' && discounted > 0 && (
        <div className={s.cardWas}>
          was <span className={s.crossed}>{fmt.full(original)}</span>
        </div>
      )}

      {hasPrice && (
        <div
          className={mergeClasses(
            s.amount,
            emphasized && s.amountEmphasized,
            thin && s.amountThin,
            tag && s.amountTag,
          )}
        >
          {emphasized ? (
            <>
              <span className={s.symbol}>{symbol}</span>
              {number}
            </>
          ) : (
            fmt.full(shown)
          )}
        </div>
      )}

      {parent === 'booking' && discounted > 0 && (
        <div className={mergeClasses(s.rate, s.onSale)}>
          <div>
            <strong>On sale</strong>
          </div>
          <div className={s.oldPrice}>Was – {fmt.full(original)}</div>
        </div>
      )}

      {rate && (
        <div
          className={mergeClasses(
            s.rate,
            parent === 'listItem' && s.rateListItem,
            parent === 'booking' && s.rateBooking,
          )}
        >
          {hasPrice && (
            <span className={s.bullet} aria-hidden="true">
              <Bullet space="both" color={vars.color.borderPrimary} />
            </span>
          )}
          {rate}
        </div>
      )}
    </div>
  );
}
