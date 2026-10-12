import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'alert';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Color treatment.
   * - `neutral`: muted gray text, for categories ("Museum")
   * - `accent`: link-blue, for highlights ("Top choice")
   * - `success`: green, for positive status
   * - `alert`: red, for warnings and discounts
   * @default 'neutral'
   */
  tone?: BadgeTone;
  /** Short label text. Keep to one or two words. */
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: { ...typography.uppercase(), display: 'inline-block', letterSpacing: '0.6px' },
  neutral: { color: vars.color.textLight },
  accent: { color: vars.color.linkPrimary },
  // The brand green is too light for text (2.1:1); darken it to clear AA.
  success: { color: `color-mix(in srgb, ${vars.color.accentGreen} 55%, black)` },
  alert: { color: vars.color.accentRed },
});

/**
 * Small uppercase status or category label.
 *
 * @example
 * <Badge tone="accent">Top choice</Badge>
 */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  const s = useStyles();
  return <span className={mergeClasses(s.root, s[tone], className)} {...rest} />;
}
