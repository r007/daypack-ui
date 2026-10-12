import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { computePosition, type Placement } from './position';

const supportsPopover = () => typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

const useStyles = makeStyles({
  panel: {
    // Reset the UA popover styles (centered, auto margins) and position by hand.
    inset: 'auto',
    margin: 0,
    position: 'fixed',
    overflow: 'visible',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  arrow: {
    backgroundColor: 'inherit',
    height: '8px',
    position: 'absolute',
    transform: 'rotate(45deg)',
    width: '8px',
  },
});

export interface FloatingPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The element the panel is positioned against. */
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  placement?: Placement;
  /** Gap to the anchor in px. */
  offset?: number;
  /**
   * `auto` gives light dismiss (outside click, Esc) from the browser and reports
   * it through `onDismiss`; `manual` leaves closing entirely to the caller.
   */
  mode?: 'auto' | 'manual';
  /** Called when the browser closes the popover (light dismiss). */
  onDismiss?: () => void;
  arrow?: boolean;
  children: React.ReactNode;
}

/**
 * Top-layer panel anchored to another element. Uses the Popover API so it is
 * never clipped by `overflow` or stacked under other content, and positions
 * itself with a small flip/shift algorithm.
 */
export const FloatingPanel = React.forwardRef<HTMLDivElement, FloatingPanelProps>(function FloatingPanel(
  { anchorRef, open, placement = 'bottom', offset = 8, mode = 'auto', onDismiss, arrow = false, className, children, ...rest },
  forwardedRef,
) {
  const s = useStyles();
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLSpanElement | null>(null);
  const native = supportsPopover();

  const setRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const place = React.useCallback(() => {
    const panel = panelRef.current;
    const anchor = anchorRef.current;
    if (!panel || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const result = computePosition({
      anchor: rect,
      floating: { width: panel.offsetWidth, height: panel.offsetHeight },
      placement,
      offset,
      viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
    });
    panel.style.left = `${result.x}px`;
    panel.style.top = `${result.y}px`;
    panel.dataset.side = result.side;

    const el = arrowRef.current;
    if (el) {
      el.style.top = el.style.bottom = el.style.left = el.style.right = '';
      if (result.side === 'top') Object.assign(el.style, { bottom: '-4px', left: `${result.arrow - 4}px` });
      else if (result.side === 'bottom') Object.assign(el.style, { top: '-4px', left: `${result.arrow - 4}px` });
      else if (result.side === 'left') Object.assign(el.style, { right: '-4px', top: `${result.arrow - 4}px` });
      else Object.assign(el.style, { left: '-4px', top: `${result.arrow - 4}px` });
    }
  }, [anchorRef, placement, offset]);

  // Show/hide through the Popover API, then position once it has a size.
  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (native) {
      const isOpen = panel.matches(':popover-open');
      if (open && !isOpen) panel.showPopover();
      else if (!open && isOpen) panel.hidePopover();
    }
    if (open) place();
  }, [open, native, place, children]);

  // Keep it attached while scrolling or resizing.
  React.useEffect(() => {
    if (!open) return undefined;
    const update = () => place();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, place]);

  // Light dismiss performed by the browser.
  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !native) return undefined;
    const onToggle = (event: Event) => {
      if ((event as ToggleEvent).newState === 'closed') onDismiss?.();
    };
    panel.addEventListener('toggle', onToggle);
    return () => panel.removeEventListener('toggle', onToggle);
  }, [native, onDismiss]);

  return (
    <div
      ref={setRef}
      // Only opt in to the Popover API where it exists; elsewhere the panel is a
      // plain fixed-position element toggled with `hidden`.
      {...(native ? ({ popover: mode } as Record<string, string>) : {})}
      hidden={!native && !open}
      className={mergeClasses(s.panel, className)}
      {...rest}
    >
      {children}
      {arrow && <span ref={arrowRef} aria-hidden="true" className={s.arrow} />}
    </div>
  );
});
