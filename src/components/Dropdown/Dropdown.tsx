import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

export type DropdownOption = string | { value: string; label: string; disabled?: boolean };

export interface DropdownProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  /**
   * Plain strings (used as both value and label) or `{ value, label, disabled? }` objects.
   * Values must be unique.
   */
  options: DropdownOption[];
  /** `small` uses 11px semibold text. Omit for the default 13px. */
  size?: 'small';
}

const chevron = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='#2c3643'><path d='M28.8 6.2l-12.8 12.8-12.8-12.8-3.2 3.2 16 16.4 16-16.4z'/></svg>",
);

const useStyles = makeStyles({
  root: {
    appearance: 'none',
    backgroundColor: vars.color.bgPrimary,
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,${chevron}")`,
    backgroundPosition: `calc(100% - ${1 / 13}em) 50%`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${7 / 13}em`,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: vars.color.textPrimary,
    cursor: 'pointer',
    fontFamily: vars.font.sans,
    fontSize: '13px',
    lineHeight: 1,
    paddingTop: `${10 / 13}em`,
    paddingRight: `${10 / 13}em`,
    paddingBottom: `${7 / 13}em`,
    paddingLeft: `${1 / 13}em`,
    transitionProperty: 'opacity',
    transitionDuration: vars.duration.fast,
    ':hover': { opacity: 0.7 },
    ':focus-visible': { ...focusRing, opacity: 0.7 },
  },
  small: { fontSize: '11px', fontWeight: 600 },
});

/**
 * Styled native `<select>`: full keyboard, mobile picker and form support.
 * Accepts every `<select>` attribute (`value`/`defaultValue`, `onChange`, `name`, …).
 * Provide a visible label or `aria-label`.
 *
 * @example
 * <Dropdown aria-label="Sort by" options={['Popular', { value: 'new', label: 'Newest' }]} />
 */
export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(function Dropdown(
  { options, size, className, ...rest },
  ref,
) {
  const s = useStyles();
  return (
    <select ref={ref} className={mergeClasses(s.root, size === 'small' && s.small, className)} {...rest}>
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        return (
          <option key={opt.value} value={opt.value} disabled={'disabled' in opt ? opt.disabled : undefined}>
            {opt.label}
          </option>
        );
      })}
    </select>
  );
});
