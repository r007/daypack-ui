import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { FloatingPanel } from '../_internal/Floating';
import { ChevronDownIcon, CloseIcon } from '../Icon/icons';

export interface ComboboxOption {
  /** Unique value. */
  value: string;
  /** Text shown and matched against what the user types. */
  label: string;
  /** Secondary line, e.g. region or category. */
  description?: React.ReactNode;
  disabled?: boolean;
}

interface Base extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'role'> {
  /** Choices. Plain strings use the string as value and label. */
  options: (ComboboxOption | string)[];
  /**
   * Called as the user types. Use it to fetch results asynchronously, and
   * pass the results back through `options` (and turn off `filter`).
   */
  onInputChange?: (text: string) => void;
  /**
   * Filter `options` by the typed text (case-insensitive substring).
   * Provide a function for custom matching, or `false` when options are
   * already filtered by the server.
   * @default true
   */
  filter?: boolean | ((option: ComboboxOption, query: string) => boolean);
  /** Show a loading message instead of options. */
  loading?: boolean;
  /**
   * Text shown when nothing matches.
   * @default 'No results'
   */
  emptyMessage?: string;
  /**
   * Text shown while `loading`.
   * @default 'Loading…'
   */
  loadingMessage?: string;
}

export type ComboboxProps = Base &
  (
    | {
        multiple?: false;
        /** Controlled selected option value. */
        value?: string | null;
        defaultValue?: string | null;
        onValueChange?: (value: string | null) => void;
      }
    | {
        /** Allow several selections, shown as removable chips. */
        multiple: true;
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
      }
  );

const useStyles = makeStyles({
  root: { fontFamily: vars.font.sans, position: 'relative', width: '100%' },
  control: {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    columnGap: '6px',
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '56px',
    rowGap: '6px',
    ':focus-within': { borderBottomColor: vars.color.linkPrimary },
  },
  input: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    color: vars.color.textPrimary,
    flex: '1 1 120px',
    fontFamily: 'inherit',
    fontSize: vars.fontSize.heading7,
    fontWeight: vars.fontWeight.medium,
    minWidth: 0,
    outlineStyle: 'none',
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  chip: {
    alignItems: 'center',
    backgroundColor: vars.color.bgSecondary,
    borderRadius: '16px',
    color: vars.color.textPrimary,
    columnGap: '6px',
    display: 'inline-flex',
    fontSize: '13px',
    paddingTop: '4px',
    paddingRight: '4px',
    paddingBottom: '4px',
    paddingLeft: '12px',
  },
  chipRemove: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: '100%',
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '10px',
    height: '20px',
    justifyContent: 'center',
    width: '20px',
    ':hover': { backgroundColor: vars.color.borderLight },
    ':focus-visible': focusRing,
  },
  chevron: { color: vars.color.textLight, fontSize: '10px', marginRight: '4px', pointerEvents: 'none' },
  listbox: {
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '4px',
    boxShadow: `0 8px 24px color-mix(in srgb, ${vars.color.shadowPrimary} 20%, transparent)`,
    boxSizing: 'border-box',
    listStyleType: 'none',
    margin: 0,
    maxHeight: '280px',
    overflowY: 'auto',
    padding: 0,
  },
  option: { cursor: 'pointer', display: 'block', fontSize: '15px', lineHeight: 1.3, paddingTop: '10px', paddingRight: '16px', paddingBottom: '10px', paddingLeft: '16px' },
  optionActive: { backgroundColor: vars.color.bgSecondary },
  optionSelected: { color: vars.color.linkPrimary, fontWeight: vars.fontWeight.medium },
  optionDisabled: { color: vars.color.accentGray, cursor: 'not-allowed' },
  optionDescription: { color: vars.color.textLight, display: 'block', fontSize: '12px', marginTop: '2px' },
  message: { color: vars.color.textLight, fontSize: '14px', paddingTop: '12px', paddingRight: '16px', paddingBottom: '12px', paddingLeft: '16px' },
});

const normalize = (option: ComboboxOption | string): ComboboxOption => (typeof option === 'string' ? { value: option, label: option } : option);

/**
 * Autocomplete following the WAI-ARIA 1.2 combobox pattern: focus stays in
 * the text field while arrow keys move a highlighted option
 * (`aria-activedescendant`), Enter selects, Esc closes. Supports async
 * options and multiple selection with chips. Replaces `Typeahead`.
 *
 * @example
 * <Combobox aria-label="Destination" options={['Paris', 'Lisbon', 'Kyoto']} onValueChange={setPlace} />
 */
