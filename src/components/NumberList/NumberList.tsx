import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export type NumberMarkerSize = 'xSmall' | 'small' | 'medium' | 'large';

export interface NumberMarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The number shown in the marker. */
  value: number | string;
  /**
   * Marker size: `xSmall` 24px, `small` 14px type, `medium` 20px type, `large` 24px type.
   * @default 'medium'
   */
  size?: NumberMarkerSize;
  /**
   * Draw a 1px border instead of a soft shadow, for use on white.
   * @default false
   */
  outlined?: boolean;
  /**
   * White text on a transparent diamond with a white border, for use on photos.
   * @default false
   */
  transparent?: boolean;
}

const useStyles = makeStyles({
  marker: {
    alignItems: 'center',
    color: vars.color.textPrimary,
    display: 'inline-flex',
    fontFamily: vars.font.serif,
    fontSize: '20px',
    height: `${36 / 20}em`,
    isolation: 'isolate',
    justifyContent: 'center',
    lineHeight: 1,
    position: 'relative',
    width: `${36 / 20}em`,
    '::before': {
      backgroundColor: vars.color.bgPrimary,
      borderRadius: `${4 / 20}em`,
      boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.18)',
      content: '""',
      height: '72%',
      inset: '14%',
      position: 'absolute',
      transform: 'rotate(45deg)',
      width: '72%',
      zIndex: -1,
    },
  },
  xSmall: { fontSize: '12px', height: '24px', width: '24px' },
  small: { fontSize: '14px' },
  large: { fontSize: '24px' },
  outlined: { '::before': { boxShadow: `0 0 0 1px ${vars.color.borderLight}` } },
  transparent: {
    color: vars.color.bgPrimary,
    '::before': { backgroundColor: 'transparent', boxShadow: 'none', borderTopWidth: '1px', borderRightWidth: '1px', borderBottomWidth: '1px', borderLeftWidth: '1px', borderTopStyle: 'solid', borderRightStyle: 'solid', borderBottomStyle: 'solid', borderLeftStyle: 'solid', borderTopColor: vars.color.bgPrimary, borderRightColor: vars.color.bgPrimary, borderBottomColor: vars.color.bgPrimary, borderLeftColor: vars.color.bgPrimary },
  },

  list: { listStyleType: 'none', margin: 0, padding: 0 },
  item: {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    color: vars.color.textPrimary,
    columnGap: '26px',
    display: 'flex',
    fontFamily: vars.font.sans,
    fontSize: '14px',
    lineHeight: 22 / 14,
    paddingTop: '13px',
    paddingRight: '12px',
    paddingBottom: '13px',
    paddingLeft: '6px',
  },
  link: {
    color: 'inherit',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: vars.duration.default,
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
});

/**
 * Numbered diamond marker, used on maps and in ranked lists. The number is
 * visual only (`aria-hidden`); give the thing it labels an accessible name.
 */
export function NumberMarker({ value, size = 'medium', outlined, transparent, className, ...rest }: NumberMarkerProps) {
  const s = useStyles();
  return (
    <span
      aria-hidden="true"
      className={mergeClasses(
        s.marker,
        size !== 'medium' && s[size],
        outlined && s.outlined,
        transparent && s.transparent,
        className,
      )}
      {...rest}
    >
      {value}
    </span>
  );
}

export interface NumberListItem {
  title: string;
  /** Makes the title a link. */
  href?: string;
}

export interface NumberListProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'children'> {
  /** Items in rank order. Numbered from 1. */
  items: NumberListItem[];
}

/**
 * Ranked list of links with a numbered marker per row. A real `<ol>`, so
 * assistive technology announces the position ("1 of 5").
 *
 * @example
 * <NumberList aria-label="Top sights" items={[{ title: 'Louvre', href: '/louvre' }, { title: 'Eiffel Tower' }]} />
 */
export function NumberList({ items, className, ...rest }: NumberListProps) {
  const s = useStyles();
  return (
    // Safari drops list semantics when `list-style: none`; restore them explicitly.
    <ol role="list" className={mergeClasses(s.list, className)} {...rest}>
      {items.map((item, index) => (
        <li key={`${item.href ?? ''}${item.title}`} className={s.item}>
          <NumberMarker value={index + 1} outlined />
          {item.href ? (
            <a className={s.link} href={item.href}>
              {item.title}
            </a>
          ) : (
            <span>{item.title}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
