import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { CheckmarkIcon } from '../Icon/icons';
import { VisuallyHidden } from '../VisuallyHidden';

export interface Step {
  label: string;
  /** Optional second line. */
  description?: string;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: Step[];
  /** Index of the active step (0-based). Earlier steps show as completed. */
  current: number;
  /**
   * Screen-reader suffixes.
   * @default { completed: 'completed', current: 'current step' }
   */
  statusLabels?: { completed: string; current: string };
}

const useStyles = makeStyles({
  list: { display: 'flex', flexDirection: 'column', fontFamily: vars.font.sans, listStyleType: 'none', margin: 0, padding: 0, rowGap: '16px', [media({ minWidth: 600 })]: { columnGap: '16px', flexDirection: 'row' } },
  step: { alignItems: 'flex-start', columnGap: '12px', display: 'flex', flex: '1 1 0', minWidth: 0 },
  marker: {
    alignItems: 'center',
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
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    boxSizing: 'border-box',
    color: vars.color.textLight,
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: '13px',
    fontWeight: vars.fontWeight.medium,
    height: '32px',
    justifyContent: 'center',
    width: '32px',
  },
  markerCurrent: { borderTopColor: vars.color.linkPrimary, borderRightColor: vars.color.linkPrimary, borderBottomColor: vars.color.linkPrimary, borderLeftColor: vars.color.linkPrimary, color: vars.color.linkPrimary },
  markerDone: { backgroundColor: vars.color.linkPrimary, borderTopColor: vars.color.linkPrimary, borderRightColor: vars.color.linkPrimary, borderBottomColor: vars.color.linkPrimary, borderLeftColor: vars.color.linkPrimary, color: vars.color.textOverlay },
  text: { display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: '5px' },
  label: { color: vars.color.textLight, fontSize: '14px', fontWeight: vars.fontWeight.medium },
  labelActive: { color: vars.color.textPrimary },
  description: { color: vars.color.textLight, fontSize: '12px', marginTop: '2px' },
});

/**
 * Progress through a multi-step flow (checkout, onboarding). A real ordered
 * list: assistive technology announces the step number and whether it is
 * complete or current. Replaces the legacy `MultiStep` header.
 *
 * @example
 * <Stepper current={1} steps={[{ label: 'Details' }, { label: 'Payment' }, { label: 'Confirm' }]} />
 */
export function Stepper({ steps, current, statusLabels = { completed: 'completed', current: 'current step' }, className, ...rest }: StepperProps) {
  const s = useStyles();
  return (
    <ol className={mergeClasses(s.list, className)} {...rest}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.label} className={s.step} aria-current={active ? 'step' : undefined}>
            <span aria-hidden="true" className={mergeClasses(s.marker, active && s.markerCurrent, done && s.markerDone)}>
              {done ? <CheckmarkIcon /> : index + 1}
            </span>
            <span className={s.text}>
              <span className={mergeClasses(s.label, (active || done) && s.labelActive)}>
                {step.label}
                {(done || active) && <VisuallyHidden> ({done ? statusLabels.completed : statusLabels.current})</VisuallyHidden>}
              </span>
              {step.description && <span className={s.description}>{step.description}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
