import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';
import { blueLink } from '../../theme/mixins';
import { Strapline } from '../Strapline';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** The page's main heading (rendered as `<h1>`). */
  heading: React.ReactNode;
  /**
   * Small red kicker above the heading, e.g. the section or place. Strings are
   * rendered uppercase.
   */
  eyebrow?: React.ReactNode;
  /** Link the eyebrow to this URL. */
  eyebrowHref?: string;
  /** Tagline under the heading. Pass a string, or your own element for richer content. */
  strapline?: React.ReactNode;
  /**
   * Text alignment.
   * @default 'start'
   */
  align?: 'start' | 'center';
  /**
   * Limit the header to a readable measure (10 grid columns, 970px).
   * @default false
   */
  contained?: boolean;
}

const useStyles = makeStyles({
  root: { position: 'relative' },
  center: { textAlign: 'center' },
  contained: { maxWidth: '970px' },
  eyebrow: {
    ...typography.uppercase(),
    color: vars.color.accentRed,
    display: 'block',
    margin: 0,
    marginBottom: '14px',
    [media({ minWidth: 600 })]: { marginBottom: '21px' },
  },
  eyebrowLink: { ...blueLink, color: vars.color.accentRed, ':hover': { color: vars.color.textPrimary } },
  heading: {
    ...typography.heading(3, 'medium'),
    color: vars.color.textPrimary,
    letterSpacing: '-1px',
    margin: 0,
    [media({ minWidth: 600 })]: { ...typography.heading(1, 'medium'), letterSpacing: '-1px' },
  },
  strapline: {
    marginTop: '13px',
    [media({ below: 600 })]: { paddingLeft: '30px', paddingRight: '30px' },
    [media({ minWidth: 600 })]: { marginTop: '14px' },
  },
});

/**
 * Top-of-page title block: optional eyebrow, a large `<h1>` and a strapline.
 *
 * @example
 * <PageHeader eyebrow="France" eyebrowHref="/france" heading="Paris" strapline="City of light, art and bread." />
 */
export function PageHeader({
  heading,
  eyebrow,
  eyebrowHref,
  strapline,
  align = 'start',
  contained = false,
  className,
  ...rest
}: PageHeaderProps) {
  const s = useStyles();
  return (
    <header
      className={mergeClasses(s.root, align === 'center' && s.center, contained && s.contained, className)}
      {...rest}
    >
      {eyebrow && (
        <span className={s.eyebrow}>
          {eyebrowHref ? (
            <a className={s.eyebrowLink} href={eyebrowHref}>
              {eyebrow}
            </a>
          ) : (
            eyebrow
          )}
        </span>
      )}
      <h1 className={s.heading}>{heading}</h1>
      {strapline && (
        <div className={s.strapline}>
          {typeof strapline === 'string' ? <Strapline size="small">{strapline}</Strapline> : strapline}
        </div>
      )}
    </header>
  );
}
