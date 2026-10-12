import * as React from 'react';
import { mergeClasses } from '@griffel/react';
import { useBarStyles } from '../_internal/bar';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  return ctx;
}

const slug = (value: string) => value.replace(/\s+/g, '-');

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled selected tab `value`. Pair with `onValueChange`. */
  value?: string;
  /** Initially selected tab (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the `value` of the tab the user selected. */
  onValueChange?: (value: string) => void;
}

/**
 * Tabbed interface following the WAI-ARIA tabs pattern: roving tabindex,
 * Left/Right/Home/End navigation, automatic activation.
 *
 * Structure: one `TabList` containing `Tab`s, followed by one `TabPanel` per
 * tab. A `Tab` and its `TabPanel` are linked by the same `value`.
 *
 * @example
 * <Tabs defaultValue="overview">
 *   <TabList aria-label="Destination"><Tab value="overview">Overview</Tab><Tab value="tips">Tips</Tab></TabList>
 *   <TabPanel value="overview">…</TabPanel>
 *   <TabPanel value="tips">…</TabPanel>
 * </Tabs>
 */
export function Tabs({ value, defaultValue, onValueChange, children, ...rest }: TabsProps) {
  const baseId = React.useId();
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const current = value ?? internal;

  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  const ctx = React.useMemo(() => ({ baseId, value: current, setValue }), [baseId, current, setValue]);

  return (
    <TabsContext.Provider value={ctx}>
      <div {...rest}>{children}</div>
    </TabsContext.Provider>
  );
}

export type TabListProps = React.HTMLAttributes<HTMLDivElement>;

/** Row of <Tab>s. Provide an `aria-label`. Supports Arrow/Home/End keys. */
export function TabList({ className, onKeyDown, children, ...rest }: TabListProps) {
  const s = useBarStyles();
  const ctx = useTabs('TabList');
  const ref = React.useRef<HTMLDivElement>(null);

  // With no explicit selection, select the first enabled tab.
  React.useEffect(() => {
    if (ctx.value !== undefined) return;
    const first = ref.current?.querySelector<HTMLElement>('[role="tab"]:not(:disabled)');
    const v = first?.dataset.value;
    if (v) ctx.setValue(v);
  }, [ctx]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = [...(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const last = tabs.length - 1;
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === undefined) return;
    event.preventDefault();
    const target = tabs[next];
    target?.focus();
    target?.click(); // automatic activation
  };

  return (
    <div className={mergeClasses(s.nav)}>
      <div
        ref={ref}
        role="tablist"
        className={mergeClasses(s.list, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}

export interface TabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Identifier shared with the matching `TabPanel`. Unique within the `Tabs`. */
  value: string;
}

/** A single tab button. Must be a descendant of `TabList`. Accepts all `<button>` attributes. */
export function Tab({ value, className, onClick, ...rest }: TabProps) {
  const s = useBarStyles();
  const ctx = useTabs('Tab');
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${slug(value)}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${slug(value)}`}
      tabIndex={selected ? 0 : -1}
      className={mergeClasses(s.item, selected && s.current, className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) ctx.setValue(value);
      }}
      {...rest}
    />
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The `value` of the `Tab` that controls this panel. Inactive panels stay mounted but hidden. */
  value: string;
}

/** Content area shown while its `Tab` is selected. */
export function TabPanel({ value, ...rest }: TabPanelProps) {
  const ctx = useTabs('TabPanel');
  const selected = ctx.value === value;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${slug(value)}`}
      aria-labelledby={`${ctx.baseId}-tab-${slug(value)}`}
      hidden={!selected}
      tabIndex={0}
      {...rest}
    />
  );
}
