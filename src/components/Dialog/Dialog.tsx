import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { focusRing } from '../../theme/focus';
import { typography } from '../../theme/typography';
import { CloseIcon } from '../Icon/icons';
import { lockScroll, unlockScroll } from '../_internal/scrollLock';

export interface DialogProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'onClose' | 'role'> {
  /** Whether the dialog is shown. You own this state; update it in `onClose`. */
  open: boolean;
  /**
   * Called when the user asks to close: Esc, the close button, or (if
   * `dismissible`) a click on the backdrop.
   */
  onClose: () => void;
  /** Heading. Strongly recommended: it becomes the dialog's accessible name. */
  title?: React.ReactNode;
  /**
   * Semantic level of the title.
   * @default 2
   */
  titleLevel?: 2 | 3 | 4 | 5 | 6;
  /**
   * `dialog` for general content; `alertdialog` for urgent confirmations that
   * need a response (screen readers announce the message immediately).
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
  /**
   * Width. `small` 410px, `medium` 640px, `large` 860px, `fullscreen` fills the viewport.
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /**
   * Text alignment of title and content.
   * @default 'start'
   */
  align?: 'start' | 'center';
  /**
   * Close when the backdrop is clicked. Turn off for forced choices.
   * @default true
   */
  dismissible?: boolean;
  /**
   * Render a close button in the corner.
   * @default true
   */
  showClose?: boolean;
  /**
   * Accessible label of the close button.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Buttons shown below the content, stacked and full width.
   * Put the primary action first.
   */
  actions?: React.ReactNode;
  /**
   * Element that receives focus when the dialog opens. By default the dialog
   * itself is focused, so screen readers announce its title first and a
   * destructive action is never focused by accident.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const useStyles = makeStyles({
  dialog: {
    backgroundColor: vars.color.bgPrimary,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '4px',
    boxShadow: `0 20px 60px color-mix(in srgb, ${vars.color.shadowPrimary} 30%, transparent)`,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    maxHeight: 'calc(100dvh - 32px)',
    maxWidth: 'calc(100vw - 32px)',
    outlineStyle: 'none',
    overflow: 'auto',
    padding: 0,
    position: 'fixed',
    width: '100%',
    '::backdrop': { backgroundColor: 'color-mix(in srgb, ' + vars.color.bgOverlay + ' 60%, transparent)' },
  },
  small: { maxWidth: 'min(410px, calc(100vw - 32px))' },
  medium: { maxWidth: 'min(640px, calc(100vw - 32px))' },
  large: { maxWidth: 'min(860px, calc(100vw - 32px))' },
  fullscreen: { borderRadius: 0, height: '100dvh', maxHeight: 'none', maxWidth: 'none', width: '100vw' },
  inner: {
    boxSizing: 'border-box',
    paddingTop: '48px',
    paddingRight: '24px',
    paddingBottom: '32px',
    paddingLeft: '24px',
    position: 'relative',
    [media({ minWidth: 600 })]: { paddingRight: '48px', paddingLeft: '48px' },
  },
  center: { textAlign: 'center' },
  title: { ...typography.heading(6, 'medium'), color: vars.color.textPrimary, margin: 0, marginBottom: '16px', paddingRight: '24px' },
  titleCenter: { paddingLeft: '24px' },
  body: { ...typography.bodySmall() },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '40px',
    maxWidth: '100%',
    rowGap: '16px',
  },
  close: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '20px',
    height: '44px',
    justifyContent: 'center',
    position: 'absolute',
    right: '4px',
    top: '4px',
    width: '44px',
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
});

/**
 * Modal dialog on the native `<dialog>` element: focus is trapped and
 * restored, the rest of the page is inert, Esc closes, and it renders in the
 * top layer, so no portal or z-index management is needed.
 *
 * `children` are only mounted while open.
 *
 * @example
 * <Dialog open={open} onClose={() => setOpen(false)} title="Delete trip?"
 *   actions={<><Button color="red" onClick={remove}>Delete</Button><Button color="gray" onClick={() => setOpen(false)}>Cancel</Button></>}>
 *   This can't be undone.
 * </Dialog>
 */
export function Dialog({
  open,
  onClose,
  title,
  titleLevel = 2,
  role = 'dialog',
  size = 'small',
  align = 'start',
  dismissible = true,
  showClose = true,
  closeLabel = 'Close',
  actions,
  initialFocusRef,
  className,
  children,
  onClick,
  ...rest
}: DialogProps) {
  const s = useStyles();
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const Title = `h${titleLevel}` as const;

  // Keep the native element in sync with the `open` prop.
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      // showModal() would focus the first focusable child (the close button).
      (initialFocusRef?.current ?? dialog).focus();
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
    if (!open) return undefined;
    lockScroll();
    return unlockScroll;
    // `initialFocusRef` is only read at the moment of opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Esc fires `cancel`; let the parent own the state instead of closing natively.
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      role={role}
      tabIndex={-1}
      aria-labelledby={title ? titleId : undefined}
      className={mergeClasses(s.dialog, s[size], className)}
      onClick={(event) => {
        onClick?.(event);
        // A click on the backdrop targets the <dialog> itself, not its content.
        if (dismissible && event.target === event.currentTarget) onClose();
      }}
      {...rest}
    >
      {open && (
        <div className={mergeClasses(s.inner, align === 'center' && s.center)}>
          {showClose && (
            <button type="button" className={s.close} aria-label={closeLabel} onClick={onClose}>
              <CloseIcon />
            </button>
          )}
          {title && (
            <Title id={titleId} className={mergeClasses(s.title, align === 'center' && s.titleCenter)}>
              {title}
            </Title>
          )}
          <div className={s.body}>{children}</div>
          {actions && <div className={s.actions}>{actions}</div>}
        </div>
      )}
    </dialog>
  );
}
