import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { Tag } from '../Tag';

export interface TagListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** `Tag` elements (or anything inline). Each one is wrapped in a list item. */
  children: React.ReactNode;
  /**
   * How many tags to show before collapsing the rest behind a "+N" toggle.
   * @default 6
   */
  limit?: number;
  /**
   * Label of the toggle when expanded.
   * @default 'Show fewer'
   */
  collapseLabel?: string;
}

const useStyles = makeStyles({
  list: {
    alignItems: 'center',
    columnGap: '8px',
    display: 'flex',
    flexWrap: 'wrap',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    rowGap: '8px',
  },
});

/**
 * Wrapping list of tags that collapses beyond `limit` behind an accessible
 * "+N" toggle (`aria-expanded`).
 *
 * @example
 * <TagList aria-label="Topics"><Tag href="/food">Food</Tag><Tag href="/art">Art</Tag></TagList>
 */
export function TagList({ children, limit = 6, collapseLabel = 'Show fewer', className, ...rest }: TagListProps) {
  const s = useStyles();
  const id = React.useId();
  const [expanded, setExpanded] = React.useState(false);
  const items = React.Children.toArray(children).filter(Boolean);
  const hidden = Math.max(0, items.length - limit);
  const visible = expanded ? items : items.slice(0, limit);

  return (
    <ul id={id} className={mergeClasses(s.list, className)} {...rest}>
      {visible.map((child, index) => (
        <li key={index}>{child}</li>
      ))}
      {hidden > 0 && (
        <li>
          <Tag
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={id}
            aria-label={expanded ? collapseLabel : `Show ${hidden} more`}
          >
            {expanded ? collapseLabel : `+${hidden}`}
          </Tag>
        </li>
      )}
    </ul>
  );
}
