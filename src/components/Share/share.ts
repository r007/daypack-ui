export type ShareNetwork =
  | 'facebook'
  | 'facebookMessenger'
  | 'twitter'
  | 'pinterest'
  | 'reddit'
  | 'whatsapp'
  | 'email';

export interface ShareData {
  /** Absolute URL of the thing being shared. */
  url: string;
  /** Title or description, used as the post text / email subject. */
  text?: string;
  /** Twitter handle (without @) to credit. */
  via?: string;
  /** Pinterest only: image to pin. */
  image?: string;
}

/** Human-readable network names (used in accessible labels). */
export const shareNetworkNames: Record<ShareNetwork, string> = {
  facebook: 'Facebook',
  facebookMessenger: 'Facebook Messenger',
  twitter: 'X (Twitter)',
  pinterest: 'Pinterest',
  reddit: 'Reddit',
  whatsapp: 'WhatsApp',
  email: 'Email',
};

const enc = encodeURIComponent;

/**
 * Build the share-intent URL for a network.
 *
 * @example
 * shareUrl('twitter', { url: 'https://example.com/paris', text: 'Paris guide' })
 */
export function shareUrl(network: ShareNetwork, { url, text = '', via, image }: ShareData): string {
  switch (network) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case 'facebookMessenger':
      return `fb-messenger://share?link=${enc(url)}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${enc(url)}${text ? `&text=${enc(text)}` : ''}${via ? `&via=${enc(via)}` : ''}`;
    case 'pinterest':
      return `https://pinterest.com/pin/create/button/?url=${enc(url)}${image ? `&media=${enc(image)}` : ''}${text ? `&description=${enc(text)}` : ''}`;
    case 'reddit':
      return `https://www.reddit.com/submit?url=${enc(url)}${text ? `&title=${enc(text)}` : ''}`;
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${enc(text ? `${text} ${url}` : url)}`;
    case 'email':
      return `mailto:?subject=${enc(text)}&body=${enc(text ? `${text}\n\n${url}` : url)}`;
    default:
      return url;
  }
}
