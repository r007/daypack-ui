import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { VisuallyHidden } from '../VisuallyHidden';
import { LoadingIcon } from '../Icon/icons';

export interface LoaderProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Announced to assistive technology; also the visible tooltip is not shown.
   * @default 'Loading'
   */
  label?: string;
  /**
   * Render inline with surrounding text instead of as a block.
   * @default false
   */
  inline?: boolean;
}

const bounce = {
  '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.5 },
  '40%': { transform: 'scale(1)', opacity: 1 },
};

const useStyles = makeStyles({
  root: { alignItems: 'center', columnGap: '6px', display: 'flex' },
  inline: { display: 'inline-flex', verticalAlign: 'middle' },
  dot: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: bounce,
    animationTimingFunction: 'ease-in-out',
    backgroundColor: vars.color.borderLight,
    borderRadius: '50%',
    display: 'inline-block',
    height: '10px',
    width: '10px',
    '@media (prefers-reduced-motion: reduce)': { animationDuration: '3s' },
  },
  second: { animationDelay: '0.15s' },
  third: { animationDelay: '0.3s' },

  spinner: {
    animationDuration: '600ms',
    animationIterationCount: 'infinite',
    animationName: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
    animationTimingFunction: 'linear',
    color: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 50%, transparent)',
    fontSize: vars.fontSize.heading4,
    '@media (prefers-reduced-motion: reduce)': { animationDuration: '2s' },
  },
});

/**
 * Three pulsing dots for content that is loading. Exposed as a status region
 * with a visually hidden label.
 *
 * @example
 * <DotLoader label="Loading results" />
 */
export function DotLoader({ label = 'Loading', inline = false, className, ...rest }: LoaderProps) {
  const s = useStyles();
  return (
    <span role="status" className={mergeClasses(s.root, inline && s.inline, className)} {...rest}>
      <span aria-hidden="true" className={s.dot} />
      <span aria-hidden="true" className={mergeClasses(s.dot, s.second)} />
      <span aria-hidden="true" className={mergeClasses(s.dot, s.third)} />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}

/**
 * Rotating ring for in-progress actions (e.g. inside a button). Exposed as a
 * status region with a visually hidden label.
 */
export function Spinner({ label = 'Loading', inline = true, className, ...rest }: LoaderProps) {
  const s = useStyles();
  return (
    <span role="status" className={mergeClasses(inline ? s.inline : s.root, className)} {...rest}>
      <LoadingIcon className={s.spinner} />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
