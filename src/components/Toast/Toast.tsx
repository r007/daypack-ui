import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { focusRing } from '../../theme/focus';
import { CloseIcon, ToastErrorIcon, ToastInfoIcon, ToastSuccessIcon, ToastWarningIcon } from '../Icon/icons';

export type ToastType = 'error' | 'info' | 'success' | 'warning';

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Severity; sets color, icon and the live-region role (`error` is announced
   * assertively, the rest politely).
   * @default 'info'
   */
  type?: ToastType;
  /** Optional bold lead-in, e.g. "Saved". */
  title?: React.ReactNode;
  /** The message. */
  children: React.ReactNode;
  /** Label of an optional action button or link, e.g. "Undo". */
  actionLabel?: string;
  /** Called when the action is activated. */
  onAction?: () => void;
  /** Turn the action into a link to this URL. */
  actionHref?: string;
  /** Show a dismiss button and call this when it is pressed. */
  onClose?: () => void;
  /**
   * Accessible label of the dismiss button.
   * @default 'Dismiss'
   */
  closeLabel?: string;
}

const palette: Record<ToastType, { bg: string; fg: string }> = {
  error: { bg: vars.color.accentRed, fg: vars.color.textOverlay },
  info: { bg: vars.color.accentBlue, fg: vars.color.textPrimary },
  success: { bg: vars.color.accentGreen, fg: vars.color.textPrimary },
  warning: { bg: vars.color.accentYellow, fg: vars.color.textPrimary },
};

const icons = { error: ToastErrorIcon, info: ToastInfoIcon, success: ToastSuccessIcon, warning: ToastWarningIcon };

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    borderRadius: '4px',
    boxSizing: 'border-box',
    columnGap: '12px',
    display: 'flex',
    fontFamily: vars.font.sans,
    fontSize: '13px',
    fontWeight: vars.fontWeight.medium,
    lineHeight: 1.3,
    minHeight: '56px',
    paddingTop: '9px',
    paddingRight: '16px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    width: '100%',
    [media({ minWidth: 600 })]: { maxWidth: '540px' },
  },
  error: { backgroundColor: palette.error.bg, color: palette.error.fg },
  info: { backgroundColor: palette.info.bg, color: palette.info.fg },
  success: { backgroundColor: palette.success.bg, color: palette.success.fg },
  warning: { backgroundColor: palette.warning.bg, color: palette.warning.fg },
  icon: { flexShrink: 0, fontSize: '24px' },
  text: { flexGrow: 1, minWidth: 0 },
  title: { display: 'block', fontWeight: 600, textTransform: 'uppercase' },
  button: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    flexShrink: 0,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    paddingTop: '8px',
    paddingRight: '8px',
    paddingBottom: '8px',
    paddingLeft: '8px',
    textDecorationLine: 'underline',
    textTransform: 'uppercase',
    ':hover': { opacity: 0.8 },
    ':focus-visible': { ...focusRing, outlineColor: 'currentColor' },
  },
  close: {
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: '16px',
    height: '32px',
    justifyContent: 'center',
    textDecorationLine: 'none',
    width: '32px',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
});

/**
 * A short status message with optional action. Presentational: render it
 * yourself or let `ToastProvider` / `useToast` manage a queue.
 *
 * @example
 * <Toast type="success" title="Saved" actionLabel="Undo" onAction={undo}>Added to your trip.</Toast>
 */
export function Toast({
  type = 'info',
  title,
  children,
  actionLabel,
  onAction,
  actionHref,
  onClose,
  closeLabel = 'Dismiss',
  className,
  ...rest
}: ToastProps) {
  const s = useStyles();
  const Icon = icons[type];

  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={mergeClasses(s.root, s[type], className)} {...rest}>
      <Icon className={s.icon} />
      <div className={s.text}>
        {title && <strong className={s.title}>{title}</strong>}
        {children}
      </div>
      {actionLabel &&
        (actionHref ? (
          <a className={s.button} href={actionHref} onClick={onAction}>
            {actionLabel}
          </a>
        ) : (
          <button type="button" className={s.button} onClick={onAction}>
            {actionLabel}
          </button>
        ))}
      {onClose && (
        <button type="button" className={mergeClasses(s.button, s.close)} aria-label={closeLabel} onClick={onClose}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Queue

export interface ToastOptions {
  /** @default 'info' */
  type?: ToastType;
  title?: React.ReactNode;
  message: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  /**
   * Milliseconds before auto-dismiss; `null` keeps it until dismissed. The
   * timer pauses while the pointer or keyboard focus is on the toast.
   * @default 6000
   */
  duration?: number | null;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  /** Show a toast. Returns its id. */
  show: (options: ToastOptions) => number;
  /** Dismiss one toast by id. */
  dismiss: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

/** Access the toast queue. Must be used under `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>.');
  return ctx;
}

const useRegionStyles = makeStyles({
  region: {
    // Reset the UA [popover] box (centered, bordered, scrollable).
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    bottom: '16px',
    boxSizing: 'border-box',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    left: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    maxWidth: 'none',
    overflow: 'visible',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: 0,
    paddingBottom: 0,
    pointerEvents: 'none',
    position: 'fixed',
    right: 0,
    rowGap: '8px',
    top: 'auto',
    width: 'auto',
    zIndex: vars.zIndex.toast,
    '> *': { pointerEvents: 'auto' },
  },
});

function QueuedToast({ entry, onDismiss }: { entry: ToastEntry; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = React.useState(false);
  const duration = entry.duration === undefined ? 6000 : entry.duration;

  React.useEffect(() => {
    if (duration === null || paused) return undefined;
    const timer = setTimeout(() => onDismiss(entry.id), duration);
    return () => clearTimeout(timer);
  }, [duration, paused, entry.id, onDismiss]);

  return (
    <Toast
      type={entry.type}
      title={entry.title}
      actionLabel={entry.actionLabel}
      onAction={() => {
        entry.onAction?.();
        onDismiss(entry.id);
      }}
      onClose={() => onDismiss(entry.id)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {entry.message}
    </Toast>
  );
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /**
   * Cap on simultaneously visible toasts; the oldest is dropped first.
   * @default 3
   */
  max?: number;
  /**
   * Accessible name of the notifications region.
   * @default 'Notifications'
   */
  label?: string;
}

/**
 * Renders a fixed notifications region and provides `useToast()`.
 *
 * @example
 * const { show } = useToast();
 * show({ type: 'success', message: 'Trip saved' });
 */
export function ToastProvider({ children, max = 3, label = 'Notifications' }: ToastProviderProps) {
  const s = useRegionStyles();
  const regionRef = React.useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);

  // Promote the region to the top layer so toasts also appear above modal dialogs.
  const native = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
  React.useLayoutEffect(() => {
    const region = regionRef.current;
    if (native && region && !region.matches(':popover-open')) region.showPopover();
  }, [native]);
  const nextId = React.useRef(1);

  const dismiss = React.useCallback((id: number) => setToasts((all) => all.filter((t) => t.id !== id)), []);
  const show = React.useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { ...options, id }].slice(-max));
      return id;
    },
    [max],
  );

  const ctx = React.useMemo(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        ref={regionRef}
        role="region"
        aria-label={label}
        className={s.region}
        {...(native ? ({ popover: 'manual' } as Record<string, string>) : {})}
      >
        {toasts.map((entry) => (
          <QueuedToast key={entry.id} entry={entry} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
