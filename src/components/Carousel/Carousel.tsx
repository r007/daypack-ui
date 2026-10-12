import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { focusRing } from '../../theme/focus';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/icons';

type Responsive = number | { base?: number; md?: number; lg?: number };

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  /** Slides. Each child becomes one slide. */
  children: React.ReactNode;
  /** Accessible name of the carousel ("Featured guides"). Required. */
  label: string;
  /**
   * How many slides are visible at once. A number applies everywhere; an
   * object sets it per width: `base` (<768px), `md` (768–1023px), `lg` (1024px+).
   * Larger breakpoints inherit from smaller ones.
   * @default 1
   */
  slidesPerView?: Responsive;
  /**
   * Space between slides in px.
   * @default 16
   */
  gap?: number;
  /**
   * Show the previous/next buttons.
   * @default true
   */
  controls?: boolean;
  /**
   * Show a "3 / 12" position indicator.
   * @default false
   */
  showCounter?: boolean;
  /** Called with the index of the first fully visible slide when it changes. */
  onSlideChange?: (index: number) => void;
  /**
   * Accessible labels for the buttons.
   * @default { previous: 'Previous slides', next: 'Next slides' }
   */
  controlLabels?: { previous: string; next: string };
}

const useStyles = makeStyles({
  root: { position: 'relative' },
  list: {
    columnGap: 'var(--dp-carousel-gap)',
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    overflowX: 'auto',
    overflowY: 'hidden',
    overscrollBehaviorX: 'contain',
    padding: 0,
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
    ':focus-visible': { ...focusRing, outlineOffset: '-2px' },
  },
  slide: { flexShrink: 0, minWidth: 0, scrollSnapAlign: 'start' },
  perBase: { [media({ below: 768 })]: { flexBasis: 'calc((100% - var(--dp-carousel-gap) * (var(--dp-cv-base) - 1)) / var(--dp-cv-base))' } },
  perMd: { [media({ minWidth: 768, below: 1024 })]: { flexBasis: 'calc((100% - var(--dp-carousel-gap) * (var(--dp-cv-md) - 1)) / var(--dp-cv-md))' } },
  perLg: { [media({ minWidth: 1024 })]: { flexBasis: 'calc((100% - var(--dp-carousel-gap) * (var(--dp-cv-lg) - 1)) / var(--dp-cv-lg))' } },
  footer: { alignItems: 'center', display: 'flex', justifyContent: 'flex-end', marginTop: '12px', columnGap: '8px' },
  counter: { color: vars.color.textLight, fontFamily: vars.font.sans, fontSize: vars.fontSize.bodySmall, marginRight: 'auto' },
  button: {
    alignItems: 'center',
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '100%',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '12px',
    height: '40px',
    justifyContent: 'center',
    width: '40px',
    ':hover': { borderTopColor: vars.color.linkPrimary, borderRightColor: vars.color.linkPrimary, borderBottomColor: vars.color.linkPrimary, borderLeftColor: vars.color.linkPrimary, color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
    ':disabled': { cursor: 'default', opacity: 0.35 },
  },
});

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function resolve(per: Responsive) {
  const base = typeof per === 'number' ? per : (per.base ?? 1);
  const md = typeof per === 'number' ? per : (per.md ?? base);
  const lg = typeof per === 'number' ? per : (per.lg ?? md);
  return { base, md, lg };
}

/**
 * Horizontally scrolling slide list built on CSS scroll-snap, so touch,
 * trackpad and keyboard scrolling are native. Adds previous/next buttons,
 * an optional counter and the ARIA carousel roles. It never auto-rotates.
 *
 * @example
 * <Carousel label="Featured guides" slidesPerView={{ base: 1, md: 2, lg: 3 }}>
 *   <Card>…</Card><Card>…</Card><Card>…</Card>
 * </Carousel>
 */
export function Carousel({
  children,
  label,
  slidesPerView = 1,
  gap = 16,
  controls = true,
  showCounter = false,
  onSlideChange,
  controlLabels = { previous: 'Previous slides', next: 'Next slides' },
  className,
  style,
  ...rest
}: CarouselProps) {
  const s = useStyles();
  const listRef = React.useRef<HTMLUListElement>(null);
  const slides = React.Children.toArray(children).filter(Boolean);
  const [index, setIndex] = React.useState(0);
  const [atStart, setAtStart] = React.useState(true);
  const [atEnd, setAtEnd] = React.useState(slides.length <= 1);
  const per = resolve(slidesPerView);

  const measure = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    let nearest = 0;
    let best = Infinity;
    [...el.children].forEach((child, i) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - el.offsetLeft - el.scrollLeft);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setIndex(nearest);
  }, []);

  React.useEffect(() => {
    measure();
    const el = listRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure, slides.length]);

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onSlideChange?.(index);
  }, [index, onSlideChange]);

  const page = (direction: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy?.({ left: direction * el.clientWidth, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const cssVars = {
    '--dp-carousel-gap': `${gap}px`,
    '--dp-cv-base': per.base,
    '--dp-cv-md': per.md,
    '--dp-cv-lg': per.lg,
  } as React.CSSProperties;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className={mergeClasses(s.root, className)}
      style={{ ...cssVars, ...style }}
      {...rest}
    >
      <ul ref={listRef} tabIndex={0} className={s.list} onScroll={measure} aria-label={`${label} slides`}>
        {slides.map((slide, i) => (
          <li
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={mergeClasses(s.slide, s.perBase, s.perMd, s.perLg)}
          >
            {slide}
          </li>
        ))}
      </ul>
      {(controls || showCounter) && (
        <div className={s.footer}>
          {showCounter && (
            <span className={s.counter} aria-live="polite">
              {index + 1} / {slides.length}
            </span>
          )}
          {controls && (
            <>
              <button type="button" className={s.button} aria-label={controlLabels.previous} disabled={atStart} onClick={() => page(-1)}>
                <ChevronLeftIcon />
              </button>
              <button type="button" className={s.button} aria-label={controlLabels.next} disabled={atEnd} onClick={() => page(1)}>
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
