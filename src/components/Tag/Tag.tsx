import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export interface TagProps {
  /** Label text. */
  children: string;
  /** Renders an anchor to this URL. */
  href?: string;
  /** Renders a toggle button (`aria-pressed` reflects `selected`). Takes precedence over `href`. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * Filled appearance. Announced as pressed when the tag is a button.
   * @default false
   */
  selected?: boolean;
  /** Extra class name merged onto the root element. */
  className?: string;
}

const useStyles = makeStyles({
  base: {
    backgroundColor: vars.color.bgPrimary,
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderRadius: '32px',
    boxSizing: 'border-box',
    color: vars.color.textLight,
    cursor: 'default',
    display: 'inline-block',
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.bodySmall,
    fontWeight: vars.fontWeight.regular,
    lineHeight: '15px',
    maxHeight: '30px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '20px',
    paddingRight: '20px',
    textDecorationLine: 'none',
    textOverflow: 'ellipsis',
    transitionProperty: 'background-color',
    transitionDuration: vars.duration.fast,
    whiteSpace: 'nowrap',
  },
  interactive: {
    cursor: 'pointer',
    ':hover': { backgroundColor: 'color-mix(in srgb, ' + vars.color.borderPrimary + ' 15%, transparent)' },
    ':focus-visible': focusRing,
  },
  selected: {
    backgroundColor: vars.color.textPrimary,
    borderTopColor: vars.color.textPrimary,
    borderRightColor: vars.color.textPrimary,
    borderBottomColor: vars.color.textPrimary,
    borderLeftColor: vars.color.textPrimary,
    color: vars.color.textOverlay,
    ':hover': { backgroundColor: vars.color.textPrimary },
  },
});

/**
 * Compact pill used for filters and topic labels. Static `<span>` by default,
 * a link with `href`, or a toggle button with `onClick`.
 *
 * @example
 * <Tag onClick={toggle} selected={active}>Street food</Tag>
 */
export function Tag({ children, href, onClick, selected = false, className }: TagProps) {
  const s = useStyles();
  const interactive = Boolean(href || onClick);
  const classes = mergeClasses(s.base, interactive && s.interactive, selected && s.selected, className);

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-pressed={selected}>
        {children}
      </button>
    );
  }
  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }
  return <span className={classes}>{children}</span>;
}
