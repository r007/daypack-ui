import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { focusRing } from '../../theme/focus';
import { typography } from '../../theme/typography';
import { Badge } from '../Badge';

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Headline. Linked when `href` is set. */
  title: React.ReactNode;
  /** Makes the whole callout one link to this URL. */
  href?: string;
  /** Small uppercase label above the title. */
  category?: React.ReactNode;
  /** Supporting text. */
  description?: React.ReactNode;
  /** Image URL. */
  image?: string;
  /**
   * Text alternative of the image; usually empty because the title names it.
   * @default ''
   */
  imageAlt?: string;
  /**
   * Which side the image sits on at tablet width and up. On phones it is always on top.
   * @default 'start'
   */
  imagePosition?: 'start' | 'end';
  /**
   * Width of the image column from 600px: `narrow` is 80px (book covers),
   * `wide` is 300px (activities).
   * @default 'wide'
   */
  imageSize?: 'narrow' | 'wide';
  /** Extra content under the description: a `Price`, tags, a `Button`. */
  footer?: React.ReactNode;
  /**
   * Semantic level of the title.
   * @default 3
   */
  level?: 2 | 3 | 4 | 5 | 6;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: vars.color.bgPrimary,
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)',
    color: vars.color.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: vars.font.sans,
    overflow: 'hidden',
    position: 'relative',
    [media({ minWidth: 600 })]: { columnGap: '30px', flexDirection: 'row', padding: '30px' },
  },
  end: { [media({ minWidth: 600 })]: { flexDirection: 'row-reverse' } },
  media: { flexShrink: 0, [media({ minWidth: 600 })]: { width: '300px' } },
  narrow: { [media({ minWidth: 600 })]: { width: '80px' } },
  image: { display: 'block', height: 'auto', width: '100%' },
  body: { alignSelf: 'center', flexGrow: 1, minWidth: 0, padding: '25px', [media({ minWidth: 600 })]: { padding: 0 } },
  title: { ...typography.heading(6, 'regular'), margin: 0, lineHeight: 26 / 20 },
  link: {
    color: 'inherit',
    textDecorationLine: 'none',
    '::after': { content: '""', inset: 0, position: 'absolute' },
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': { outlineStyle: 'none' },
    ':focus-visible::after': { ...focusRing, outlineOffset: '-2px' },
  },
  category: { display: 'block', marginBottom: '4px' },
  description: { color: vars.color.textPrimary, fontSize: '14px', lineHeight: 1.5, margin: 0, marginTop: '1em' },
  footer: { marginTop: '12px', position: 'relative', zIndex: 1 },
});

/**
 * Promotional panel with an image beside a headline, description and footer.
 * One link covers the whole panel. Replaces `Callout`, `CalloutLink`,
 * `FeaturedCallout`.
 *
 * @example
 * <Callout image="/tour.jpg" category="Activity" title="Sunset kayak tour" href="/tours/kayak"
 *   description="Paddle the harbour at golden hour." footer={<Price amount={59} />} />
 */
export function Callout({
  title,
  href,
  category,
  description,
  image,
  imageAlt = '',
  imagePosition = 'start',
  imageSize = 'wide',
  footer,
  level = 3,
  className,
  ...rest
}: CalloutProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <article className={mergeClasses(s.root, imagePosition === 'end' && s.end, className)} {...rest}>
      {image && (
        <div className={mergeClasses(s.media, imageSize === 'narrow' && s.narrow)}>
          <img className={s.image} src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}
      <div className={s.body}>
        {category && <Badge className={s.category}>{category}</Badge>}
        <Heading className={s.title}>
          {href ? (
            <a className={s.link} href={href}>
              {title}
            </a>
          ) : (
            title
          )}
        </Heading>
        {description && <p className={s.description}>{description}</p>}
        {footer && <div className={s.footer}>{footer}</div>}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------

export interface IconCalloutProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  /** An icon element, e.g. `<GlobeIcon />`. Decorative. */
  icon: React.ReactNode;
  title: React.ReactNode;
  /** One or two sentences. */
  children?: React.ReactNode;
  /** Makes the title a link. */
  href?: string;
}

const useIconStyles = makeStyles({
  list: {
    display: 'grid',
    gap: '32px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  item: { fontFamily: vars.font.sans, color: vars.color.textPrimary, textAlign: 'center' },
  icon: { color: vars.color.linkPrimary, display: 'block', fontSize: '48px', marginBottom: '16px' },
  title: { ...typography.heading(6, 'medium'), margin: 0 },
  text: { color: vars.color.textSecondary, fontSize: '14px', lineHeight: 1.5, margin: 0, marginTop: '8px' },
  link: { color: 'inherit', textDecorationLine: 'none', ':hover': { color: vars.color.linkPrimary }, ':focus-visible': focusRing },
});

/** One column of an `IconCalloutGroup`: large icon, title and short text. */
export function IconCallout({ icon, title, children, href, className, ...rest }: IconCalloutProps) {
  const s = useIconStyles();
  return (
    <li className={mergeClasses(s.item, className)} {...rest}>
      <span aria-hidden="true" className={s.icon}>
        {icon}
      </span>
      <h3 className={s.title}>
        {href ? (
          <a className={s.link} href={href}>
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {children && <p className={s.text}>{children}</p>}
    </li>
  );
}

export type IconCalloutGroupProps = React.HTMLAttributes<HTMLUListElement>;

/**
 * Responsive row of up to four `IconCallout`s, for value propositions and
 * feature lists. Columns reflow by available width.
 *
 * @example
 * <IconCalloutGroup aria-label="Why book with us">
 *   <IconCallout icon={<GlobeIcon />} title="Worldwide">Thousands of destinations.</IconCallout>
 * </IconCalloutGroup>
 */
export function IconCalloutGroup({ className, ...rest }: IconCalloutGroupProps) {
  const s = useIconStyles();
  return <ul className={mergeClasses(s.list, className)} {...rest} />;
}
