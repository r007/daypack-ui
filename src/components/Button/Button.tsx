import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export type ButtonColor = 'blue' | 'white' | 'gray' | 'red' | 'transparent';
export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

interface ButtonOwnProps {
  /**
   * Visual color scheme. `transparent` is for use on photos or dark surfaces.
   * @default 'blue'
   */
  color?: ButtonColor;
  /**
   * `tiny` 30px · `small` 44px · `medium` 60px · `large` 66px · `huge` 72px tall.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * Pill-shaped corners.
   * @default false
   */
  rounded?: boolean;
  /**
   * Stretch to the available width (renders as a block element).
   * @default false
   */
  full?: boolean;
  /**
   * Draw a 1px inset outline in the button's accent color. Has no effect on
   * `blue`, which has no outline in the design.
   * @default false
   */
  border?: boolean;
}

export type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>)
  );

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color}, white ${pct}%)`;

const useStyles = makeStyles({
  base: {
    appearance: 'none',
    backfaceVisibility: 'hidden',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 0,
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: vars.font.sans,
    fontWeight: vars.fontWeight.medium,
    lineHeight: 1,
    overflow: 'hidden',
    paddingLeft: `${30 / 13}em`,
    paddingRight: `${30 / 13}em`,
    textAlign: 'center',
    textDecorationLine: 'none',
    textOverflow: 'ellipsis',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    transitionProperty: 'color, background-color, opacity',
    transitionDuration: vars.duration.default,
    transitionTimingFunction: 'ease-in-out',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ':hover': { textDecorationLine: 'none' },
    ':focus-visible': focusRing,
  },

  blue: {
    backgroundColor: vars.color.linkPrimary,
    color: vars.color.textOverlay,
    ':hover': { backgroundColor: mix(vars.color.linkPrimary, 7), color: vars.color.bgPrimary },
    ':focus': { backgroundColor: mix(vars.color.linkPrimary, 7), color: vars.color.bgPrimary },
  },
  gray: {
    backgroundColor: 'transparent',
    color: vars.color.textPrimary,
    boxShadow: `0 0 0 1px ${vars.color.borderPrimary} inset`,
    ':hover': { backgroundColor: vars.color.bgPrimary, color: vars.color.textLight },
    ':focus': { backgroundColor: vars.color.bgPrimary, color: vars.color.textLight },
  },
  white: {
    backgroundColor: vars.color.bgPrimary,
    color: vars.color.linkPrimary,
    boxShadow: `0 0 0 1px ${vars.color.linkPrimary} inset`,
    ':hover': { backgroundColor: vars.color.bgPrimary, color: mix(vars.color.linkPrimary, 14) },
    ':focus': { backgroundColor: vars.color.bgPrimary, color: mix(vars.color.linkPrimary, 14) },
  },
  red: {
    backgroundColor: vars.color.accentRed,
    color: vars.color.textOverlay,
    boxShadow: `0 0 0 1px ${vars.color.accentRed} inset`,
    ':hover': { backgroundColor: mix(vars.color.accentRed, 7), color: vars.color.bgPrimary },
    ':focus': { backgroundColor: mix(vars.color.accentRed, 7), color: vars.color.bgPrimary },
  },
  transparent: {
    backgroundColor: 'transparent',
    color: vars.color.textOverlay,
    boxShadow: `0 0 0 1px ${vars.color.bgPrimary} inset`,
    ':hover': { backgroundColor: 'transparent', color: vars.color.textOverlay },
    ':focus': { backgroundColor: 'transparent', color: vars.color.textOverlay },
  },

  noBorder: { boxShadow: 'none' },

  tiny: {
    fontSize: '9px',
    paddingTop: `${12 / 9}em`,
    paddingBottom: `${9 / 9}em`,
    paddingLeft: `${19 / 9}em`,
    paddingRight: `${19 / 9}em`,
  },
  small: { fontSize: '11px', paddingTop: `${18 / 11}em`, paddingBottom: `${15 / 11}em` },
  medium: { fontSize: '13px', paddingTop: `${26 / 13}em`, paddingBottom: `${21 / 13}em` },
  large: { fontSize: '15px', paddingTop: `${28 / 15}em`, paddingBottom: `${23 / 15}em` },
  huge: { fontSize: '17px', paddingTop: `${30 / 17}em`, paddingBottom: `${25 / 17}em` },

  rounded: {
    borderRadius: '100px',
    paddingLeft: `${21 / 9}em`,
    paddingRight: `${21 / 9}em`,
    paddingTop: `${12 / 9}em`,
    paddingBottom: `${9 / 9}em`,
  },
  full: { display: 'block', width: '100%' },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
});

/**
 * Call-to-action button.
 *
 * Renders an `<a role="button">` when `href` is given, otherwise a native
 * `<button type="button">`. Accepts every attribute of the element it renders
 * (`onClick`, `disabled`, `target`, `aria-*`, …) and forwards its `ref`.
 *
 * @example
 * <Button color="red" size="large" rounded onClick={book}>Book now</Button>
 * <Button href="/trips" color="white" border>All trips</Button>
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    color = 'blue',
    size = 'medium',
    rounded = false,
    full = false,
    border = false,
    className,
    children = 'Button',
    ...rest
  },
  ref,
) {
  const s = useStyles();
  const classes = mergeClasses(
    s.base,
    s[color],
    s[size],
    rounded && s.rounded,
    full && s.full,
    !border && s.noBorder,
    className,
  );

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        role="button"
        href={href}
        className={classes}
        {...anchor}
      >
        {children}
      </a>
    );
  }

  const { disabled, ...button } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled}
      className={mergeClasses(classes, disabled && s.disabled)}
      {...button}
    >
      {children}
    </button>
  );
});
