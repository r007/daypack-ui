import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { AppleIcon, FacebookBlockColorIcon, GoogleColorIcon, TwitterColorIcon } from '../Icon/icons';

export type SocialProvider = 'google' | 'facebook' | 'twitter' | 'apple';

export interface SocialLoginButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Identity provider; sets the icon. */
  provider: SocialProvider;
  /** Button text, e.g. "Continue with Google". */
  children: React.ReactNode;
}

const ICONS: Record<SocialProvider, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  google: GoogleColorIcon,
  facebook: FacebookBlockColorIcon,
  twitter: TwitterColorIcon,
  apple: AppleIcon,
};

const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '4px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    boxSizing: 'border-box',
    color: vars.color.textPrimary,
    columnGap: '12px',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: vars.font.sans,
    fontSize: '14px',
    fontWeight: vars.fontWeight.medium,
    justifyContent: 'center',
    minHeight: '48px',
    paddingLeft: '16px',
    paddingRight: '16px',
    width: '100%',
    ':hover': { backgroundColor: vars.color.bgSecondary },
    ':focus-visible': focusRing,
    ':disabled': { cursor: 'not-allowed', opacity: 0.5 },
  },
  icon: { fontSize: '20px' },
});

/**
 * Full-width "continue with …" button for an identity provider.
 *
 * @example
 * <SocialLoginButton provider="google" onClick={signInWithGoogle}>Continue with Google</SocialLoginButton>
 */
export function SocialLoginButton({ provider, children, className, ...rest }: SocialLoginButtonProps) {
  const s = useStyles();
  const Icon = ICONS[provider];
  return (
    <button type="button" className={mergeClasses(s.root, className)} {...rest}>
      <Icon className={s.icon} />
      <span>{children}</span>
    </button>
  );
}
