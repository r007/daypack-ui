import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { blueLink, underlinedLink } from '../../theme/mixins';
import { focusRing } from '../../theme/focus';

export type LinkVariant = 'plain' | 'blue' | 'underlined';

interface LinkOwnProps<C extends React.ElementType> {
  /**
   * Element or component to render. Pass your router's link
   * (`as={RouterLink}`) to keep client-side navigation without this library
   * depending on any router.
   */
  as?: C;
  /**
   * `plain` inherits color; `blue` is the standard hyperlink; `underlined`
   * draws a soft underline that breaks around descenders.
   * @default 'plain'
   */
  variant?: LinkVariant;
  className?: string;
}

export type LinkProps<C extends React.ElementType = 'a'> = LinkOwnProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof LinkOwnProps<C>>;

const useStyles = makeStyles({
  plain: { ':focus-visible': focusRing },
  blue: blueLink,
  underlined: underlinedLink,
});

/**
 * Anchor with the design's link treatments. All other props are passed to the
 * rendered element (`href`, `target`, `to` for router links, …).
 *
 * @example
 * <Link href="/guide" variant="blue">Read the guide</Link>
 * <Link as={RouterLink} to="/guide" variant="underlined">Read the guide</Link>
 */
export function Link<C extends React.ElementType = 'a'>({
  as,
  variant = 'plain',
  className,
  ...rest
}: LinkProps<C>) {
  const s = useStyles();
  const Component: React.ElementType = as ?? 'a';
  return <Component className={mergeClasses(s[variant], className)} {...rest} />;
}
