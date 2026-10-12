import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  /** Optional icon placed before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'> {
  /** Accessible name of the group (rendered as a visually hidden legend). */
  label: string;
  options: SegmentedOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initially selected value (uncontrolled). Defaults to the first option. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Name of the underlying radio inputs, so the control participates in forms.
   */
  name?: string;
}

const useStyles = makeStyles({
  root: { borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, display: 'inline-flex', margin: 0, minWidth: 0, padding: 0 },
  legend: { clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', width: '1px' },
  group: {
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '4px',
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
    display: 'inline-flex',
    overflow: 'hidden',
  },
  option: {
    ...typography.uppercase(),
    alignItems: 'center',
    backgroundColor: vars.color.bgPrimary,
    color: vars.color.textPrimary,
    columnGap: '8px',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    minHeight: '40px',
    paddingLeft: '16px',
    paddingRight: '16px',
    position: 'relative',
    ':hover': { backgroundColor: vars.color.bgSecondary },
    ':has(:focus-visible)': { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: vars.color.linkPrimary, outlineOffset: '-2px' },
  },
  selected: { backgroundColor: vars.color.linkPrimary, color: vars.color.textOverlay, ':hover': { backgroundColor: vars.color.linkPrimary } },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
  input: { clipPath: 'inset(50%)', height: '1px', margin: 0, overflow: 'hidden', position: 'absolute', width: '1px' },
});

/**
 * Compact single-choice switcher (view mode, category filter) built from
 * native radio inputs: arrow keys, form submission and screen-reader semantics
 * come for free. Replaces `TypeSelector`.
 *
 * @example
 * <SegmentedControl label="View" options={[{ value: 'list', label: 'List' }, { value: 'map', label: 'Map' }]} />
 */
export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  className,
  ...rest
}: SegmentedControlProps) {
  const s = useStyles();
  const generated = React.useId();
  const groupName = name ?? generated;
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value);
  const selected = value ?? internal;

  return (
    <fieldset role="radiogroup" className={mergeClasses(s.root, className)} {...rest}>
      <legend className={s.legend}>{label}</legend>
      <div className={s.group}>
        {options.map((option) => (
          <label key={option.value} className={mergeClasses(s.option, selected === option.value && s.selected, option.disabled && s.disabled)}>
            <input
              className={s.input}
              type="radio"
              name={groupName}
              value={option.value}
              checked={selected === option.value}
              disabled={option.disabled}
              onChange={() => {
                if (value === undefined) setInternal(option.value);
                onValueChange?.(option.value);
              }}
            />
            {option.icon}
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
