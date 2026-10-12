import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { Input } from '../Input';
import { fromISODate, toISODate } from '../_internal/date';

export interface DateFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'> {
  /** Controlled date. */
  value?: Date | null;
  /** Initial date when uncontrolled. */
  defaultValue?: Date | null;
  /** Called with the chosen date, or `null` when cleared. */
  onValueChange?: (value: Date | null) => void;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
}

/**
 * Date entry on the native `<input type="date">`: the platform's own,
 * localized and accessible picker, no calendar library. Works with `Date`
 * objects instead of strings.
 *
 * @example
 * <DateField aria-label="Check-in" min={new Date()} onValueChange={setCheckIn} />
 */
export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(function DateField(
  { value, defaultValue, onValueChange, min, max, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  return (
    <Input
      {...rest}
      ref={ref}
      type="date"
      min={min ? toISODate(min) : undefined}
      max={max ? toISODate(max) : undefined}
      {...(controlled ? { value: value ? toISODate(value) : '' } : { defaultValue: defaultValue ? toISODate(defaultValue) : undefined })}
      onChange={(event) => onValueChange?.(fromISODate(event.target.value))}
    />
  );
});

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangeFieldProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue' | 'value'> {
  /** Accessible name of the group ("Dates"). */
  label: string;
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  min?: Date;
  max?: Date;
  /**
   * Labels of the two fields.
   * @default { start: 'Start date', end: 'End date' }
   */
  fieldLabels?: { start: string; end: string };
}

const useStyles = makeStyles({
  group: { borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, columnGap: '24px', display: 'flex', margin: 0, minWidth: 0, padding: 0 },
  legend: { clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', width: '1px' },
});

/**
 * Start and end date pair. The end field's minimum follows the start, and the
 * end is cleared if the start moves past it.
 *
 * @example
 * <DateRangeField label="Travel dates" onValueChange={({ start, end }) => search(start, end)} />
 */
export function DateRangeField({
  label,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  fieldLabels = { start: 'Start date', end: 'End date' },
  className,
  ...rest
}: DateRangeFieldProps) {
  const s = useStyles();
  const [internal, setInternal] = React.useState<DateRange>(defaultValue ?? { start: null, end: null });
  const current = value ?? internal;

  const commit = (next: DateRange) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset className={mergeClasses(s.group, className)} {...rest}>
      <legend className={s.legend}>{label}</legend>
      <DateField
        aria-label={fieldLabels.start}
        value={current.start}
        min={min}
        max={current.end ?? max}
        onValueChange={(start) => commit({ start, end: start && current.end && current.end < start ? null : current.end })}
      />
      <DateField
        aria-label={fieldLabels.end}
        value={current.end}
        min={current.start ?? min}
        max={max}
        onValueChange={(end) => commit({ start: current.start, end })}
      />
    </fieldset>
  );
}
