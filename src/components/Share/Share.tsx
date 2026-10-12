import * as React from 'react';
import { makeStyles } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  PinterestIcon,
  RedditIcon,
  ShareIcon,
  TwitterIcon,
  WhatsappIcon,
} from '../Icon/icons';
import { Popover } from '../Popover';
import { IconButton } from '../IconButton';
import { shareNetworkNames, shareUrl, type ShareData, type ShareNetwork } from './share';

const ICONS: Record<ShareNetwork, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  facebook: FacebookIcon,
  facebookMessenger: FacebookMessengerIcon,
  twitter: TwitterIcon,
  pinterest: PinterestIcon,
  reddit: RedditIcon,
  whatsapp: WhatsappIcon,
  email: EmailIcon,
};

const BRAND: Record<ShareNetwork, string> = {
  facebook: vars.color.socialFacebook,
  facebookMessenger: vars.color.socialFacebookMessenger,
  twitter: vars.color.socialTwitter,
  pinterest: vars.color.socialPinterest,
  reddit: vars.color.socialReddit,
  whatsapp: vars.color.socialWhatsapp,
  email: vars.color.textPrimary,
};

const useStyles = makeStyles({
  list: { alignItems: 'center', columnGap: '16px', display: 'flex', flexWrap: 'wrap', listStyleType: 'none', margin: 0, padding: 0, rowGap: '8px' },
  heading: {
    fontFamily: vars.font.sans,
    fontSize: vars.fontSize.uppercase,
    fontWeight: vars.fontWeight.medium,
    letterSpacing: '0.6px',
    margin: 0,
    marginBottom: '12px',
    textTransform: 'uppercase',
  },
  link: {
    alignItems: 'center',
    borderRadius: '100%',
    color: 'var(--dp-share-color, currentColor)',
    display: 'inline-flex',
    fontSize: '24px',
    height: '40px',
    justifyContent: 'center',
    textDecorationLine: 'none',
    transitionProperty: 'opacity',
    transitionDuration: vars.duration.fast,
    width: '40px',
    ':hover': { opacity: 0.75 },
    ':focus-visible': focusRing,
  },
  menu: { display: 'grid', rowGap: '12px', minWidth: '220px' },
  menuTitle: { fontWeight: vars.fontWeight.medium, margin: 0 },
  copy: {
    backgroundColor: vars.color.bgSecondary,
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
    borderRadius: '4px',
    color: vars.color.textPrimary,
    cursor: 'pointer',
    fontFamily: vars.font.sans,
    fontSize: '13px',
    paddingTop: '10px',
    paddingRight: '12px',
    paddingBottom: '10px',
    paddingLeft: '12px',
    textAlign: 'left',
    ':hover': { borderTopColor: vars.color.linkPrimary, borderRightColor: vars.color.linkPrimary, borderBottomColor: vars.color.linkPrimary, borderLeftColor: vars.color.linkPrimary },
    ':focus-visible': focusRing,
  },
});

export interface ShareButtonsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ShareData {
  /**
   * Networks to show, in order.
   * @default ['facebook', 'twitter', 'pinterest', 'whatsapp', 'email']
   */
  networks?: ShareNetwork[];
  /** Small uppercase heading above the buttons. */
  heading?: string;
  /**
   * Show each network's brand color. Otherwise icons inherit the text color.
   * @default false
   */
  brandColors?: boolean;
  /** Called with the network when a share link is activated (analytics hook). */
  onShare?: (network: ShareNetwork) => void;
}

/**
 * Row of "share on …" links. Each is a plain `<a target="_blank">` to the
 * network's share intent, so it works without scripts and is announced
 * "Share on Facebook, link".
 *
 * @example
 * <ShareButtons url="https://example.com/paris" text="Paris travel guide" networks={['facebook', 'twitter', 'email']} />
 */
export function ShareButtons({
  url,
  text,
  via,
  image,
  networks = ['facebook', 'twitter', 'pinterest', 'whatsapp', 'email'],
  heading,
  brandColors = false,
  onShare,
  className,
  ...rest
}: ShareButtonsProps) {
  const s = useStyles();
  const headingId = React.useId();
  return (
    <div role="group" aria-labelledby={heading ? headingId : undefined} className={className} {...rest}>
      {heading && (
        <h2 id={headingId} className={s.heading}>
          {heading}
        </h2>
      )}
      <ul className={s.list}>
        {networks.map((network) => {
          const Icon = ICONS[network];
          const external = network !== 'email';
          return (
            <li key={network}>
              <a
                className={s.link}
                href={shareUrl(network, { url, text, via, image })}
                aria-label={`Share on ${shareNetworkNames[network]}`}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={brandColors ? ({ '--dp-share-color': BRAND[network] } as React.CSSProperties) : undefined}
                onClick={() => onShare?.(network)}
              >
                <Icon />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface ShareMenuProps extends ShareData {
  /**
   * Networks to show.
   * @default ['facebook', 'twitter', 'whatsapp', 'email']
   */
  networks?: ShareNetwork[];
  /**
   * Accessible name of the trigger button.
   * @default 'Share'
   */
  label?: string;
  /**
   * Heading inside the menu.
   * @default 'Share this page'
   */
  title?: string;
  /** Replace the default round share button. Must accept `ref` and `onClick`. */
  trigger?: React.ReactElement<Record<string, unknown>>;
  /**
   * Preferred side of the popover.
   * @default 'bottom-end'
   */
  placement?: React.ComponentProps<typeof Popover>['placement'];
}

/**
 * Share button that opens a popover with network links and a "Copy link"
 * action (using the async Clipboard API, announced through a live region).
 *
 * @example
 * <ShareMenu url={location.href} text={document.title} />
 */
export function ShareMenu({
  url,
  text,
  via,
  image,
  networks = ['facebook', 'twitter', 'whatsapp', 'email'],
  label = 'Share',
  title = 'Share this page',
  trigger,
  placement = 'bottom-end',
}: ShareMenuProps) {
  const s = useStyles();
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable (insecure context); fall back to selecting nothing.
      setCopied(false);
    }
  };

  const content = (
    <div className={s.menu}>
      <p className={s.menuTitle}>{title}</p>
      <ShareButtons url={url} text={text} via={via} image={image} networks={networks} brandColors />
      <button type="button" className={s.copy} onClick={copy}>
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <span role="status" aria-live="polite" style={{ position: 'absolute', clipPath: 'inset(50%)', width: 1, height: 1, overflow: 'hidden' }}>
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );

  return (
    <Popover content={content} placement={placement} arrow>
      {trigger ?? <IconButton icon={<ShareIcon />} label={label} variant="filled" />}
    </Popover>
  );
}

