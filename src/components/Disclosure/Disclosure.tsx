import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { typography } from '../../theme/typography';
import { ChevronDownIcon } from '../Icon/icons';

export interface DisclosureProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'onChange'> {
  /** Text of the toggle. */
  title: React.ReactNode;
  /** Optional icon shown before the title. */
  icon?: React.ReactNode;
  /**
   * Semantic level of the heading wrapping the toggle.
   * @default 3
   */
  level?: 2 | 3 | 4 | 5 | 6;
  /** Controlled open state. */
  open?: boolean;
  /**
   * Initial state when uncontrolled.
   * @default true
   */
  defaultOpen?: boolean;
  /** Called when the user toggles. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Light background panel.
   * @default false
   */
  filled?: boolean;
  children: React.ReactNode;
}

const useStyles = makeStyles({
  root: { color: vars.color.textPrimary },
  filled: { backgroundColor: vars.color.bgSecondary, paddingLeft: '16px', paddingRight: '16px' },
  heading: { margin: 0 },
  toggle: {
    ...typography.uppercase(),
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: 'inherit',
    columnGap: '8px',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '12px',
    paddingTop: '16px',
    paddingRight: 0,
    paddingBottom: '16px',
    paddingLeft: 0,
    textAlign: 'left',
    width: '100%',
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
  title: { flexGrow: 1 },
  chevron: { fontSize: '10px', transitionProperty: 'transform', transitionDuration: vars.duration.fast, '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' } },
  chevronOpen: { transform: 'rotate(180deg)' },
  panel: {
    display: 'grid',
    gridTemplateRows: '0fr',
    transitionProperty: 'grid-template-rows, visibility',
    transitionDuration: vars.duration.default,
    visibility: 'hidden',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  panelOpen: { gridTemplateRows: '1fr', visibility: 'visible' },
  inner: { minHeight: 0, overflow: 'hidden' },
  content: { paddingBottom: '16px' },
});

/**
 * Single collapsible section with a heading and toggle button. For a group of
 * sections that open one at a time use `Accordion`. Replaces the collapsing
 * behaviour of `SidebarSection`.
 *
 * @example
 * <Disclosure title="Filters" defaultOpen={false}>…</Disclosure>
 */
export function Disclosure({
  title,
  icon,
  level = 3,
  open: controlled,
  defaultOpen = true,
  onOpenChange,
  filled = false,
  className,
  children,
  ...rest
}: DisclosureProps) {
  const s = useStyles();
  const id = React.useId();
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = controlled ?? internal;
  const Heading = `h${level}` as const;

  const toggle = () => {
    if (controlled === undefined) setInternal(!open);
    onOpenChange?.(!open);
  };

  return (
    <div className={mergeClasses(s.root, filled && s.filled, className)} {...rest}>
      <Heading className={s.heading}>
        <button type="button" className={s.toggle} aria-expanded={open} aria-controls={`${id}-panel`} onClick={toggle}>
          {icon}
          <span className={s.title}>{title}</span>
          <ChevronDownIcon aria-hidden="true" className={mergeClasses(s.chevron, open && s.chevronOpen)} />
        </button>
      </Heading>
      <div id={`${id}-panel`} role="region" aria-label={typeof title === 'string' ? title : undefined} className={mergeClasses(s.panel, open && s.panelOpen)}>
        <div className={s.inner}>
          <div className={s.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
