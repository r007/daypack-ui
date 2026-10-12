import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { visuallyHidden } from '../../theme/mixins';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Reveal the content while it (or a descendant) has keyboard focus, e.g. skip links. */
  focusable?: boolean;
}

const useStyles = makeStyles({
  root: visuallyHidden,
  focusable: {
    ':focus': { clipPath: 'none', height: 'auto', margin: 0, overflow: 'visible', position: 'static', whiteSpace: 'inherit', width: 'auto' },
  },
});

/** Content available to assistive technology but not painted. */
export function VisuallyHidden({ focusable, className, ...rest }: VisuallyHiddenProps) {
  const s = useStyles();
  return <span className={mergeClasses(s.root, focusable && s.focusable, className)} {...rest} />;
}
