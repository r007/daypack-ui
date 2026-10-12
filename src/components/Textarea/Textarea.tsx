import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { useFieldStyles } from '../Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with the content, up to `maxLines`. */
  autoGrow?: boolean;
  /** Maximum number of lines when `autoGrow` is on. */
  maxLines?: number;
  /** Ignore the Enter key (e.g. for single-paragraph fields). */
  disableEnter?: boolean;
}

const BASE_HEIGHT = 56;
const LINE_HEIGHT = 24;

const useStyles = makeStyles({
  fixed: { resize: 'vertical', height: 'auto' },
  grow: { resize: 'none', overflowY: 'hidden' },
});

/** Multi-line field; optionally grows with its content. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autoGrow = false, maxLines = 3, disableEnter = false, className, onInput, onKeyDown, ...rest },
  forwardedRef,
) {
  const field = useFieldStyles();
  const s = useStyles();
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const setRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const resize = React.useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoGrow) return;
    const max = BASE_HEIGHT + (maxLines - 1) * LINE_HEIGHT;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [autoGrow, maxLines]);

  // Re-measure on mount and whenever a controlled value changes.
  React.useLayoutEffect(resize, [resize, rest.value]);

  return (
    <textarea
      ref={setRef}
      className={mergeClasses(field.field, autoGrow ? s.grow : s.fixed, className)}
      onInput={(e) => {
        onInput?.(e);
        resize();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (disableEnter && e.key === 'Enter') e.preventDefault();
      }}
      {...rest}
    />
  );
});
