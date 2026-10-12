/** Small, dependency-free date helpers. All dates are local-time calendar days. */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
};
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const isBefore = (a: Date, b: Date) => startOfDay(a).getTime() < startOfDay(b).getTime();
export const isAfter = (a: Date, b: Date) => startOfDay(a).getTime() > startOfDay(b).getTime();
export const isBetween = (d: Date, a: Date, b: Date) => !isBefore(d, a) && !isAfter(d, b);

/** `YYYY-MM-DD` in local time (what `<input type="date">` uses). */
export function toISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parse `YYYY-MM-DD` as a local date; returns null for invalid input. */
export function fromISODate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * The weeks (arrays of 7 dates) that cover `month`, starting on `weekStartsOn`
 * (0 = Sunday … 6 = Saturday). Includes leading/trailing days of neighbouring months.
 */
export function monthGrid(month: Date, weekStartsOn: number): Date[][] {
  const first = startOfMonth(month);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  const weeks: Date[][] = [];
  let cursor = start;
  do {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
    cursor = addDays(cursor, 7);
  } while (cursor.getMonth() === month.getMonth() || weeks.length < 4);
  return weeks;
}
