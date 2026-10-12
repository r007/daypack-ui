import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';
import { Container } from '../Container';

export type BannerTone = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Severity. Sets the color and the live-region role (`error` is announced
   * assertively, the rest politely).
   * @default 'warning'
   */
  tone?: BannerTone;
  /** Message. May contain links; they inherit the banner's color and are underlined. */
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: {
    ...typography.heading(7),
    boxSizing: 'border-box',
    paddingTop: `${22 / 16}em`,
    paddingBottom: `${18 / 16}em`,
    textAlign: 'center',
    '& a': { color: 'inherit', textDecorationLine: 'underline', ':hover': { opacity: 0.8 } },
  },
  info: { backgroundColor: vars.color.accentBlue, color: vars.color.textPrimary },
  success: { backgroundColor: vars.color.accentGreen, color: vars.color.textPrimary },
  warning: { backgroundColor: vars.color.accentYellow, color: vars.color.textPrimary },
  error: { backgroundColor: vars.color.accentRed, color: vars.color.textOverlay },
});

/**
 * Full-width site notice, e.g. a travel advisory. Unlike `Toast` it stays in
 * the page flow and does not time out.
 *
 * @example
 * <Banner>Wildfires are affecting parts of the region. <a href="/advice">Read the advice</a>.</Banner>
 */
export function Banner({ tone = 'warning', children, className, ...rest }: BannerProps) {
  const s = useStyles();
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={mergeClasses(s.root, s[tone], className)} {...rest}>
      <Container>{children}</Container>
    </div>
  );
}
