import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export interface TimestampProps extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'dateTime' | 'children'> {
  /** The moment to show. A `Date`, an ISO string, or epoch milliseconds. */
  date: Date | string | number;
  /**
   * `relative` ("3 days ago"), `date` ("17 Jan 2026"), or `datetime`.
   * @default 'relative'
   */
  format?: 'relative' | 'date' | 'datetime';
  /**
   * BCP 47 locale for formatting.
   * @default 'en'
   */
  locale?: string;
  /**
   * Reference "now" for relative formatting; mainly for tests and SSR consistency.
   * @default Date.now()
   */
  now?: Date | number;
  /** Replace the generated text, keeping the machine-readable `dateTime`. */
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  root: { ...typography.uppercase(), color: vars.color.textLight },
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
];

/** Format a time difference ("3 days ago", "in 2 hours") with `Intl.RelativeTimeFormat`. */
export function formatRelative(date: Date, now: Date, locale = 'en'): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const abs = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, size] of UNITS) {
    if (abs >= size || unit === 'second') return formatter.format(Math.trunc(seconds / size), unit);
  }
  return formatter.format(0, 'second');
}

/**
 * A `<time>` element with a localized, human-readable label.
 *
 * @example
 * <Timestamp date="2026-01-17T10:00:00Z" />          // "3 days ago"
 * <Timestamp date="2026-01-17" format="date" />      // "17 Jan 2026"
 */
export function Timestamp({
  date,
  format = 'relative',
  locale = 'en',
  now,
  children,
  className,
  ...rest
}: TimestampProps) {
  const s = useStyles();
  const value = date instanceof Date ? date : new Date(date);
  const valid = !Number.isNaN(value.getTime());

  let text: React.ReactNode = children;
  if (children === undefined && valid) {
    if (format === 'relative') text = formatRelative(value, now === undefined ? new Date() : new Date(now), locale);
    else if (format === 'date') text = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(value);
    else text = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(value);
  }

  return (
    <time className={mergeClasses(s.root, className)} dateTime={valid ? value.toISOString() : undefined} {...rest}>
      {text}
    </time>
  );
}

export interface LastUpdatedProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** When the content was last changed. */
  date: Date | string | number;
  /** Adds a "Suggest an edit" link to this URL. */
  editUrl?: string;
  /**
   * Text of the edit link.
   * @default 'Suggest an edit'
   */
  editLabel?: string;
  /** @default 'en' */
  locale?: string;
}

const useLastUpdatedStyles = makeStyles({
  root: {
    color: vars.color.textSecondary,
    fontFamily: vars.font.serif,
    fontSize: '16px',
    fontStyle: 'italic',
    lineHeight: 1.25,
    margin: 0,
  },
});

/**
 * "Last updated 17 Jan 2026. Suggest an edit." line for articles and guides.
 */
export function LastUpdated({ date, editUrl, editLabel = 'Suggest an edit', locale = 'en', className, ...rest }: LastUpdatedProps) {
  const s = useLastUpdatedStyles();
  const value = date instanceof Date ? date : new Date(date);
  const valid = !Number.isNaN(value.getTime());
  return (
    <p className={mergeClasses(s.root, className)} {...rest}>
      Last updated{' '}
      {valid ? (
        <time dateTime={value.toISOString()}>{new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(value)}</time>
      ) : null}
      .{editUrl && <> <a href={editUrl}>{editLabel}</a>.</>}
    </p>
  );
}
