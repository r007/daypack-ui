import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { blueLink } from '../../theme/mixins';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from '../Icon/icons';

interface MoreLinkOwnProps {
  /**
   * Which way the chevron points.
   * @default 'right'
   */
  direction?: 'right' | 'left' | 'down' | 'up';
  /**
   * Bold uppercase text.
   * @default false
   */
  caps?: boolean;
  /**
   * `small` is 11px, `medium` 13px.
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * Hide the chevron.
   * @default false
   */
  hideIcon?: boolean;
  children: React.ReactNode;
}

export type MoreLinkProps = MoreLinkOwnProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
  );

const ICONS = { right: ChevronRightIcon, left: ChevronLeftIcon, down: ChevronDownIcon, up: ChevronUpIcon };

const useStyles = makeStyles({
  root: {
    ...blueLink,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: vars.font.sans,
    fontSize: '13px',
    fontWeight: 400,
    letterSpacing: '0.6px',
    lineHeight: 1,
    padding: 0,
  },
  caps: { fontWeight: 600, textTransform: 'uppercase' },
  small: { fontSize: '11px' },
  icon: { fontSize: '6px', position: 'relative', top: '-0.1em' },
  iconAfter: { marginLeft: '0.7em' },
  iconBefore: { marginRight: '0.7em' },
});

/**
 * Inline "read more" style link or button with a chevron. A link when `href`
 * is given, otherwise a `<button type="button">`.
 *
 * @example
 * <MoreLink href="/paris/sights">All sights</MoreLink>
 * <MoreLink direction="down" onClick={expand}>Show more</MoreLink>
 */
export function MoreLink({
  direction = 'right',
  caps = false,
  size = 'medium',
  hideIcon = false,
  children,
  className,
  ...rest
}: MoreLinkProps) {
  const s = useStyles();
  const Chevron = ICONS[direction];
  const icon = hideIcon ? null : <Chevron className={mergeClasses(s.icon, direction === 'left' ? s.iconBefore : s.iconAfter)} />;
  const classes = mergeClasses(s.root, caps && s.caps, size === 'small' && s.small, className);
  const content = (
    <>
      {direction === 'left' && icon}
      {children}
      {direction !== 'left' && icon}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}
