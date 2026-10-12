import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Short statement of what is missing ("No matches"). */
  title: React.ReactNode;
  /** Optional hint on what to do next. */
  children?: React.ReactNode;
  /** Primary way out, typically a `MoreLink` or `Button` ("Reset filters"). */
  action?: React.ReactNode;
  /**
   * Semantic level of the title.
   * @default 2
   */
  level?: 2 | 3 | 4 | 5 | 6;
}

const useStyles = makeStyles({
  root: { color: vars.color.textPrimary, fontFamily: vars.font.sans },
  title: { fontSize: '28px', fontWeight: 300, lineHeight: 36 / 28, margin: 0 },
  text: { color: vars.color.textSecondary, fontSize: vars.fontSize.heading7, lineHeight: 24 / 16, margin: 0, marginTop: '8px' },
  action: { marginTop: '14px' },
});

/**
 * Message shown when a list or search has nothing to display.
 *
 * @example
 * <EmptyState title="We couldn’t find any matches" action={<MoreLink caps onClick={reset}>Reset filters</MoreLink>} />
 */
export function EmptyState({ title, children, action, level = 2, className, ...rest }: EmptyStateProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      <Heading className={s.title}>{title}</Heading>
      {children && <p className={s.text}>{children}</p>}
      {action && <div className={s.action}>{action}</div>}
    </div>
  );
}
