export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Placement = Side | `${Side}-start` | `${Side}-end`;

export interface Box {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface PositionInput {
  /** Viewport-relative rectangle of the element being anchored to. */
  anchor: Box;
  /** Size of the floating element. */
  floating: { width: number; height: number };
  placement: Placement;
  /** Gap between anchor and floating element. */
  offset?: number;
  viewport: { width: number; height: number };
  /** Minimum distance kept from the viewport edges. */
  margin?: number;
}

export interface PositionResult {
  /** Viewport-relative left/top for `position: fixed`. */
  x: number;
  y: number;
  /** Side actually used, after flipping. */
  side: Side;
  /** Distance of the anchor's center from the floating element's start edge (for arrows). */
  arrow: number;
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/**
 * Compute where a floating element should sit relative to its anchor:
 * flips to the opposite side when there's no room, and slides along the edge
 * to stay inside the viewport.
 */
export function computePosition({
  anchor,
  floating,
  placement,
  offset = 8,
  viewport,
  margin = 8,
}: PositionInput): PositionResult {
  const [preferred, align] = placement.split('-') as [Side, 'start' | 'end' | undefined];
  const vertical = preferred === 'top' || preferred === 'bottom';

  const space: Record<Side, number> = {
    top: anchor.top - margin,
    bottom: viewport.height - anchor.bottom - margin,
    left: anchor.left - margin,
    right: viewport.width - anchor.right - margin,
  };
  const needed = (vertical ? floating.height : floating.width) + offset;
  const side = space[preferred] < needed && space[OPPOSITE[preferred]] > space[preferred] ? OPPOSITE[preferred] : preferred;
  const isVertical = side === 'top' || side === 'bottom';

  let x: number;
  let y: number;
  let arrow: number;

  if (isVertical) {
    y = side === 'top' ? anchor.top - offset - floating.height : anchor.bottom + offset;
    const start =
      align === 'start' ? anchor.left : align === 'end' ? anchor.right - floating.width : anchor.left + anchor.width / 2 - floating.width / 2;
    x = clamp(start, margin, viewport.width - floating.width - margin);
    arrow = clamp(anchor.left + anchor.width / 2 - x, 12, Math.max(12, floating.width - 12));
  } else {
    x = side === 'left' ? anchor.left - offset - floating.width : anchor.right + offset;
    const start =
      align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - floating.height : anchor.top + anchor.height / 2 - floating.height / 2;
    y = clamp(start, margin, viewport.height - floating.height - margin);
    arrow = clamp(anchor.top + anchor.height / 2 - y, 12, Math.max(12, floating.height - 12));
  }

  return { x, y, side, arrow };
}
