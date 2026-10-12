import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { blueLink } from '../../theme/mixins';
import { ChevronRightIcon } from '../Icon/icons';

export interface BreadcrumbItem {
  /** Visible text. */
  label: string;
  /** Destination. Omit on the last item to render the current page as plain text. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Trail from the root to the current page, in order. The last item is marked `aria-current="page"`. */
  items: BreadcrumbItem[];
  /**
   * Accessible name of the navigation landmark.
   * @default 'Breadcrumb'
   */
  label?: string;
  /**
   * Emit schema.org `BreadcrumbList` microdata for search engines.
   * @default true
   */
  microdata?: boolean;
}

const useStyles = makeStyles({
  list: {
    alignItems: 'center',
    color: vars.color.textLight, // AA on white (the original 56% alpha was 3.3:1)
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.bodySmall,
    fontWeight: vars.fontWeight.regular,
    lineHeight: 1.5,
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  item: { alignItems: 'center', display: 'inline-flex' },
  link: blueLink,
  separator: { fontSize: `${6 / 14}em`, marginLeft: `${10 / 14}em`, marginRight: `${10 / 14}em` },
});

/**
 * Hierarchical location trail (`<nav><ol>`), the last item being the current page.
 *
 * @example
 * <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'France', href: '/france' }, { label: 'Paris' }]} />
 */
export function Breadcrumbs({ items, label = 'Breadcrumb', microdata = true, className, ...rest }: BreadcrumbsProps) {
  const s = useStyles();
  const listProps = microdata ? { itemScope: true, itemType: 'https://schema.org/BreadcrumbList' } : {};

  return (
    <nav aria-label={label} className={className} {...rest}>
      <ol className={s.list} {...listProps}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const itemProps = microdata
            ? { itemProp: 'itemListElement', itemScope: true, itemType: 'https://schema.org/ListItem' }
            : {};
          return (
            <li key={`${item.href ?? ''}${item.label}`} className={s.item} {...itemProps}>
              {item.href && !(last && !item.href) ? (
                <a
                  className={s.link}
                  href={item.href}
                  aria-current={last ? 'page' : undefined}
                  itemProp={microdata ? 'item' : undefined}
                >
                  <span itemProp={microdata ? 'name' : undefined}>{item.label}</span>
                </a>
              ) : (
                <span aria-current={last ? 'page' : undefined} itemProp={microdata ? 'name' : undefined}>
                  {item.label}
                </span>
              )}
              {microdata && <meta itemProp="position" content={String(index + 1)} />}
              {!last && <ChevronRightIcon className={mergeClasses(s.separator)} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
