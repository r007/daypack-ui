import * as React from 'react';
import { mergeClasses } from '@griffel/react';
import { useBarStyles } from '../_internal/bar';

export interface SectionNavItem {
  /** Link text (rendered uppercase). */
  label: string;
  /** Destination: a `#section` fragment for in-page navigation, or any URL. */
  href: string;
  /** Marks the item for the section currently in view; sets `aria-current` and the active bar. */
  current?: boolean;
}

export interface SectionNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  items: SectionNavItem[];
  /** Accessible name of the landmark (required: pages often have several navs). */
  label: string;
  /** Stay pinned to the top of the viewport while scrolling. */
  sticky?: boolean;
  /** Called when an item is activated, e.g. to smooth-scroll yourself. */
  onItemClick?: (item: SectionNavItem, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Horizontal in-page or sectional navigation made of real links, scrollable
 * on narrow screens. Track the visible section yourself (e.g. with an
 * `IntersectionObserver`) and flag it with `current`.
 *
 * @example
 * <SectionNav label="On this page" sticky items={[{ label: 'Overview', href: '#overview', current: true }]} />
 */
export function SectionNav({ items, label, sticky = false, onItemClick, className, ...rest }: SectionNavProps) {
  const s = useBarStyles();
  return (
    <nav aria-label={label} className={mergeClasses(s.nav, sticky && s.sticky, className)} {...rest}>
      <ul className={s.list}>
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? 'true' : undefined}
              className={mergeClasses(s.item, item.current && s.current)}
              onClick={(e) => onItemClick?.(item, e)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
