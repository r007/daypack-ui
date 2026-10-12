import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon/icons';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, starting at 1. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /**
   * Called with the new page number. Not needed when `getHref` is supplied and
   * you navigate with real links.
   */
  onPageChange?: (page: number) => void;
  /**
   * Render real links instead of buttons: return the URL for a page.
   * Better for SEO and for opening pages in new tabs.
   */
  getHref?: (page: number) => string;
  /**
   * Pages shown on each side of the current one.
   * @default 1
   */
  siblings?: number;
  /**
   * Accessible name of the navigation landmark.
   * @default 'Pagination'
   */
  label?: string;
}

type Item = number | 'ellipsis-start' | 'ellipsis-end';

/** Compute the visible page items: first, last, current ± siblings, with ellipses. Exported for testing. */
export function getPageItems(page: number, pageCount: number, siblings = 1): Item[] {
  const total = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), total);
  const slots = siblings * 2 + 5; // first, last, current ± siblings, two ellipses
  if (total <= slots) return Array.from({ length: total }, (_, i) => i + 1);

  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;
  const edgeCount = 3 + 2 * siblings;

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'ellipsis-end', total];
  if (showLeftDots && !showRightDots) return [1, 'ellipsis-start', ...range(total - edgeCount + 1, total)];
  return [1, 'ellipsis-start', ...range(leftSibling, rightSibling), 'ellipsis-end', total];
}

const useStyles = makeStyles({
  list: { alignItems: 'center', columnGap: '4px', display: 'flex', flexWrap: 'wrap', listStyleType: 'none', margin: 0, padding: 0 },
  item: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: '100%',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: vars.font.sans,
    fontSize: '14px',
    fontWeight: vars.fontWeight.medium,
    height: '40px',
    justifyContent: 'center',
    minWidth: '40px',
    paddingLeft: '8px',
    paddingRight: '8px',
    textDecorationLine: 'none',
    ':hover': { backgroundColor: vars.color.bgSecondary, color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
  current: { backgroundColor: vars.color.linkPrimary, color: vars.color.textOverlay, ':hover': { backgroundColor: vars.color.linkPrimary, color: vars.color.textOverlay } },
  disabled: { color: vars.color.accentGray, cursor: 'default', pointerEvents: 'none' },
  ellipsis: { color: vars.color.textLight, fontFamily: vars.font.sans, minWidth: '24px', textAlign: 'center' },
  chevron: { fontSize: '10px' },
});

/**
 * Page navigation with previous/next, numbered pages and ellipses. Uses
 * `aria-current="page"` and can render real links for crawlable URLs.
 * Replaces `PaginatorButton`, `PoiPaginator` and `ArticlePagination*`.
 *
 * @example
 * <Pagination page={page} pageCount={12} onPageChange={setPage} />
 * <Pagination page={3} pageCount={12} getHref={(p) => `/guides?page=${p}`} />
 */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  getHref,
  siblings = 1,
  label = 'Pagination',
  className,
  ...rest
}: PaginationProps) {
  const s = useStyles();
  const items = getPageItems(page, pageCount, siblings);

  const control = (target: number, content: React.ReactNode, name: string, extra?: string, disabled?: boolean) => {
    const common = { className: mergeClasses(s.item, extra, disabled && s.disabled), 'aria-label': name } as const;
    if (getHref && !disabled) {
      return (
        <a {...common} href={getHref(target)} onClick={() => onPageChange?.(target)}>
          {content}
        </a>
      );
    }
    return (
      <button type="button" {...common} disabled={disabled} onClick={() => onPageChange?.(target)}>
        {content}
      </button>
    );
  };

  return (
    <nav aria-label={label} className={className} {...rest}>
      <ul className={s.list}>
        <li>{control(page - 1, <ChevronLeftIcon className={s.chevron} />, 'Previous page', undefined, page <= 1)}</li>
        {items.map((item) =>
          typeof item === 'string' ? (
            <li key={item} aria-hidden="true" className={s.ellipsis}>
              …
            </li>
          ) : (
            <li key={item}>
              {item === page ? (
                <span className={mergeClasses(s.item, s.current)} aria-current="page" aria-label={`Page ${item}`}>
                  {item}
                </span>
              ) : (
                control(item, item, `Page ${item}`)
              )}
            </li>
          ),
        )}
        <li>{control(page + 1, <ChevronRightIcon className={s.chevron} />, 'Next page', undefined, page >= pageCount)}</li>
      </ul>
    </nav>
  );
}
