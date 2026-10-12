import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visible label. Without one, provide `aria-label`. */
  label?: React.ReactNode;
  /** Box size in px. */
  size?: 16 | 24 | 32;
  /** Round box; combine with `type="radio"` for radio buttons. */
  rounded?: boolean;
  type?: 'checkbox' | 'radio';
  /** Hide the box border while unchecked. */
  removeBorder?: boolean;
}

const check =
  "url(\"data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><path fill='white' d='M13.867 21.333c-0.267 0-0.667-0.133-0.8-0.4l-4.267-4.4 1.733-1.733 3.467 3.467 7.867-7.867 1.733 1.733-8.667 8.667c-0.533 0.4-0.8 0.533-1.067 0.533z'/></svg>",
  ) +
  '")';

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    color: vars.color.textPrimary,
    columnGap: '12px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: vars.font.sans,
    fontSize: '13px',
    lineHeight: 1,
    verticalAlign: 'top',
  },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
  box: {
    appearance: 'none',
    backgroundColor: 'transparent',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 50%, transparent)',
    borderRightColor: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 50%, transparent)',
    borderBottomColor: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 50%, transparent)',
    borderLeftColor: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 50%, transparent)',
    borderRadius: 0,
    boxSizing: 'border-box',
    cursor: 'inherit',
    flexShrink: 0,
    margin: 0,
    transitionProperty: 'background-color, border-color',
    transitionDuration: vars.duration.fast,
    ':checked': {
      backgroundColor: vars.color.linkPrimary,
      backgroundImage: check,
      borderTopColor: vars.color.linkPrimary,
      borderRightColor: vars.color.linkPrimary,
      borderBottomColor: vars.color.linkPrimary,
      borderLeftColor: vars.color.linkPrimary,
    },
    ':focus-visible': focusRing,
  },
  noBorder: {
    ':not(:checked)': {
      borderTopColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
    },
  },
  rounded: { borderRadius: '100%' },
});

/** Native checkbox or radio input with the design's custom box. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = 16, rounded = false, removeBorder = false, type = 'checkbox', className, style, disabled, ...rest },
  ref,
) {
  const s = useStyles();
  return (
    <label className={mergeClasses(s.root, disabled && s.disabled, className)} style={style}>
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={mergeClasses(s.box, rounded && s.rounded, removeBorder && s.noBorder)}
        style={{ width: size, height: size }}
        {...rest}
      />
      {label != null && <span>{label}</span>}
    </label>
  );
});
