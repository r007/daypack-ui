import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { MoreLink } from '../MoreLink';

export interface ReadMoreProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The text to clamp. */
  children: React.ReactNode;
  /**
   * Number of lines shown while collapsed.
   * @default 3
   */
  maxLines?: number;
  /**
   * Toggle label while collapsed.
   * @default 'Read more'
   */
  moreLabel?: string;
  /**
   * Toggle label while expanded.
   * @default 'Show less'
   */
  lessLabel?: string;
}

const useStyles = makeStyles({
  clamp: { display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 'var(--dp-lines, 3)' },
  toggle: { marginTop: '8px' },
});

/**
 * Clamps long text to a number of lines and offers an accessible
 * "Read more" toggle, shown only if the text is actually truncated.
 * Replaces `ProfileIntro`.
 */
export function ReadMore({ children, maxLines = 3, moreLabel = 'Read more', lessLabel = 'Show less', className, style, ...rest }: ReadMoreProps) {
  const s = useStyles();
  const id = React.useId();
  const ref = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return undefined;
    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, maxLines, children]);

  return (
    <div className={className} style={style} {...rest}>
      <div id={id} ref={ref} className={mergeClasses(!expanded && s.clamp)} style={{ '--dp-lines': maxLines } as React.CSSProperties}>
        {children}
      </div>
      {(overflowing || expanded) && (
        <div className={s.toggle}>
          <MoreLink direction={expanded ? 'up' : 'down'} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
            {expanded ? lessLabel : moreLabel}
          </MoreLink>
        </div>
      )}
    </div>
  );
}
