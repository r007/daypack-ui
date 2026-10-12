import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/icons';
import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isBetween,
  isSameDay,
  monthGrid,
  startOfDay,
  startOfMonth,
} from '../_internal/date';

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

interface CommonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Month shown initially. Defaults to the selected date, or today. */
  defaultMonth?: Date;
  /** Earliest selectable day. */
  minDate?: Date;
  /** Latest selectable day. */
  maxDate?: Date;
  /** Return true for days that cannot be chosen (fully booked, closed…). */
  isDateDisabled?: (date: Date) => boolean;
  /**
   * BCP 47 locale for month and weekday names.
   * @default 'en'
   */
  locale?: string;
  /**
   * First day of the week: 0 = Sunday, 1 = Monday.
   * @default 0
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Accessible labels of the month buttons.
   * @default { previous: 'Previous month', next: 'Next month' }
   */
  labels?: { previous: string; next: string };
}

export type CalendarProps = CommonProps &
  (
    | {
        /** Select a single day. */
        mode?: 'single';
        value?: Date | null;
        defaultValue?: Date | null;
        onValueChange?: (value: Date) => void;
      }
    | {
        /** Select a start and end day. The first click sets the start, the second the end. */
        mode: 'range';
        value?: CalendarRange;
        defaultValue?: CalendarRange;
        onValueChange?: (value: CalendarRange) => void;
      }
  );

const useStyles = makeStyles({
  root: { color: vars.color.textPrimary, display: 'inline-block', fontFamily: vars.font.sans, maxWidth: '100%', width: '320px' },
  header: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  title: { fontSize: '16px', fontWeight: vars.fontWeight.medium, margin: 0 },
  nav: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '100%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    height: '40px',
    justifyContent: 'center',
    width: '40px',
    ':hover': { backgroundColor: vars.color.bgSecondary, color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
  table: { borderCollapse: 'collapse', tableLayout: 'fixed', width: '100%' },
  weekday: { color: vars.color.textLight, fontSize: '11px', fontWeight: vars.fontWeight.medium, height: '32px', textAlign: 'center', textTransform: 'uppercase' },
  cell: { padding: 0, textAlign: 'center' },
  day: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '100%',
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: '14px',
    height: '40px',
    justifyContent: 'center',
    width: '40px',
    ':hover': { backgroundColor: vars.color.bgSecondary },
    ':focus-visible': focusRing,
  },
  outside: { color: vars.color.textLight },
  today: { fontWeight: 700, textDecorationLine: 'underline' },
  inRange: { backgroundColor: vars.color.bgSecondary, borderRadius: 0 },
  selected: { backgroundColor: vars.color.linkPrimary, color: vars.color.textOverlay, ':hover': { backgroundColor: vars.color.linkPrimary } },
  disabled: { color: vars.color.borderLight, cursor: 'not-allowed', textDecorationLine: 'line-through', ':hover': { backgroundColor: 'transparent' } },
});

/**
 * Month calendar for choosing a day or a date range, e.g. availability or
 * check-in/out. Follows the ARIA grid pattern: arrow keys move by day and
 * week, PageUp/PageDown by month, Home/End to the week edges. No date library.
 *
 * For a plain date entry prefer `DateField` (native picker).
 *
 * @example
 * <Calendar mode="range" minDate={new Date()} onValueChange={({ start, end }) => …} />
 */
