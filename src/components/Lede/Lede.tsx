import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export interface LedeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: { ...typography.heading(4, 'light'), color: vars.color.textPrimary, lineHeight: 42 / 32 },
  paragraph: { marginTop: 0, marginBottom: 0 },
});

/** Large introductory paragraph. */
export function Lede({ children, className, ...rest }: LedeProps) {
  const s = useStyles();
  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      <p className={s.paragraph}>{children}</p>
    </div>
  );
}
