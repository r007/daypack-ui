import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading text. */
  children: React.ReactNode;
  /**
   * Semantic heading level; pick by document outline.
   * @default 2
   */
  level?: 2 | 3 | 4 | 5 | 6;
  /**
   * White text and divider, for dark or photographic backgrounds.
   * @default false
   */
  inverse?: boolean;
}

const useStyles = makeStyles({
  root: {
    ...typography.heading(4, 'light'),
    color: vars.color.textPrimary,
    margin: 0,
    marginBottom: '64px',
    maxWidth: '100%',
    textAlign: 'center',
    [media({ minWidth: 1024 })]: { ...typography.heading(2, 'light'), marginBottom: '88px' },
  },
  inverse: { color: vars.color.textOverlay },
  divider: {
    backgroundColor: vars.color.accentRed,
    display: 'block',
    height: '2px',
    marginTop: '24px',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: '30px',
    [media({ minWidth: 1024 })]: { marginTop: '40px' },
  },
  dividerInverse: { backgroundColor: 'currentColor' },
});

/**
 * Centered section title with a short accent rule beneath it.
 *
 * @example
 * <SectionHeader>Best places to stay</SectionHeader>
 */
export function SectionHeader({ children, level = 2, inverse = false, className, ...rest }: SectionHeaderProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <Heading className={mergeClasses(s.root, inverse && s.inverse, className)} {...rest}>
      {children}
      <span aria-hidden="true" className={mergeClasses(s.divider, inverse && s.dividerInverse)} />
    </Heading>
  );
}
