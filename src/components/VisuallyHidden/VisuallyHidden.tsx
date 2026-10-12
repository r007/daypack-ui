import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { visuallyHidden } from '../../theme/mixins';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Reveal the content while it has keyboard focus, e.g. for "Skip to content" links.
   * Only useful when the content itself is focusable (put an `<a>` inside, or add `tabIndex={0}`).
   * @default false
   */
  focusable?: boolean;
}

const useStyles = makeStyles({
  root: visuallyHidden,
  focusable: {
    ':focus': { clipPath: 'none', height: 'auto', margin: 0, overflow: 'visible', position: 'static', whiteSpace: 'inherit', width: 'auto' },
  },
});

/**
 * Content available to assistive technology but not painted.
 *
 * @example
 * <button><SearchIcon /><VisuallyHidden>Search</VisuallyHidden></button>
 */
export function VisuallyHidden({ focusable, className, ...rest }: VisuallyHiddenProps) {
  const s = useStyles();
  return <span className={mergeClasses(s.root, focusable && s.focusable, className)} {...rest} />;
}