export function Combobox(props: ComboboxProps) {
  const {
    options: rawOptions,
    onInputChange,
    filter = true,
    loading = false,
    emptyMessage = 'No results',
    loadingMessage = 'Loading…',
    multiple: _multiple,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    className,
    disabled,
    placeholder,
    onKeyDown,
    onFocus,
    onBlur,
    ...rest
  } = props as Base & {
    multiple?: boolean;
    value?: unknown;
    defaultValue?: unknown;
    onValueChange?: unknown;
  };
  const s = useStyles();
  const id = React.useId();
  const listboxId = `${id}-listbox`;
  const isMulti = props.multiple === true;

  const options = React.useMemo(() => rawOptions.map(normalize), [rawOptions]);
  const byValue = React.useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);

  const [internal, setInternal] = React.useState<string | null | string[]>(() => props.defaultValue ?? (isMulti ? [] : null));
  const selected = props.value !== undefined ? props.value : internal;
  const selectedValues = React.useMemo<string[]>(
    () => (isMulti ? ((selected as string[]) ?? []) : selected ? [selected as string] : []),
    [isMulti, selected],
  );

  const [text, setText] = React.useState(() => (!isMulti && selected ? (byValue.get(selected as string)?.label ?? '') : ''));
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [width, setWidth] = React.useState<number | undefined>();
  const controlRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const visible = React.useMemo(() => {
    const query = text.trim().toLowerCase();
    const showAll = !isMulti && selectedValues.length > 0 && byValue.get(selectedValues[0]!)?.label === text;
    let list = options;
    if (filter && query && !showAll) {
      list = options.filter((o) => (typeof filter === 'function' ? filter(o, query) : o.label.toLowerCase().includes(query)));
    }
    return list;
  }, [options, text, filter, isMulti, selectedValues, byValue]);

  React.useLayoutEffect(() => {
    if (open && controlRef.current) setWidth(controlRef.current.getBoundingClientRect().width);
  }, [open]);

  const commit = (next: string | null | string[]) => {
    if (props.value === undefined) setInternal(next);
    (props.onValueChange as ((v: unknown) => void) | undefined)?.(next);
  };

  const select = (option: ComboboxOption) => {
    if (option.disabled) return;
    if (isMulti) {
      const current = selectedValues;
      commit(current.includes(option.value) ? current.filter((v) => v !== option.value) : [...current, option.value]);
      setText('');
      onInputChange?.('');
    } else {
      commit(option.value);
      setText(option.label);
      onInputChange?.(option.label);
      setOpen(false);
    }
  };

  const optionId = (index: number) => `${id}-option-${index}`;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const last = visible.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) setOpen(true);
        else setActive((index) => Math.min(index + 1, last));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) setOpen(true);
        else setActive((index) => Math.max(index - 1, 0));
        break;
      case 'Home':
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (open) {
          event.preventDefault();
          setActive(Math.max(last, 0));
        }
        break;
      case 'Enter':
        if (open && visible[active]) {
          event.preventDefault();
          select(visible[active]!);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else if (!isMulti && text) {
          setText('');
          commit(null);
        }
        break;
      case 'Backspace':
        if (isMulti && !text && selectedValues.length) commit(selectedValues.slice(0, -1));
        break;
      default:
    }
  };

  const showList = open && !disabled;

  return (
    <div className={mergeClasses(s.root, className)}>
      <div ref={controlRef} className={s.control} onClick={() => inputRef.current?.focus()}>
        {isMulti &&
          selectedValues.map((value) => (
            <span key={value} className={s.chip}>
              {byValue.get(value)?.label ?? value}
              <button
                type="button"
                className={s.chipRemove}
                aria-label={`Remove ${byValue.get(value)?.label ?? value}`}
                onClick={(event) => {
                  event.stopPropagation();
                  commit(selectedValues.filter((v) => v !== value));
                }}
              >
                <CloseIcon aria-hidden="true" />
              </button>
            </span>
          ))}
        <input
          {...rest}
          ref={inputRef}
          className={s.input}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-activedescendant={showList && visible[active] ? optionId(active) : undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setActive(0);
            setOpen(true);
            onInputChange?.(event.target.value);
            if (!isMulti && selectedValues.length) commit(null);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            setOpen(true);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            setOpen(false);
            // Restore the label of the committed option if the user typed something else.
            if (!isMulti) setText(selectedValues[0] ? (byValue.get(selectedValues[0])?.label ?? text) : text);
            else setText('');
          }}
          onKeyDown={handleKeyDown}
        />
        <ChevronDownIcon aria-hidden="true" className={s.chevron} />
      </div>
      <FloatingPanel
        anchorRef={controlRef}
        open={showList}
        mode="manual"
        placement="bottom-start"
        offset={4}
        style={{ width }}
        className={s.listbox}
      >
        <ul id={listboxId} role="listbox" aria-multiselectable={isMulti || undefined} className={s.listbox} style={{ boxShadow: 'none', maxHeight: 'inherit' }}>
          {loading && <li role="presentation" className={s.message}>{loadingMessage}</li>}
          {!loading && visible.length === 0 && <li role="presentation" className={s.message}>{emptyMessage}</li>}
          {!loading &&
            visible.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={mergeClasses(s.option, index === active && s.optionActive, isSelected && s.optionSelected, option.disabled && s.optionDisabled)}
                  // mousedown (not click) so the input does not lose focus first.
                  onMouseDown={(event) => {
                    event.preventDefault();
                    select(option);
                  }}
                  onMouseMove={() => setActive(index)}
                >
                  {option.label}
                  {option.description && <span className={s.optionDescription}>{option.description}</span>}
                </li>
              );
            })}
        </ul>
      </FloatingPanel>
    </div>
  );
}
