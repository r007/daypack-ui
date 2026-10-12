import type { GriffelStyle } from '@griffel/react';
import { vars } from './vars';
import { focusRing } from './focus';

/** Hide visually but keep available to screen readers. */
export const visuallyHidden: GriffelStyle = {
  border: 0,
  clipPath: 'inset(50%)',
  display: 'inline-block',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  whiteSpace: 'nowrap',
  width: '1px',
};

/** Plain blue hyperlink. */
export const blueLink: GriffelStyle = {
  color: vars.color.linkPrimary,
  textDecorationLine: 'none',
  transitionProperty: 'color',
  transitionDuration: vars.duration.fast,
  transitionTimingFunction: 'ease-in-out',
  ':hover': { color: vars.color.linkPrimaryHover },
  ':active': { color: vars.color.linkPrimaryHover },
  ':focus-visible': { ...focusRing, color: vars.color.linkPrimaryHover },
};

const underline = `color-mix(in srgb, ${vars.color.textPrimary} 40%, transparent)`;

/** Hyperlink drawn with a soft underline that breaks around descenders. */
export const underlinedLink: GriffelStyle = {
  color: vars.color.textPrimary,
  position: 'relative',
  textDecorationLine: 'none',
  transitionProperty: 'color',
  transitionDuration: vars.duration.fast,
  transitionTimingFunction: 'ease',
  backgroundImage: `linear-gradient(to top, transparent, transparent 2px, ${underline} 2px, ${underline} 3px, transparent 3px)`,
  textShadow: [
    `-1px -1px 0 ${vars.color.bgPrimary}`,
    `1px -1px 0 ${vars.color.bgPrimary}`,
    `-1px 1px 0 ${vars.color.bgPrimary}`,
    `1px 1px 0 ${vars.color.bgPrimary}`,
  ].join(', '),
  ':focus-visible': focusRing,
};
