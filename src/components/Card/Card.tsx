import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';
import { Bullet } from '../Bullet';

type CardLayout = 'card' | 'tile';
type CardTheme = 'light' | 'dark';
type CardSpacing = 'normal' | 'compact';

interface CardContextValue {
  layout: CardLayout;
  theme: CardTheme;
}

const CardContext = React.createContext<CardContextValue>({ layout: 'card', theme: 'light' });

const useStyles = makeStyles({
  root: {
    height: 'auto',
    maxWidth: '410px',
    minWidth: '216px',
    position: 'relative',
    // Hover/focus state is shared with children through custom properties, so
    // the whole card reacts even though the link is a single stretched element.
    ':hover': { '--dp-card-zoom': '1.03', '--dp-card-title': vars.color.linkPrimary },
    ':focus-within': { '--dp-card-title': vars.color.linkPrimary },
  },
  card: {
    boxShadow: `0 0 20px color-mix(in srgb, ${vars.color.shadowPrimary} 12%, transparent)`,
    [media({ minWidth: 768 })]: {
      boxShadow: `0 12px 34px color-mix(in srgb, ${vars.color.shadowPrimary} 12%, transparent)`,
    },
  },
  dark: { color: vars.color.textOverlay, ':hover': { '--dp-card-title': vars.color.textOverlay } },

  media: { backgroundColor: vars.color.bgOverlay, overflow: 'hidden', position: 'relative' },
  image: {
    display: 'block',
    height: '100%',
    objectFit: 'cover',
    transform: 'scale(var(--dp-card-zoom, 1))',
    transitionProperty: 'transform',
    transitionDuration: vars.duration.slow,
    transitionTimingFunction: 'ease-in-out',
    width: '100%',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  mediaOverlay: { inset: 0, position: 'absolute' },

  body: {
    boxSizing: 'border-box',
    position: 'relative',
    paddingTop: '19px',
    paddingBottom: '11px',
    [media({ minWidth: 768 })]: { paddingTop: '32px', paddingBottom: '34px' },
  },
  bodyCompact: { paddingTop: '16px', paddingBottom: '16px', [media({ minWidth: 768 })]: { paddingTop: '16px', paddingBottom: '16px' } },
  bodyCard: {
    paddingLeft: '11px',
    paddingRight: '11px',
    [media({ minWidth: 768 })]: { paddingLeft: '22px', paddingRight: '22px' },
  },

  title: {
    ...typography.heading(7),
    color: 'var(--dp-card-title, inherit)',
    display: '-webkit-box',
    fontWeight: vars.fontWeight.light,
    margin: 0,
    maxHeight: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transitionProperty: 'color',
    transitionDuration: vars.duration.fast,
    transitionTimingFunction: 'ease-in-out',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    [media({ minWidth: 768 })]: { ...typography.heading(5, 'light') },
  },
  titleCompact: { ...typography.heading(7), fontWeight: vars.fontWeight.regular, [media({ minWidth: 768 })]: { ...typography.heading(7) } },
  stretched: {
    color: 'inherit',
    textDecorationLine: 'none',
    '::after': { content: '""', inset: 0, position: 'absolute', zIndex: 1 },
    ':focus-visible': { outlineStyle: 'none' },
    ':focus-visible::after': {
      outlineStyle: 'solid',
      outlineWidth: '2px',
      outlineColor: vars.color.linkPrimary,
      outlineOffset: '2px',
    },
  },

  text: {
    color: vars.color.textSecondary,
    fontFamily: vars.font.sans,
    fontSize: '16px',
    lineHeight: 1.25,
    margin: 0,
    marginTop: '12px',
  },
  meta: {
    color: vars.color.textSecondary,
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.bodySmall,
    listStyleType: 'none',
    margin: 0,
    marginTop: '12px',
    padding: 0,
  },
  actions: { position: 'relative', zIndex: 2 },
});

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * `card` has a drop shadow and inner padding; `tile` is flat and edge-to-edge.
   * @default 'card'
   */
  layout?: CardLayout;
  /**
   * `dark` makes text white, for cards placed on dark or photographic backgrounds.
   * @default 'light'
   */
  theme?: CardTheme;
  /**
   * Element to render.
   * @default 'article'
   */
  as?: 'article' | 'div' | 'li' | 'section';
}

/**
 * Container for a self-contained piece of content such as a destination or article.
 *
 * Compose it from `CardMedia`, `CardBody`, `CardTitle`, `CardText` and `CardMeta`.
 * Put a single `href` on `CardTitle`: its link is stretched over the whole
 * card, so the card is one tab stop and one click target.
 *
 * @example
 * <Card>
 *   <CardMedia src="/paris.jpg" alt="" />
 *   <CardBody>
 *     <CardTitle href="/paris">Paris</CardTitle>
 *     <CardText>City of light</CardText>
 *   </CardBody>
 * </Card>
 */
