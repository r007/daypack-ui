import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { FloatingPanel } from '../_internal/Floating';
import type { Placement } from '../_internal/position';

export interface PopoverProps {
  /**
   * The button (or other focusable element) that toggles the popover. It gets
   * `aria-expanded`, `aria-controls` and a click handler. Must accept `ref`.
   */
  children: React.ReactElement<Record<string, unknown>>;
  /** Content of the panel. May contain interactive elements such as links and buttons. */
  content: React.ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /**
   * Initial state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the user opens or closes the popover (trigger click, Esc, click outside). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Preferred side and alignment; flips automatically when there is no room.
   * @default 'bottom-start'
   */
  placement?: Placement;
  /**
   * Draw a small arrow pointing at the trigger.
   * @default false
   */
  arrow?: boolean;
  /**
   * Remove the default inner padding, e.g. when the content is a list that supplies its own.
   * @default false
   */
  flush?: boolean;
  /** Accessible name of the panel. Set when the trigger's text is not descriptive enough. */
  'aria-label'?: string;
  className?: string;
}

const useStyles = makeStyles({
  panel: {
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '4px',
    boxShadow: `0 2px 13px color-mix(in srgb, ${vars.color.shadowPrimary} 20%, transparent)`,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    fontFamily: vars.font.sans,
    fontSize: '14px',
    lineHeight: 1.4,
    maxWidth: 'min(360px, calc(100vw - 16px))',
    paddingTop: '12px',
    paddingRight: '16px',
    paddingBottom: '12px',
    paddingLeft: '16px',
  },
  flush: { padding: 0 },
});

/**
 * Click-toggled panel anchored to a trigger, for menus, share options and
 * filters. Rendered in the browser's top layer, so it is never clipped by
 * `overflow` or covered by other content. Esc and clicking outside close it
 * and focus returns to the trigger.
 *
 * @example
 * <Popover content={<ShareLinks />}><Button>Share</Button></Popover>
 */
export function Popover({
  children,
  content,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  arrow = false,
  flush = false,
  className,
  ...rest
}: PopoverProps) {
  const s = useStyles();
  const id = React.useId();
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = controlledOpen ?? internal;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setInternal(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  const child = React.Children.only(children);
  const childProps = child.props as Record<string, unknown> & { ref?: React.Ref<HTMLElement> };
  const childRef = childProps.ref ?? (child as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  const trigger = React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      anchorRef.current = node;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef) (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    'aria-expanded': open,
    'aria-controls': id,
    'aria-haspopup': 'dialog',
    onClick: (e: React.MouseEvent) => {
      (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
      if (!e.defaultPrevented) setOpen(!open);
    },
  });

  return (
    <>
      {trigger}
      <FloatingPanel
        id={id}
        role="dialog"
        mode="auto"
        anchorRef={anchorRef}
        open={open}
        placement={placement}
        arrow={arrow}
        // Light dismiss that came from the browser (outside click / Esc).
        onDismiss={() => open && setOpen(false)}
        className={mergeClasses(s.panel, flush && s.flush, className)}
        {...rest}
      >
        {content}
      </FloatingPanel>
    </>
  );
}
