import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { layout } from '../../theme/tokens';
import { media } from '../../theme/media';

const GUTTER = 30;
// Viewport width where the container stops hugging the screen edges.
const CENTERED_FROM = layout.maxWidth + GUTTER * 4;

const useStyles = makeStyles({
  root: {
    boxSizing: 'border-box',
    maxWidth: `${layout.maxWidth}px`,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
    '::after': { content: '" "', display: 'block', clear: 'both' },

    // Non-overlapping ranges: see `media()`.
    [media({ below: 480 })]: { paddingLeft: `${GUTTER / 2}px`, paddingRight: `${GUTTER / 2}px` },
    [media({ minWidth: 480, below: 1080 })]: { marginLeft: `${GUTTER}px`, marginRight: `${GUTTER}px` },
    [media({ minWidth: 1080, below: CENTERED_FROM })]: { marginLeft: `${GUTTER * 2}px`, marginRight: `${GUTTER * 2}px` },
  },
});

/**
 * Centered page container, max 1290px wide, with side gutters that grow with
 * the viewport (15px → 30px → 60px). Accepts all `<div>` attributes.
 */
export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Container({ className, ...rest }, ref) {
    const s = useStyles();
    return <div ref={ref} className={mergeClasses(s.root, className)} {...rest} />;
  },
);
