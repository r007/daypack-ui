import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';

export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section heading. Omit for an unlabelled, spacing-only section. */
  title?: React.ReactNode;
  /**
   * Semantic level of the title.
   * @default 2
   */
  level?: 2 | 3 | 4 | 5 | 6;
  /**
   * Content aligned to the right of the title, typically a `MoreLink`.
   */
  action?: React.ReactNode;
  /**
   * Divider lines.
   * @default 'none'
   */
  border?: 'none' | 'top' | 'bottom' | 'both';
  /**
   * Vertical padding: `compact` halves it.
   * @default 'normal'
   */
  spacing?: 'normal' | 'compact';
  /** Section content. */
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  root: { color: vars.color.textPrimary, paddingTop: '32px', paddingBottom: '32px', [media({ minWidth: 768 })]: { paddingTop: '48px', paddingBottom: '48px' } },
  compact: { paddingTop: '16px', paddingBottom: '16px', [media({ minWidth: 768 })]: { paddingTop: '24px', paddingBottom: '24px' } },
  top: { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: vars.color.borderPrimary },
  bottom: { borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: vars.color.borderPrimary },
  header: { alignItems: 'baseline', columnGap: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '24px' },
  title: { ...typography.heading(5, 'regular'), margin: 0, [media({ minWidth: 768 })]: { ...typography.heading(4, 'regular') } },
});

/**
 * Titled page region with optional action and dividers. Replaces the legacy
 * `Segment`, `ContentHeader`, `ContentSectionList` and the plain parts of
 * `SidebarSection`.
 *
 * @example
 * <Section title="Top sights" action={<MoreLink href="/sights">All sights</MoreLink>} border="top">…</Section>
 */
export function Section({
  title,
  level = 2,
  action,
  border = 'none',
  spacing = 'normal',
  className,
  children,
  ...rest
}: SectionProps) {
  const s = useStyles();
  const titleId = React.useId();
  const Heading = `h${level}` as const;
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={mergeClasses(
        s.root,
        spacing === 'compact' && s.compact,
        (border === 'top' || border === 'both') && s.top,
        (border === 'bottom' || border === 'both') && s.bottom,
        className,
      )}
      {...rest}
    >
      {(title || action) && (
        <div className={s.header}>
          {title && (
            <Heading id={titleId} className={s.title}>
              {title}
            </Heading>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
