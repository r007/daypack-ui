import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { FloatingPanel } from '../_internal/Floating';
import type { Placement } from '../_internal/position';

export interface TooltipProps {
  /** Short, non-interactive text describing the trigger. */
  content: React.ReactNode;
  /**
   * The element the tooltip describes. Must be a single element that accepts
   * `ref`, event handlers and `aria-describedby` (any native element or
   * forwardRef component).
   */
  children: React.ReactElement<Record<string, unknown>>;
  /**
   * Preferred side and alignment; flips automatically when there is no room.
   * @default 'top'
   */
  placement?: Placement;
  /**
   * Milliseconds to wait before showing on hover. Focus shows it immediately.
   * @default 150
   */
  delay?: number;
  /**
   * Controlled visibility. Leave undefined for the default hover/focus behaviour.
   */
  open?: boolean;
  className?: string;
}

const useStyles = makeStyles({
  tooltip: {
    backgroundColor: vars.color.textPrimary,
    borderRadius: '4px',
    boxSizing: 'border-box',
    color: vars.color.textOverlay,
    fontFamily: vars.font.sans,
    fontSize: '13px',
    fontWeight: vars.fontWeight.regular,
    lineHeight: 1.3,
    maxWidth: '260px',
    paddingTop: '6px',
    paddingRight: '10px',
    paddingBottom: '6px',
    paddingLeft: '10px',
    pointerEvents: 'auto',
  },
});

function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = value;
}

/**
 * Text label shown on hover and keyboard focus.
 *
 * Meets WCAG 1.4.13: it is dismissible with Esc, hoverable (the pointer can
 * move onto it) and persistent until dismissed. It is announced as the
 * trigger's description, so never put essential information or interactive
 * controls inside; use `Popover` for those.
 *
 * @example
 * <Tooltip content="Save to trip"><button aria-label="Save"><BookmarkIcon /></button></Tooltip>
 */
export function Tooltip({ content, children, placement = 'top', delay = 150, open: controlledOpen, className }: TooltipProps) {
  const s = useStyles();
  const id = React.useId();
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = controlledOpen ?? ((hovered || focused) && !dismissed);

  const schedule = (action: () => void, wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(action, wait);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const child = React.Children.only(children);
  const childProps = child.props as Record<string, unknown> & { ref?: React.Ref<HTMLElement> };
  const childRef = childProps.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;
  const call = (name: string, event: unknown) => (childProps[name] as ((e: unknown) => void) | undefined)?.(event);

  const enter = () => schedule(() => setHovered(true), delay);
  const leave = () => schedule(() => { setHovered(false); setDismissed(false); }, 100);

  const trigger = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      setRef(childRef, node);
    },
    'aria-describedby': [childProps['aria-describedby'], id].filter(Boolean).join(' '),
    onMouseEnter: (e: unknown) => { call('onMouseEnter', e); enter(); },
    onMouseLeave: (e: unknown) => { call('onMouseLeave', e); leave(); },
    onFocus: (e: unknown) => { call('onFocus', e); clearTimeout(timer.current); setFocused(true); },
    onBlur: (e: unknown) => { call('onBlur', e); setFocused(false); setDismissed(false); },
    onKeyDown: (e: React.KeyboardEvent) => {
      call('onKeyDown', e);
      if (e.key === 'Escape' && open) setDismissed(true);
    },
  });

  return (
    <>
      {trigger}
      <FloatingPanel
        id={id}
        role="tooltip"
        mode="manual"
        anchorRef={anchorRef}
        open={open}
        placement={placement}
        arrow
        className={mergeClasses(s.tooltip, className)}
        // Hoverable: keep open while the pointer is over the tooltip itself.
        onMouseEnter={() => clearTimeout(timer.current)}
        onMouseLeave={leave}
      >
        {content}
      </FloatingPanel>
    </>
  );
}
