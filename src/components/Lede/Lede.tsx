import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export interface LedeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Intro text. Rendered inside a single paragraph. */
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: { ...typography.heading(4, 'light'), color: vars.color.textPrimary, lineHeight: 42 / 32 },
  paragraph: { marginTop: 0, marginBottom: 0 },
});

/**
 * Large light-weight introductory paragraph, set at the top of an article.
 *
 * @example
 * <Lede>Ten days across the Alps by rail.</Lede>
 */
export function Lede({ children, className, ...rest }: LedeProps) {
  const s = useStyles();
  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      <p className={s.paragraph}>{children}</p>
    </div>
  );
}
