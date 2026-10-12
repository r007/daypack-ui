import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { MinusIcon, PlusIcon } from '../Icon/icons';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. */
  defaultValue?: number;
  /** Called with the new numeric value (clamped to `min`/`max`). */
  onValueChange?: (value: number) => void;
  /** Smallest allowed value. */
  min?: number;
  /** Largest allowed value. */
  max?: number;
  /**
   * Increment applied by the buttons and the arrow keys.
   * @default 1
   */
  step?: number;
  /**
   * Accessible labels of the buttons.
   * @default { decrement: 'Decrease', increment: 'Increase' }
   */
  buttonLabels?: { decrement: string; increment: string };
}

const useStyles = makeStyles({
  root: { alignItems: 'center', columnGap: '8px', display: 'inline-flex' },
  button: {
    alignItems: 'center',
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '100%',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    height: '40px',
    justifyContent: 'center',
    width: '40px',
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
    ':disabled': { cursor: 'not-allowed', opacity: 0.4 },
  },
  input: {
    appearance: 'textfield',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    color: vars.color.textPrimary,
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.heading7,
    fontWeight: vars.fontWeight.medium,
    height: '40px',
    textAlign: 'center',
    width: '64px',
    ':focus': { borderBottomColor: vars.color.linkPrimary, outlineStyle: 'none' },
    '::-webkit-outer-spin-button': { appearance: 'none' },
    '::-webkit-inner-spin-button': { appearance: 'none' },
  },
});

const clamp = (value: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, value));

/**
 * Numeric field with decrement/increment buttons, for guests, rooms,
 * quantities. Built on a native number input, so keyboard arrows, Page keys
 * and mobile numeric keypads work. Replaces `NumberInput` from the legacy form kit.
 *
 * @example
 * <NumberInput aria-label="Guests" min={1} max={8} defaultValue={2} />
 */
export function NumberInput({
  value,
  defaultValue = 0,
  onValueChange,
  min,
  max,
  step = 1,
  buttonLabels = { decrement: 'Decrease', increment: 'Increase' },
  className,
  disabled,
  ...rest
}: NumberInputProps) {
  const s = useStyles();
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;

  const commit = (next: number) => {
    const clamped = clamp(next, min, max);
    if (value === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  };

  return (
    <span className={mergeClasses(s.root, className)}>
      <button type="button" className={s.button} aria-label={buttonLabels.decrement} disabled={disabled || (min !== undefined && current <= min)} onClick={() => commit(current - step)}>
        <MinusIcon aria-hidden="true" />
      </button>
      <input
        {...rest}
        className={s.input}
        type="number"
        inputMode="numeric"
        value={Number.isNaN(current) ? '' : current}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => commit(event.target.value === '' ? NaN : Number(event.target.value))}
      />
      <button type="button" className={s.button} aria-label={buttonLabels.increment} disabled={disabled || (max !== undefined && current >= max)} onClick={() => commit(current + step)}>
        <PlusIcon aria-hidden="true" />
      </button>
    </span>
  );
}
