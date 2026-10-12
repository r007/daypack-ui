import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

const SIZE = 32;
const OFFSET = 20;

const thumbShadow = (edge: string) =>
  `0 0 0 1px ${edge}, 0 3px 1px rgba(0,0,0,0.05), 0 2px 2px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.05)`;

const useStyles = makeStyles({
  root: {
    appearance: 'none',
    backgroundColor: vars.color.bgPrimary,
    borderRadius: `${SIZE}px`,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    boxShadow: `0 0 0 1px ${vars.color.borderPrimary} inset`,
    cursor: 'pointer',
    display: 'block',
    flexShrink: 0,
    height: `${SIZE}px`,
    margin: 0,
    position: 'relative',
    transitionProperty: 'background-color, box-shadow',
    transitionDuration: vars.duration.fast,
    width: `${SIZE + OFFSET}px`,
    '::before': {
      content: '""',
      backgroundColor: vars.color.bgPrimary,
      borderRadius: '100%',
      boxShadow: thumbShadow(vars.color.borderPrimary),
      height: `${SIZE - 4}px`,
      left: '2px',
      position: 'absolute',
      top: '2px',
      transform: 'translateX(0)',
      transitionProperty: 'transform, box-shadow',
      transitionDuration: vars.duration.fast,
      width: `${SIZE - 4}px`,
    },
    ':checked': { backgroundColor: vars.color.uiGreen, boxShadow: 'none' },
    ':checked::before': {
      boxShadow: thumbShadow('rgba(0,0,0,0.1)'),
      transform: `translateX(${OFFSET}px)`,
    },
    ':focus-visible': focusRing,
    ':disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
});

/** Toggle switch built on a native checkbox (`role="switch"`). */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { className, ...rest },
  ref,
) {
  const s = useStyles();
  return <input ref={ref} type="checkbox" role="switch" className={mergeClasses(s.root, className)} {...rest} />;
});
