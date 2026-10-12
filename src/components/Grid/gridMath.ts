// 12-column grid: 80px columns with 30px gutters (1290px container).
const COLUMNS = 12;
const COLUMN_WIDTH = 80;
const GUTTER_WIDTH = 30;
const CONTAINER_WIDTH = COLUMNS * COLUMN_WIDTH + (COLUMNS - 1) * GUTTER_WIDTH;

const round = (n: number) => Math.round(n * 10000) / 10000;

const spanPx = (columns: number) => columns * COLUMN_WIDTH + (columns - 1) * GUTTER_WIDTH;

/** Width of `columns` columns (and their inner gutters). */
export function span(columns: number, fluid: boolean): string {
  const px = spanPx(columns);
  return fluid ? `${round((px / CONTAINER_WIDTH) * 100)}%` : `${px}px`;
}

/** Width of one gutter. */
export function gutter(fluid: boolean): string {
  return fluid ? `${round((GUTTER_WIDTH / CONTAINER_WIDTH) * 100)}%` : `${GUTTER_WIDTH}px`;
}

/** `shift` columns plus the gutter after them, plus optional extra gutters. */
export function shiftOffset(shift: number, fluid: boolean, extraGutters = 0): string {
  const px = spanPx(shift) + GUTTER_WIDTH * (1 + extraGutters);
  return fluid ? `${round((px / CONTAINER_WIDTH) * 100)}%` : `${px}px`;
}
