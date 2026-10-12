import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: boolean;
  disabled?: boolean;
}

export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label text. */
  label: React.ReactNode;
  /** Help text shown under the control and announced with it. */
  hint?: React.ReactNode;
  /**
   * Error message. When set the control is marked `aria-invalid` and the
   * message is announced; the label and hint stay in place.
   */
  error?: React.ReactNode;
  /** Mark the control as required and show an asterisk. */
  required?: boolean;
  disabled?: boolean;
  /**
   * Either a single element (it receives `id`, `aria-describedby`,
   * `aria-invalid`, `required`, `disabled` through `cloneElement`) or a render
   * function if you need to place those props yourself.
   */
  children: React.ReactElement<Record<string, unknown>> | ((props: FieldControlProps) => React.ReactNode);
}

const useStyles = makeStyles({
  root: { color: vars.color.textPrimary, fontFamily: vars.font.sans },
  label: { display: 'block', fontSize: '13px', fontWeight: vars.fontWeight.medium, marginBottom: '4px' },
  asterisk: { color: vars.color.accentRed, marginLeft: '2px' },
  hint: { color: vars.color.textLight, fontSize: '13px', marginTop: '4px' },
  error: { color: vars.color.accentRed, fontSize: '13px', marginTop: '4px' },
});

/**
 * Label + control + hint + error wiring for any form control: generates ids,
 * links the label with `htmlFor`, and sets `aria-describedby` / `aria-invalid`
 * so errors are announced. Replaces the react-validate-form based `Form*`
 * components; validation itself stays in your app or form library.
 *
 * @example
 * <Field label="Email" hint="We never share it" error={errors.email} required>
 *   <Input type="email" />
 * </Field>
 */
export function Field({ label, hint, error, required, disabled, children, className, ...rest }: FieldProps) {
  const s = useStyles();
  const id = React.useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  const controlProps: FieldControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    required,
    disabled,
  };

  const control = typeof children === 'function' ? children(controlProps) : React.cloneElement(children, controlProps as unknown as Record<string, unknown>);

  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      <label htmlFor={id} className={s.label}>
        {label}
        {required && (
          <span aria-hidden="true" className={s.asterisk}>
            *
          </span>
        )}
      </label>
      {control}
      {hint && (
        <div id={hintId} className={s.hint}>
          {hint}
        </div>
      )}
      <div id={errorId} role={error ? 'alert' : undefined} className={error ? s.error : undefined}>
        {error}
      </div>
    </div>
  );
}
