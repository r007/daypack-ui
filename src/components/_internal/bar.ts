import { makeStyles } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';
import { focusRing } from '../../theme/focus';

/**
 * Styles shared by the horizontally scrolling "tab bar" look used by
 * <TabList> and <SectionNav>: uppercase labels with a bottom bar on the
 * current item.
 */
export const useBarStyles = makeStyles({
  nav: {
    backgroundColor: vars.color.bgPrimary,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    position: 'relative',
  },
  sticky: { position: 'sticky', top: 0, zIndex: vars.zIndex.default },
  list: {
    display: 'flex',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
  },
  item: {
    ...typography.uppercase(),
    alignItems: 'center',
    backgroundColor: vars.color.bgPrimary,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: '4px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    fontSize: '12px',
    height: '56px',
    paddingTop: '4px',
    paddingRight: '16px',
    paddingBottom: 0,
    paddingLeft: '16px',
    textDecorationLine: 'none',
    transitionProperty: 'border-bottom-color, color',
    transitionDuration: vars.duration.fast,
    transitionTimingFunction: 'ease-in-out',
    whiteSpace: 'nowrap',
    ':hover': { color: vars.color.textSecondary },
    ':focus-visible': { ...focusRing, outlineOffset: '-4px' },
    [media({ minWidth: 768 })]: { height: '80px', fontSize: '13px' },
  },
  current: { borderBottomColor: vars.color.linkPrimary },
});