export function Calendar(props: CalendarProps) {
  const {
    defaultMonth,
    minDate,
    maxDate,
    isDateDisabled,
    locale = 'en',
    weekStartsOn = 0,
    labels = { previous: 'Previous month', next: 'Next month' },
    className,
    mode: _mode,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rest
  } = props as CommonProps & {
    mode?: 'single' | 'range';
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: unknown;
  };
  const s = useStyles();
  const isRange = props.mode === 'range';

  const [internal, setInternal] = React.useState<Date | null | CalendarRange>(() => {
    const initial = props.defaultValue;
    return initial ?? (isRange ? { start: null, end: null } : null);
  });
  const selected = props.value !== undefined ? props.value : internal;
  const single = !isRange ? ((selected as Date | null) ?? null) : null;
  const range = isRange ? (selected as CalendarRange) : null;

  const anchorDate = single ?? range?.start ?? new Date();
  const [month, setMonth] = React.useState(() => startOfMonth(defaultMonth ?? anchorDate));
  const [focusDate, setFocusDate] = React.useState<Date>(() => startOfDay(single ?? range?.start ?? defaultMonth ?? new Date()));
  const [hover, setHover] = React.useState<Date | null>(null);
  const gridRef = React.useRef<HTMLTableElement>(null);
  const shouldFocus = React.useRef(false);

  const today = startOfDay(new Date());
  const disabled = (d: Date) => (minDate && isBefore(d, minDate)) || (maxDate && isAfter(d, maxDate)) || isDateDisabled?.(d) || false;

  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  const dayLabel = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const weeks = monthGrid(month, weekStartsOn);
  const weekdays = weeks[0]!.map((d) => ({ long: weekdayLong.format(d), short: weekdayShort.format(d) }));

  const moveFocus = (next: Date) => {
    shouldFocus.current = true;
    setFocusDate(next);
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) setMonth(startOfMonth(next));
  };

  React.useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  });

  const choose = (date: Date) => {
    if (disabled(date)) return;
    setFocusDate(date);
    if (!isRange) {
      if (props.value === undefined) setInternal(date);
      (props.onValueChange as ((v: Date) => void) | undefined)?.(date);
      return;
    }
    const current = range ?? { start: null, end: null };
    let next: CalendarRange;
    if (!current.start || current.end) next = { start: date, end: null };
    else if (isBefore(date, current.start)) next = { start: date, end: null };
    else next = { start: current.start, end: date };
    if (props.value === undefined) setInternal(next);
    (props.onValueChange as ((v: CalendarRange) => void) | undefined)?.(next);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in step) {
      event.preventDefault();
      moveFocus(addDays(focusDate, step[event.key]!));
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
      moveFocus(addMonths(focusDate, (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1)));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const offset = (focusDate.getDay() - weekStartsOn + 7) % 7;
      moveFocus(addDays(focusDate, event.key === 'Home' ? -offset : 6 - offset));
    }
  };

  const titleId = React.useId();

  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      <div className={s.header}>
        <button type="button" className={s.nav} aria-label={labels.previous} onClick={() => setMonth(addMonths(month, -1))}>
          <ChevronLeftIcon />
        </button>
        <h2 id={titleId} className={s.title} aria-live="polite">
          {monthFormat.format(month)}
        </h2>
        <button type="button" className={s.nav} aria-label={labels.next} onClick={() => setMonth(addMonths(month, 1))}>
          <ChevronRightIcon />
        </button>
      </div>
      <table ref={gridRef} role="grid" aria-labelledby={titleId} className={s.table} onKeyDown={onKeyDown}>
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th key={weekday.long} scope="col" abbr={weekday.long} className={s.weekday}>
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]!.toISOString()}>
              {week.map((date) => {
                const outside = date.getMonth() !== month.getMonth();
                const isSelected = single ? isSameDay(date, single) : !!range && (isSameDay(date, range.start) || isSameDay(date, range.end));
                const previewEnd = range?.start && !range.end ? hover : null;
                const rangeEnd = range?.end ?? previewEnd;
                const inRange = !!range?.start && !!rangeEnd && !isBefore(rangeEnd, range.start) && isBetween(date, range.start, rangeEnd) && !isSelected;
                const isDisabled = !!disabled(date);
                const isFocus = isSameDay(date, focusDate);
                return (
                  <td key={date.toISOString()} role="gridcell" aria-selected={isSelected || undefined} className={mergeClasses(s.cell, inRange && s.inRange)}>
                    <button
                      type="button"
                      tabIndex={isFocus ? 0 : -1}
                      aria-label={dayLabel.format(date)}
                      aria-current={isSameDay(date, today) ? 'date' : undefined}
                      aria-disabled={isDisabled || undefined}
                      className={mergeClasses(s.day, outside && s.outside, isSameDay(date, today) && s.today, isSelected && s.selected, isDisabled && s.disabled)}
                      onClick={() => choose(date)}
                      onMouseEnter={() => setHover(date)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setFocusDate(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
