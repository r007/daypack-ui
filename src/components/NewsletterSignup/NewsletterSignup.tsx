import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { typography } from '../../theme/typography';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { VisuallyHidden } from '../VisuallyHidden';

export interface NewsletterSignupProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'title'> {
  /**
   * Called with the email (and consent) when the form is valid. Return a
   * promise: the form shows a busy state until it settles, and a rejection
   * shows `errorMessage` (or the error's message).
   */
  onSubmit: (data: { email: string; consent: boolean }) => void | Promise<void>;
  /** Heading. */
  title?: React.ReactNode;
  /** Supporting line under the heading. */
  subtitle?: React.ReactNode;
  /**
   * Placeholder text of the email field.
   * @default 'Enter your email address'
   */
  placeholder?: string;
  /**
   * Submit button text.
   * @default 'Sign up'
   */
  submitLabel?: string;
  /**
   * Show a required consent checkbox with this label (e.g. GDPR opt-in).
   */
  consentLabel?: React.ReactNode;
  /**
   * Shown after a successful submission instead of the form.
   * @default { title: 'Thanks for signing up', text: 'Please check your inbox to confirm.' }
   */
  confirmation?: { title: React.ReactNode; text?: React.ReactNode };
  /**
   * Generic error text when `onSubmit` rejects without a message.
   * @default 'Something went wrong. Please try again.'
   */
  errorMessage?: string;
  /** Extra form content, e.g. a captcha widget rendered by your app. */
  children?: React.ReactNode;
}

const useStyles = makeStyles({
  root: { backgroundColor: vars.color.bgSecondary, boxSizing: 'border-box', color: vars.color.textPrimary, fontFamily: vars.font.sans, paddingTop: '32px', paddingBottom: '32px', paddingLeft: '24px', paddingRight: '24px', [media({ minWidth: 768 })]: { paddingLeft: '48px', paddingRight: '48px' } },
  title: { ...typography.heading(5, 'regular'), margin: 0 },
  subtitle: { color: vars.color.textSecondary, fontSize: vars.fontSize.heading7, margin: 0, marginTop: '8px' },
  row: { alignItems: 'flex-end', columnGap: '24px', display: 'flex', flexDirection: 'column', marginTop: '16px', rowGap: '16px', [media({ minWidth: 600 })]: { flexDirection: 'row' } },
  field: { flexGrow: 1, width: '100%' },
  consent: { marginTop: '16px' },
  error: { color: vars.color.accentRed, fontSize: '14px', marginTop: '12px' },
});

/**
 * Email newsletter form with consent, busy, error and confirmation states.
 * Bring your own request logic through `onSubmit`; bot protection can be added
 * through `children`. Replaces the captcha-coupled legacy `Newsletter`.
 *
 * @example
 * <NewsletterSignup title="Get inspired" onSubmit={({ email }) => api.subscribe(email)} />
 */
export function NewsletterSignup({
  onSubmit,
  title,
  subtitle,
  placeholder = 'Enter your email address',
  submitLabel = 'Sign up',
  consentLabel,
  confirmation = { title: 'Thanks for signing up', text: 'Please check your inbox to confirm.' },
  errorMessage = 'Something went wrong. Please try again.',
  className,
  children,
  ...rest
}: NewsletterSignupProps) {
  const s = useStyles();
  const errorId = React.useId();
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');

  if (status === 'success') {
    return (
      <div role="status" className={mergeClasses(s.root, className)}>
        <h2 className={s.title}>{confirmation.title}</h2>
        {confirmation.text && <p className={s.subtitle}>{confirmation.text}</p>}
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('submitting');
    try {
      await onSubmit({ email: String(form.get('email') ?? ''), consent: form.get('consent') === 'on' });
      setStatus('success');
    } catch (error) {
      setMessage(error instanceof Error && error.message ? error.message : errorMessage);
      setStatus('error');
    }
  };

  return (
    <form className={mergeClasses(s.root, className)} onSubmit={handleSubmit} {...rest}>
      {title && <h2 className={s.title}>{title}</h2>}
      {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      <div className={s.row}>
        <label className={s.field}>
          <VisuallyHidden>Email address</VisuallyHidden>
          <Input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={placeholder}
            aria-describedby={status === 'error' ? errorId : undefined}
            aria-invalid={status === 'error' ? true : undefined}
          />
        </label>
        <Button type="submit" size="small" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : submitLabel}
        </Button>
      </div>
      {consentLabel && (
        <div className={s.consent}>
          <Checkbox name="consent" required label={consentLabel} size={16} />
        </div>
      )}
      {children}
      <div id={errorId} role="alert" className={s.error}>
        {status === 'error' ? message : null}
      </div>
    </form>
  );
}
