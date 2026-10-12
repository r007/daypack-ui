import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';
export type HeadingWeight = 'extraThin' | 'thin' | 'normal' | 'thick';
export type HeadingImportance = 'low' | 'normal' | 'high' | 'alert';
export type HeadingTracking = 'tight' | 'normal' | 'loose';

export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /** Semantic level; renders `<h1>`–`<h6>`. */
  level?: HeadingLevel;
  /** Visual size, independent of the semantic level. */
  size?: HeadingSize;
  weight?: HeadingWeight;
  /** Color changes with importance. */
  importance?: HeadingImportance;
  tracking?: HeadingTracking;
  /** Clip overflow with an ellipsis on a single line. */
  truncate?: boolean;
  /** Set in all caps. */
  caps?: boolean;
}

const fromMd = media({ minWidth: 600 });

const useStyles = makeStyles({
  base: {
    fontFamily: vars.font.sans,
    lineHeight: 1,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },

  tiny: { fontSize: vars.fontSize.uppercase },
  small: { fontSize: vars.fontSize.uppercase, [fromMd]: { fontSize: '13px' } },
  medium: { fontSize: '26px', lineHeight: 40 / 26 },
  large: { fontSize: '40px', [fromMd]: { fontSize: '45px' } },
  huge: {
    fontSize: '34px',
    letterSpacing: '-1px',
    lineHeight: 36 / 30,
    [fromMd]: { fontSize: vars.fontSize.heading1, lineHeight: 70 / 64 },
  },

  extraThin: { fontWeight: vars.fontWeight.light },
  thin: { fontWeight: vars.fontWeight.light },
  normal: { fontWeight: vars.fontWeight.regular },
  thick: { fontWeight: vars.fontWeight.medium },

  low: { color: 'color-mix(in srgb, ' + vars.color.textPrimary + ' 35%, transparent)' },
  importanceNormal: { color: vars.color.textPrimary },
  high: { color: vars.color.textPrimary },
  alert: { color: vars.color.accentRed },

  tight: { letterSpacing: '-1px' },
  loose: { letterSpacing: '1px' },

  truncate: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  caps: { textTransform: 'uppercase' },
});

export function Heading({
  level = 2,
  size = 'medium',
  weight = 'normal',
  importance = 'normal',
  tracking = 'normal',
  truncate = false,
  caps = false,
  className,
  ...rest
}: HeadingProps) {
  const s = useStyles();
  const Component = `h${level}` as const;
  return (
    <Component
      className={mergeClasses(
        s.base,
        s[size],
        s[weight],
        importance === 'normal' ? s.importanceNormal : s[importance],
        tracking !== 'normal' && s[tracking],
        truncate && s.truncate,
        caps && s.caps,
        className,
      )}
      {...rest}
    />
  );
}
