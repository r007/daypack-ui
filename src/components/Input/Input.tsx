import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Shared "underlined field" look, reused by Textarea. */
export const useFieldStyles = makeStyles({
  field: {
    backgroundColor: vars.color.bgPrimary,
    display: 'block',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    borderRadius: 0,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.heading7,
    fontWeight: vars.fontWeight.medium,
    lineHeight: 24 / 16,
    minHeight: '56px',
    paddingTop: `${17 / 16}em`,
    paddingBottom: `${15 / 16}em`,
    paddingLeft: 0,
    paddingRight: 0,
    transitionProperty: 'background-color, border-bottom-color, color',
    transitionDuration: vars.duration.fast,
    width: '100%',
    outlineStyle: 'none',
    ':focus': { borderBottomColor: vars.color.linkPrimary },
    ':disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

/** Text field with the design's underline style. Accepts every native `<input>` attribute. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', className, ...rest },
  ref,
) {
  const s = useFieldStyles();
  return <input ref={ref} type={type} className={mergeClasses(s.field, className)} {...rest} />;
});
