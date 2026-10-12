import type { GriffelStyle } from '@griffel/react';
import { vars } from './vars';

export type FontWeightName = 'light' | 'regular' | 'medium';
export type HeadingScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const headingSize = {
  1: vars.fontSize.heading1,
  2: vars.fontSize.heading2,
  3: vars.fontSize.heading3,
  4: vars.fontSize.heading4,
  5: vars.fontSize.heading5,
  6: vars.fontSize.heading6,
  7: vars.fontSize.heading7,
  8: vars.fontSize.heading8,
} as const;

// Unitless line-heights from the original scale (line px ÷ font px).
const headingLineHeight = {
  1: 72 / 64,
  2: 56 / 48,
  3: 48 / 40,
  4: 40 / 32,
  5: 32 / 24,
  6: 28 / 20,
  7: 24 / 16,
  8: 16 / 11,
} as const;

/** Reusable text styles from the type scale; spread them inside `makeStyles`. */
export const typography = {
  super: (): GriffelStyle => ({
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.super,
    fontWeight: vars.fontWeight.medium,
    lineHeight: 96 / 88,
  }),

  heading: (scale: HeadingScale, weight: FontWeightName = 'regular'): GriffelStyle => ({
    fontFamily: vars.font.sans,
    fontSize: headingSize[scale],
    fontWeight: vars.fontWeight[weight],
    lineHeight: headingLineHeight[scale],
  }),

  bodyArticle: (): GriffelStyle => ({
    fontFamily: vars.font.serif,
    fontSize: vars.fontSize.bodyArticle,
    lineHeight: 36 / 20,
  }),

  bodyArticleSmall: (): GriffelStyle => ({
    fontFamily: vars.font.serif,
    fontSize: vars.fontSize.bodyArticleSmall,
    lineHeight: 32 / 16,
  }),

  bodySmall: (): GriffelStyle => ({
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.bodySmall,
    lineHeight: 20 / 14,
  }),

  accent: (): GriffelStyle => ({
    fontFamily: vars.font.serif,
    fontSize: vars.fontSize.accent,
    fontStyle: 'italic',
    lineHeight: 24 / 16,
  }),

  uppercase: (): GriffelStyle => ({
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.uppercase,
    fontWeight: vars.fontWeight.medium,
    lineHeight: 1,
    textTransform: 'uppercase',
  }),
} as const;
