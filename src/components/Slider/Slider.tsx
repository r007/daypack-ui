import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';

const thumb = {
  appearance: 'none',
  backgroundColor: vars.color.bgPrimary,
  borderRadius: '100%',
  borderTopWidth: '2px',
  borderRightWidth: '2px',
  borderBottomWidth: '2px',
  borderLeftWidth: '2px',
  borderTopStyle: 'solid',
  borderRightStyle: 'solid',
  borderBottomStyle: 'solid',
  borderLeftStyle: 'solid',
  borderTopColor: vars.color.linkPrimary,
  borderRightColor: vars.color.linkPrimary,
  borderBottomColor: vars.color.linkPrimary,
  borderLeftColor: vars.color.linkPrimary,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  boxSizing: 'border-box',
  cursor: 'pointer',
  height: '24px',
  pointerEvents: 'auto',
  width: '24px',
} as const;

const useStyles = makeStyles({
  single: {
    appearance: 'none',
    background: 'linear-gradient(to right, var(--dp-slider-fill, #297cbb) var(--dp-slider-pct, 0%), var(--dp-slider-track, #e4e4e4) var(--dp-slider-pct, 0%))',
    borderRadius: '2px',
    height: '4px',
    margin: '10px 0',
    width: '100%',
    ':focus-visible': focusRing,
    '::-webkit-slider-thumb': thumb,
    '::-moz-range-thumb': thumb,
    ':disabled': { opacity: 0.5 },
  },
  rangeWrap: { height: '24px', position: 'relative', width: '100%' },
  rangeTrack: { backgroundColor: vars.color.borderPrimary, borderRadius: '2px', height: '4px', left: 0, position: 'absolute', right: 0, top: '10px' },
  rangeFill: { backgroundColor: vars.color.linkPrimary, borderRadius: '2px', height: '100%', position: 'absolute' },
  rangeInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    height: '24px',
    left: 0,
    margin: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    width: '100%',
    ':focus-visible': { outlineStyle: 'none' },
    ':focus-visible::-webkit-slider-thumb': { outlineStyle: 'solid', outlineWidth: '2px', outlineColor: vars.color.linkPrimary, outlineOffset: '2px' },
    '::-webkit-slider-thumb': thumb,
    '::-moz-range-thumb': thumb,
  },
  group: { borderTopWidth: 0, borderRightWidth: 0, borderBottomWidth: 0, borderLeftWidth: 0, margin: 0, minWidth: 0, padding: 0 },
  legend: { clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', width: '1px' },
  output: { color: vars.color.textLight, display: 'flex', fontFamily: vars.font.sans, fontSize: '13px', justifyContent: 'space-between', marginTop: '4px' },
});

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
}

/**
 * Single-value slider on the native range input: full keyboard support
 * (arrows, Home/End, Page keys) and touch behaviour come from the browser.
 *
 * @example
 * <Slider aria-label="Maximum distance" min={1} max={50} defaultValue={10} />
 */
export function Slider({ value, defaultValue = 0, onValueChange, min = 0, max = 100, step = 1, className, style, ...rest }: SliderProps) {
  const s = useStyles();
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const pct = max === min ? 0 : ((current - min) / (max - min)) * 100;
  return (
    <input
      {...rest}
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      className={mergeClasses(s.single, className)}
      style={{ '--dp-slider-pct': `${pct}%`, ...style } as React.CSSProperties}
      onChange={(event) => {
        const next = Number(event.target.value);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }}
    />
  );
}

export interface RangeSliderProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue' | 'value'> {
  /** Accessible name of the group, e.g. "Price". */
  label: string;
  /** Controlled `[low, high]`. */
  value?: [number, number];
  /** Initial `[low, high]` when uncontrolled. Defaults to the full span. */
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /**
   * Accessible names of the two thumbs.
   * @default ['Minimum', 'Maximum']
   */
  thumbLabels?: [string, string];
  /** Format the values shown under the slider (e.g. as currency). */
  formatValue?: (value: number) => string;
}

/**
 * Two-thumb range slider made of two native range inputs inside a labelled
 * group, so each thumb is a real, separately announced slider.
 *
 * @example
 * <RangeSlider label="Price" min={0} max={500} defaultValue={[50, 250]} formatValue={(v) => `$${v}`} />
 */
export function RangeSlider({
  label,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  thumbLabels = ['Minimum', 'Maximum'],
  formatValue = String,
  className,
  ...rest
}: RangeSliderProps) {
  const s = useStyles();
  const [internal, setInternal] = React.useState<[number, number]>(defaultValue ?? [min, max]);
  const [low, high] = value ?? internal;
  const span = max - min || 1;

  const commit = (next: [number, number]) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <fieldset className={mergeClasses(s.group, className)} {...rest}>
      <legend className={s.legend}>{label}</legend>
      <div className={s.rangeWrap}>
        <div className={s.rangeTrack}>
          <div className={s.rangeFill} style={{ left: `${((low - min) / span) * 100}%`, right: `${100 - ((high - min) / span) * 100}%` }} />
        </div>
        <input
          className={s.rangeInput}
          type="range"
          aria-label={thumbLabels[0]}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(event) => commit([Math.min(Number(event.target.value), high), high])}
        />
        <input
          className={s.rangeInput}
          type="range"
          aria-label={thumbLabels[1]}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(event) => commit([low, Math.max(Number(event.target.value), low)])}
        />
      </div>
      <div className={s.output} aria-hidden="true">
        <span>{formatValue(low)}</span>
        <span>{formatValue(high)}</span>
      </div>
    </fieldset>
  );
}
