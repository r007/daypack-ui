import { vars } from './vars';

/** Shared keyboard-focus ring (replaces the legacy dotted `outline()` mixin). */
export const focusRing = {
  outlineStyle: 'solid',
  outlineWidth: '2px',
  outlineColor: vars.color.linkPrimary,
  outlineOffset: '2px',
} as const;
