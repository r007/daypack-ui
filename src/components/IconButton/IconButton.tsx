import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export type IconButtonSize = 32 | 40 | 56;
export type IconButtonVariant = 'plain' | 'filled' | 'overlay';

interface IconButtonOwnProps {
  /** The icon, e.g. `<BookmarkIcon />`. It is decorative; the accessible name comes from `label`. */
  icon: React.ReactNode;
  /**
   * Accessible name describing the action ("Save to trip"). Required because
   * the button has no visible text.
   */
  label: string;
  /**
   * Diameter in px. The icon scales with it (12 / 16 / 24px).
   * @default 40
   */
  size?: IconButtonSize;
  /**
   * `plain` is the bare icon, `filled` adds a light gray circle, `overlay` is a
   * translucent dark circle with a white icon for use on photos.
   * @default 'plain'
   */
  variant?: IconButtonVariant;
  /**
   * For toggle buttons (bookmark, favourite): the current state, announced as
   * pressed / not pressed. Omit for plain action buttons.
   */
  pressed?: boolean;
  /**
   * Short visible text under the icon. It repeats `label` visually, so it is
   * hidden from assistive technology. Revealed on hover and keyboard focus
   * unless `captionAlways` is set. Replaces the legacy `IconRevealButton`.
   */
  caption?: string;
  /**
   * Keep the caption visible instead of revealing it on hover/focus.
   * @default false
   */
  captionAlways?: boolean;
}

export type IconButtonProps = IconButtonOwnProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>)
  );

const FONT = { 32: '12px', 40: '16px', 56: '24px' } as const;

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '100%',
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    lineHeight: 1,
    margin: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    textDecorationLine: 'none',
    transitionProperty: 'color, background-color',
    transitionDuration: vars.duration.fast,
    verticalAlign: 'middle',
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
    ':disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
  filled: {
    backgroundColor: 'color-mix(in srgb, ' + vars.color.bgPrimary + ', black 6%)',
    ':hover': { backgroundColor: 'color-mix(in srgb, ' + vars.color.bgPrimary + ', black 12%)' },
  },
  overlay: {
    backgroundColor: 'color-mix(in srgb, ' + vars.color.bgOverlay + ' 60%, transparent)',
    color: vars.color.textOverlay,
    ':hover': { backgroundColor: 'color-mix(in srgb, ' + vars.color.bgOverlay + ' 90%, transparent)', color: vars.color.textOverlay },
  },
  pressed: { color: vars.color.accentRed, ':hover': { color: vars.color.accentRed } },
  withCaption: {
    borderRadius: '4px',
    flexDirection: 'column',
    height: 'auto',
    rowGap: '6px',
    paddingTop: '8px',
    paddingBottom: '8px',
    ':hover': { '--dp-caption-opacity': '1' },
    ':focus-visible': { '--dp-caption-opacity': '1' },
  },
  caption: {
    fontSize: vars.fontSize.uppercase,
    fontWeight: vars.fontWeight.medium,
    letterSpacing: '0.6px',
    opacity: 'var(--dp-caption-opacity, 0)',
    textTransform: 'uppercase',
    transitionProperty: 'opacity',
    transitionDuration: vars.duration.fast,
  },
  captionAlways: { opacity: 1 },
});

/**
 * Round icon-only button or link. Renders a native `<button>` or, with
 * `href`, an `<a>`. Accepts every attribute of the element it renders and
 * forwards its `ref`.
 *
 * @example
 * <IconButton icon={<BookmarkIcon />} label="Save to trip" pressed={saved} onClick={toggle} />
 */
export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { icon, label, size = 40, variant = 'plain', pressed, caption, captionAlways = false, className, style, ...rest },
  ref,
) {
  const s = useStyles();
  const classes = mergeClasses(
    s.root,
    variant === 'filled' && s.filled,
    variant === 'overlay' && s.overlay,
    pressed && s.pressed,
    caption && s.withCaption,
    className,
  );
  const dims = { width: size, ...(caption ? {} : { height: size }), fontSize: FONT[size], ...style };
  const content = (
    <>
      {icon}
      {caption && (
        <span aria-hidden="true" className={mergeClasses(s.caption, captionAlways && s.captionAlways)}>
          {caption}
        </span>
      )}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-label={label}
        className={classes}
        style={dims}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={classes}
      style={dims}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});