export function Card({ layout = 'card', theme = 'light', as: Element = 'article', className, ...rest }: CardProps) {
  const s = useStyles();
  const ctx = React.useMemo(() => ({ layout, theme }), [layout, theme]);
  return (
    <CardContext.Provider value={ctx}>
      <Element
        className={mergeClasses(s.root, layout === 'card' && s.card, theme === 'dark' && s.dark, className)}
        {...rest}
      />
    </CardContext.Provider>
  );
}

export interface CardMediaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image URL. Omit to render only `children` over the dark backdrop. */
  src?: string;
  /**
   * Text alternative. Use `""` when the image is decorative, e.g. the title
   * already names it.
   * @default ''
   */
  alt?: string;
  /**
   * Shape of the media area: `video` (410×232), `poster` (300×378), or any
   * width / height number such as `4 / 3`.
   * @default 'video'
   */
  ratio?: 'video' | 'poster' | number;
  /** Image opacity from 0 to 1, to darken it against the backdrop for overlaid text. */
  opacity?: number;
  /** Content placed over the image (badges, play icon, caption). */
  children?: React.ReactNode;
}

const RATIOS = { video: 410 / 232, poster: 300 / 378 } as const;

/** Image area of a `Card`, with a gentle zoom while the card is hovered. */
export function CardMedia({ src, alt = '', ratio = 'video', opacity, children, className, style, ...rest }: CardMediaProps) {
  const s = useStyles();
  const aspectRatio = typeof ratio === 'number' ? ratio : RATIOS[ratio];
  return (
    <div className={mergeClasses(s.media, className)} style={{ aspectRatio, ...style }} {...rest}>
      {src && <img className={s.image} src={src} alt={alt} loading="lazy" style={opacity === undefined ? undefined : { opacity }} />}
      {children && <div className={s.mediaOverlay}>{children}</div>}
    </div>
  );
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Vertical padding.
   * @default 'normal'
   */
  spacing?: CardSpacing;
}

/** Padded text area below (or beside) the media. Side padding is dropped in the `tile` layout. */
export function CardBody({ spacing = 'normal', className, ...rest }: CardBodyProps) {
  const s = useStyles();
  const { layout } = React.useContext(CardContext);
  return (
    <div
      className={mergeClasses(s.body, spacing === 'compact' && s.bodyCompact, layout === 'card' && s.bodyCard, className)}
      {...rest}
    />
  );
}

export interface CardTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'children'> {
  /** Title text. */
  children: React.ReactNode;
  /**
   * Link destination. When set, the whole card becomes clickable through this one link.
   */
  href?: string;
  /** Click handler for the stretched link; only used together with `href`. */
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /**
   * Semantic heading level; pick one that fits the page outline.
   * @default 3
   */
  level?: 2 | 3 | 4 | 5 | 6;
  /**
   * Smaller, regular-weight title for dense lists.
   * @default 'normal'
   */
  spacing?: CardSpacing;
}

/** Card heading, clamped to two lines. Optionally the card's stretched link. */
export function CardTitle({ children, href, onLinkClick, level = 3, spacing = 'normal', className, ...rest }: CardTitleProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <Heading className={mergeClasses(s.title, spacing === 'compact' && s.titleCompact, className)} {...rest}>
      {href ? (
        <a className={s.stretched} href={href} onClick={onLinkClick}>
          {children}
        </a>
      ) : (
        children
      )}
    </Heading>
  );
}

/** Supporting paragraph under the title. Accepts all `<p>` attributes. */
export function CardText({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  const s = useStyles();
  return <p className={mergeClasses(s.text, className)} {...rest} />;
}

export interface CardMetaProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Each child becomes one list item; falsy children are skipped. Bullets are inserted between them. */
  children: React.ReactNode;
}

/** Inline list of short facts ("3 days", "Europe", "From $120"), separated by bullets. */
export function CardMeta({ children, className, ...rest }: CardMetaProps) {
  const s = useStyles();
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <ul className={mergeClasses(s.meta, className)} {...rest}>
      {items.map((child, index) => (
        <li key={index}>
          {index > 0 && <Bullet space="both" />}
          {child}
        </li>
      ))}
    </ul>
  );
}

/**
 * Wrapper for secondary interactive controls (bookmark, share) so they stay
 * clickable above the card's stretched link.
 */
export function CardActions({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const s = useStyles();
  return <div className={mergeClasses(s.actions, className)} {...rest} />;
}
