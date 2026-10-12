import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { focusRing } from '../../theme/focus';
import { PlusIcon } from '../Icon/icons';

interface AccordionContextValue {
  baseId: string;
  expanded: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /**
   * `single` keeps at most one item open (opening one closes the others);
   * `multiple` lets any number be open.
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /** Controlled list of expanded item `value`s. Pair with `onValueChange`. */
  value?: string[];
  /**
   * Initially expanded item `value`s (uncontrolled).
   * @default []
   */
  defaultValue?: string[];
  /** Called with the new list of expanded `value`s whenever an item is toggled. */
  onValueChange?: (value: string[]) => void;
}

const TRIGGER_ATTR = 'data-dp-accordion-trigger';

const useStyles = makeStyles({
  root: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: vars.color.borderPrimary,
    maxWidth: '1290px',
  },
  item: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
  },
  heading: { margin: 0 },
  trigger: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: vars.font.sans,
    fontSize: '20px',
    fontWeight: 300,
    justifyContent: 'space-between',
    lineHeight: 24 / 20,
    paddingTop: '29px',
    paddingRight: 0,
    paddingBottom: '26px',
    paddingLeft: 0,
    textAlign: 'left',
    transitionProperty: 'color',
    transitionDuration: vars.duration.fast,
    transitionTimingFunction: 'ease-in-out',
    width: '100%',
    ':hover': { color: vars.color.linkPrimary },
    ':focus-visible': { ...focusRing, color: vars.color.linkPrimary },
    [media({ minWidth: 768 })]: { fontSize: '28px', lineHeight: 34 / 28, paddingTop: '44px', paddingBottom: '39px' },
  },
  icon: {
    flexShrink: 0,
    fontSize: '12px',
    marginLeft: '16px',
    marginRight: '8px',
    transitionProperty: 'transform',
    transitionDuration: vars.duration.fast,
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
    [media({ minWidth: 768 })]: { fontSize: '22px', marginRight: '30px' },
  },
  iconOpen: { transform: 'rotate(45deg)' },
  // Animates height without measuring: 0fr → 1fr. Visibility keeps collapsed
  // content out of the tab order and accessibility tree once the transition ends.
  panel: {
    display: 'grid',
    gridTemplateRows: '0fr',
    visibility: 'hidden',
    transitionProperty: 'grid-template-rows, visibility',
    transitionDuration: vars.duration.slow,
    transitionTimingFunction: 'ease-in-out',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  panelOpen: { gridTemplateRows: '1fr', visibility: 'visible' },
  panelInner: { minHeight: 0, overflow: 'hidden' },
  content: {
    paddingBottom: '32px',
    [media({ minWidth: 768 })]: { paddingBottom: '48px' },
  },
});

/**
 * Vertically stacked set of collapsible sections. Headers are real buttons
 * with `aria-expanded`; Up/Down/Home/End move focus between headers.
 *
 * @example
 * <Accordion type="multiple" defaultValue={['visas']}>
 *   <AccordionItem value="visas" heading="Visas">…</AccordionItem>
 *   <AccordionItem value="money" heading="Money">…</AccordionItem>
 * </Accordion>
 */
export function Accordion({
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  className,
  children,
  onKeyDown,
  ...rest
}: AccordionProps) {
  const s = useStyles();
  const baseId = React.useId();
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const expanded = value ?? internal;

  const toggle = React.useCallback(
    (itemValue: string) => {
      const isOpen = expanded.includes(itemValue);
      let next: string[];
      if (type === 'multiple') next = isOpen ? expanded.filter((v) => v !== itemValue) : [...expanded, itemValue];
      else next = isOpen ? [] : [itemValue];
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [expanded, type, value, onValueChange],
  );

  const ctx = React.useMemo(() => ({ baseId, expanded, toggle }), [baseId, expanded, toggle]);

  // Optional APG keyboard model: Up/Down/Home/End move between headers.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const triggers = [...event.currentTarget.querySelectorAll<HTMLButtonElement>(`[${TRIGGER_ATTR}]:not(:disabled)`)];
    const index = triggers.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const target =
      event.key === 'Home' ? 0
        : event.key === 'End' ? triggers.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
    triggers[target]?.focus();
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={mergeClasses(s.root, className)} onKeyDown={handleKeyDown} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Identifier, unique within the accordion. Used by `value` / `defaultValue` / `onValueChange`. */
  value: string;
  /** Header content (shown inside the toggle button). */
  heading: React.ReactNode;
  /**
   * Semantic heading level wrapping the toggle button; match your document outline.
   * @default 3
   */
  level?: 2 | 3 | 4 | 5 | 6;
  /**
   * Prevent toggling and remove from keyboard navigation.
   * @default false
   */
  disabled?: boolean;
}

/** One section of an `Accordion`: a header button and its collapsible content (`children`). */
export function AccordionItem({
  value,
  heading,
  level = 3,
  disabled,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  const s = useStyles();
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be rendered inside <Accordion>.');

  const open = ctx.expanded.includes(value);
  const slug = value.replace(/\s+/g, '-');
  const triggerId = `${ctx.baseId}-trigger-${slug}`;
  const panelId = `${ctx.baseId}-panel-${slug}`;
  const Heading = `h${level}` as const;

  return (
    <div className={mergeClasses(s.item, className)} {...rest}>
      <Heading className={s.heading}>
        <button
          type="button"
          id={triggerId}
          className={s.trigger}
          aria-expanded={open}
          aria-controls={panelId}
          disabled={disabled}
          onClick={() => ctx.toggle(value)}
          {...{ [TRIGGER_ATTR]: '' }}
        >
          <span>{heading}</span>
          <PlusIcon className={mergeClasses(s.icon, open && s.iconOpen)} />
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={triggerId} className={mergeClasses(s.panel, open && s.panelOpen)}>
        <div className={s.panelInner}>
          <div className={s.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}
