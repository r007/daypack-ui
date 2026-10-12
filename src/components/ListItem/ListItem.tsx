import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

const useStyles = makeStyles({
  root: {
    alignItems: 'flex-start',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    columnGap: '16px',
    display: 'flex',
    paddingTop: '16px',
    paddingBottom: '16px',
    position: 'relative',
  },
  media: { flexShrink: 0, overflow: 'hidden', backgroundColor: vars.color.bgMap },
  mediaImage: { display: 'block', height: '100%', objectFit: 'cover', width: '100%' },
  body: { flexGrow: 1, minWidth: 0 },
  title: {
    ...typography.heading(6),
    color: vars.color.textPrimary,
    fontWeight: vars.fontWeight.regular,
    margin: 0,
  },
  link: {
    color: 'inherit',
    textDecorationLine: 'none',
    '::after': { content: '""', inset: 0, position: 'absolute' },
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': { outlineStyle: 'none' },
    ':focus-visible::after': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: vars.color.linkPrimary,
      outlineOffset: '-2px',
    },
  },
  eyebrow: { display: 'block', marginBottom: '4px' },
  text: { ...typography.bodySmall(), color: vars.color.textSecondary, margin: 0, marginTop: '6px' },
  actions: { flexShrink: 0, position: 'relative', zIndex: 1 },
});

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element to render. Use `li` when placing items inside a `<ul>` / `<ol>`.
   * @default 'div'
   */
  as?: 'div' | 'li' | 'article';
}

/**
 * A row in a list of results: optional thumbnail, text body, optional actions.
 *
 * Compose it from `ListItemMedia`, `ListItemBody`, `ListItemTitle`, `ListItemText`
 * and `ListItemActions`. As with `Card`, put one `href` on `ListItemTitle` and the
 * whole row becomes the link target.
 *
 * @example
 * <ListItem as="li">
 *   <ListItemMedia src="/louvre.jpg" alt="" />
 *   <ListItemBody>
 *     <Badge>Museum</Badge>
 *     <ListItemTitle href="/louvre">Louvre</ListItemTitle>
 *   </ListItemBody>
 * </ListItem>
 */
export function ListItem({ as: Element = 'div', className, ...rest }: ListItemProps) {
  const s = useStyles();
  return <Element className={mergeClasses(s.root, className)} {...rest} />;
}

export interface ListItemMediaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image URL. */
  src: string;
  /**
   * Text alternative; `""` if decorative.
   * @default ''
   */
  alt?: string;
  /**
   * Square thumbnail edge length in px.
   * @default 80
   */
  size?: number;
}

/** Square thumbnail at the start of a row. */
export function ListItemMedia({ src, alt = '', size = 80, className, style, ...rest }: ListItemMediaProps) {
  const s = useStyles();
  return (
    <div className={mergeClasses(s.media, className)} style={{ width: size, height: size, ...style }} {...rest}>
      <img className={s.mediaImage} src={src} alt={alt} loading="lazy" />
    </div>
  );
}

/** Text column of a row. Accepts all `<div>` attributes. */
export function ListItemBody({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const s = useStyles();
  return <div className={mergeClasses(s.body, className)} {...rest} />;
}

export interface ListItemTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> {
  children: React.ReactNode;
  /** Makes the whole row a link to this destination. */
  href?: string;
  /**
   * Semantic heading level.
   * @default 3
   */
  level?: 2 | 3 | 4 | 5 | 6;
}

/** Row heading, optionally the row's stretched link. */
export function ListItemTitle({ children, href, level = 3, className, ...rest }: ListItemTitleProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <Heading className={mergeClasses(s.title, className)} {...rest}>
      {href ? (
        <a className={s.link} href={href}>
          {children}
        </a>
      ) : (
        children
      )}
    </Heading>
  );
}

/** Short description under the title. Accepts all `<p>` attributes. */
export function ListItemText({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  const s = useStyles();
  return <p className={mergeClasses(s.text, className)} {...rest} />;
}

/** Trailing slot for secondary controls (bookmark, price). Stays clickable above the stretched link. */
export function ListItemActions({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const s = useStyles();
  return <div className={mergeClasses(s.actions, className)} {...rest} />;
}
