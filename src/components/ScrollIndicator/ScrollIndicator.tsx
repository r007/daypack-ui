import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { focusRing } from '../../theme/focus';
import { MouseOutlineIcon } from '../Icon/icons';

export type ScrollIndicatorProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /**
   * Accessible name of the button.
   * @default 'Scroll down'
   */
  label?: string;
  /**
   * Icon color; inherits `currentColor` by default (white on heroes).
   */
  color?: string;
};

const useStyles = makeStyles({
  root: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(6px)' },
    },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '32px',
    lineHeight: 1,
    padding: '8px',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
    ':focus-visible': { ...focusRing, outlineColor: 'currentColor' },
  },
});

/**
 * "Scroll down" cue for heroes. A real button so it can be used by keyboard
 * and assistive technology; wire `onClick` to scroll to the next section.
 */
export function ScrollIndicator({ label = 'Scroll down', color, className, style, ...rest }: ScrollIndicatorProps) {
  const s = useStyles();
  return (
    <button type="button" aria-label={label} className={mergeClasses(s.root, className)} style={{ color, ...style }} {...rest}>
      <MouseOutlineIcon />
    </button>
  );
}
