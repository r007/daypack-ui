import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

export interface StraplineProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Type size: `tiny` 14px, `small` 16px, `normal` 32px.
   * @default 'normal'
   */
  size?: 'tiny' | 'small' | 'normal';
  /**
   * Text color: inherits by default; `white` for dark backgrounds, `gray` for quiet captions.
   */
  tone?: 'white' | 'gray';
}

const useStyles = makeStyles({
  root: {
    ...typography.heading(4),
    fontFamily: vars.font.serif,
    fontStyle: 'italic',
    fontWeight: 'normal',
    margin: 0,
  },
  small: { fontSize: vars.fontSize.heading7, letterSpacing: '.4px', lineHeight: 24 / 16 },
  tiny: { fontSize: vars.fontSize.bodySmall, letterSpacing: '.4px', lineHeight: 1 },
  white: { color: vars.color.textOverlay },
  gray: { color: 'color-mix(in srgb, ' + vars.color.bgOverlay + ' 40%, transparent)' },
});

/** Italic serif tagline that sits under a title. */
export function Strapline({ size = 'normal', tone, className, ...rest }: StraplineProps) {
  const s = useStyles();
  return (
    <p
      className={mergeClasses(s.root, size !== 'normal' && s[size], tone && s[tone], className)}
      {...rest}
    />
  );
}
