import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../Icon/icons';
import { lockScroll, unlockScroll } from '../_internal/scrollLock';

export interface Photo {
  /** Full-size image URL. */
  src: string;
  /** Text alternative. Describe the picture. */
  alt: string;
  /** Smaller image for the grid; defaults to `src`. */
  thumbSrc?: string;
  /** Caption shown under the photo in the lightbox. */
  caption?: React.ReactNode;
}

export interface LightboxProps {
  photos: Photo[];
  /** Whether the lightbox is shown. */
  open: boolean;
  /** Index of the photo being shown. */
  index: number;
  /** Called when the user navigates to another photo. */
  onIndexChange: (index: number) => void;
  /** Called on Esc, the close button or a backdrop click. */
  onClose: () => void;
  /**
   * Accessible name of the dialog.
   * @default 'Photo gallery'
   */
  label?: string;
  /** Labels for the buttons. */
  labels?: { close: string; previous: string; next: string };
}

const useStyles = makeStyles({
  dialog: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    boxSizing: 'border-box',
    color: vars.color.textOverlay,
    height: '100dvh',
    maxHeight: 'none',
    maxWidth: 'none',
    outlineStyle: 'none',
    padding: 0,
    width: '100vw',
    '::backdrop': { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
  },
  stage: { alignItems: 'center', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', padding: '56px 64px 16px', boxSizing: 'border-box' },
  figure: { alignItems: 'center', display: 'flex', flexDirection: 'column', margin: 0, maxHeight: '100%', maxWidth: '100%', minHeight: 0 },
  image: { display: 'block', maxHeight: 'calc(100dvh - 160px)', maxWidth: '100%', objectFit: 'contain' },
  caption: { fontFamily: vars.font.sans, fontSize: vars.fontSize.bodySmall, marginTop: '12px', textAlign: 'center' },
  counter: { fontFamily: vars.font.sans, fontSize: '12px', letterSpacing: '0.6px', marginTop: '8px', opacity: 0.8 },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '100%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '16px',
    height: '44px',
    justifyContent: 'center',
    position: 'absolute',
    width: '44px',
    ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
    ':focus-visible': { ...focusRing, outlineColor: '#fff' },
    ':disabled': { opacity: 0.3, cursor: 'default' },
  },
  close: { right: '12px', top: '12px' },
  prev: { left: '8px', top: '50%', transform: 'translateY(-50%)' },
  next: { right: '8px', top: '50%', transform: 'translateY(-50%)' },
});

/**
 * Full-screen photo viewer on the native `<dialog>`. Arrow keys, Home and End
 * navigate; Esc closes; focus returns to what opened it.
 */
export function Lightbox({
  photos,
  open,
  index,
  onIndexChange,
  onClose,
  label = 'Photo gallery',
  labels = { close: 'Close', previous: 'Previous photo', next: 'Next photo' },
}: LightboxProps) {
  const s = useStyles();
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      dialog.focus();
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
    if (!open) return undefined;
    lockScroll();
    return unlockScroll;
  }, [open]);

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

  // Warm the cache for the neighbours.
  React.useEffect(() => {
    if (!open) return;
    [index - 1, index + 1].forEach((i) => {
      const photo = photos[i];
      if (photo) new window.Image().src = photo.src;
    });
  }, [open, index, photos]);

  const photo = photos[index];
  const go = (next: number) => {
    if (next >= 0 && next < photos.length) onIndexChange(next);
  };

  return (
    <dialog
      ref={ref}
      aria-label={label}
      tabIndex={-1}
      className={s.dialog}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') go(index - 1);
        else if (event.key === 'ArrowRight') go(index + 1);
        else if (event.key === 'Home') go(0);
        else if (event.key === 'End') go(photos.length - 1);
        else return;
        event.preventDefault();
      }}
    >
      {open && photo && (
        <div className={s.stage}>
          <figure className={s.figure}>
            <img className={s.image} src={photo.src} alt={photo.alt} />
            {photo.caption && <figcaption className={s.caption}>{photo.caption}</figcaption>}
          </figure>
          <p className={s.counter} aria-live="polite">
            {index + 1} / {photos.length}
          </p>
          <button type="button" className={mergeClasses(s.button, s.close)} aria-label={labels.close} onClick={onClose}>
            <CloseIcon />
          </button>
          <button type="button" className={mergeClasses(s.button, s.prev)} aria-label={labels.previous} disabled={index === 0} onClick={() => go(index - 1)}>
            <ChevronLeftIcon />
          </button>
          <button type="button" className={mergeClasses(s.button, s.next)} aria-label={labels.next} disabled={index === photos.length - 1} onClick={() => go(index + 1)}>
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </dialog>
  );
}

export interface PhotoGalleryProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  photos: Photo[];
  /**
   * Minimum thumbnail width in px; columns fill the available space.
   * @default 160
   */
  minThumbWidth?: number;
  /**
   * Thumbnail shape (width ÷ height).
   * @default 4 / 3
   */
  thumbRatio?: number;
  /**
   * Template for each thumbnail button's accessible name. `{n}` is the photo
   * number and `{alt}` its alt text.
   * @default 'Open photo {n}: {alt}'
   */
  openLabel?: string;
}

const useGridStyles = makeStyles({
  grid: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(var(--dp-thumb-min, 160px), 1fr))',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  thumb: {
    backgroundColor: vars.color.bgMap,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    cursor: 'zoom-in',
    display: 'block',
    overflow: 'hidden',
    padding: 0,
    width: '100%',
    ':focus-visible': focusRing,
    ':hover': { opacity: 0.9 },
  },
  thumbImage: { display: 'block', height: '100%', objectFit: 'cover', width: '100%' },
});

/**
 * Responsive thumbnail grid that opens a `Lightbox`. Replaces `PhotoGallery`,
 * `ImageGallery` and react-photoswipe.
 *
 * @example
 * <PhotoGallery photos={[{ src: '/a.jpg', alt: 'The market at dawn' }]} />
 */
export function PhotoGallery({
  photos,
  minThumbWidth = 160,
  thumbRatio = 4 / 3,
  openLabel = 'Open photo {n}: {alt}',
  className,
  style,
  ...rest
}: PhotoGalleryProps) {
  const s = useGridStyles();
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <ul
        className={mergeClasses(s.grid, className)}
        style={{ '--dp-thumb-min': `${minThumbWidth}px`, ...style } as React.CSSProperties}
        {...rest}
      >
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              className={s.thumb}
              style={{ aspectRatio: thumbRatio }}
              aria-haspopup="dialog"
              aria-label={openLabel.replace('{n}', String(i + 1)).replace('{alt}', photo.alt)}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              <img className={s.thumbImage} src={photo.thumbSrc ?? photo.src} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} open={open} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />
    </>
  );
}
