import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { blueLink } from '../../theme/mixins';
import { typography } from '../../theme/typography';
import { GlobeIcon, MobileIcon, PinIcon } from '../Icon/icons';

export interface ContactBarProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Phone number in any readable format; becomes a `tel:` link. */
  phone?: string;
  /** Website URL; opens in a new tab. */
  website?: string;
  /**
   * Where to get directions: an address string, or `[latitude, longitude]`.
   * Links to a maps directions page.
   */
  directions?: string | [number, number];
  /**
   * Visible link texts.
   * @default { phone: 'Call', website: 'Website', directions: 'Directions' }
   */
  labels?: { phone?: string; website?: string; directions?: string };
}

const useStyles = makeStyles({
  list: { columnGap: '24px', display: 'flex', flexWrap: 'wrap', listStyleType: 'none', margin: 0, padding: 0, rowGap: '8px' },
  link: { ...blueLink, ...typography.uppercase(), alignItems: 'center', columnGap: '8px', display: 'inline-flex', fontSize: '12px' },
  icon: { fontSize: '16px' },
});

function directionsUrl(directions: string | [number, number]) {
  const destination = Array.isArray(directions) ? directions.join(',') : directions;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/**
 * Row of practical contact actions for a place: call, visit website, get
 * directions. Only the actions you provide are shown. Replaces `ContactBar`
 * and `Toolbar`.
 *
 * @example
 * <ContactBar phone="+33 1 40 20 50 50" website="https://louvre.fr" directions="Rue de Rivoli, Paris" />
 */
export function ContactBar({ phone, website, directions, labels = {}, className, ...rest }: ContactBarProps) {
  const s = useStyles();
  const { phone: phoneLabel = 'Call', website: websiteLabel = 'Website', directions: directionsLabel = 'Directions' } = labels;
  return (
    <ul className={mergeClasses(s.list, className)} {...rest}>
      {phone && (
        <li>
          <a className={s.link} href={`tel:${phone.replace(/[^+\d]/g, '')}`} aria-label={`${phoneLabel} ${phone}`}>
            <MobileIcon aria-hidden="true" className={s.icon} />
            {phoneLabel}
          </a>
        </li>
      )}
      {website && (
        <li>
          <a className={s.link} href={website} target="_blank" rel="noopener noreferrer">
            <GlobeIcon aria-hidden="true" className={s.icon} />
            {websiteLabel}
          </a>
        </li>
      )}
      {directions && (
        <li>
          <a className={s.link} href={directionsUrl(directions)} target="_blank" rel="noopener noreferrer">
            <PinIcon aria-hidden="true" className={s.icon} />
            {directionsLabel}
          </a>
        </li>
      )}
    </ul>
  );
}
