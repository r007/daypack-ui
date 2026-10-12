import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareButtons, ShareMenu, shareUrl } from '.';
import { SocialLoginButton } from '../SocialLoginButton';
import { BookmarkButton } from '../BookmarkButton';

describe('shareUrl', () => {
  const data = { url: 'https://example.com/a b', text: 'Hello & welcome', via: 'lp' };

  it('encodes parameters for each network', () => {
    expect(shareUrl('facebook', data)).toBe('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com%2Fa%20b');
    expect(shareUrl('twitter', data)).toContain('text=Hello%20%26%20welcome');
    expect(shareUrl('twitter', data)).toContain('via=lp');
    expect(shareUrl('email', data).startsWith('mailto:?subject=Hello%20%26%20welcome')).toBe(true);
    expect(shareUrl('whatsapp', data)).toContain('api.whatsapp.com/send?text=');
    expect(shareUrl('pinterest', { ...data, image: 'https://x/y.jpg' })).toContain('media=https%3A%2F%2Fx%2Fy.jpg');
  });
});

describe('ShareButtons', () => {
  it('renders one labelled external link per network', () => {
    const onShare = vi.fn();
    render(<ShareButtons url="https://example.com" text="Hi" networks={['facebook', 'email']} heading="Share" onShare={onShare} />);
    const fb = screen.getByRole('link', { name: 'Share on Facebook' });
    expect(fb).toHaveAttribute('target', '_blank');
    expect(fb).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: 'Share on Email' })).not.toHaveAttribute('target');
    expect(screen.getByRole('group', { name: 'Share' })).toBeInTheDocument();
  });

  it('reports activation', async () => {
    const onShare = vi.fn();
    render(<ShareButtons url="https://example.com" networks={['reddit']} onShare={onShare} />);
    const link = screen.getByRole('link', { name: 'Share on Reddit' });
    link.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(link);
    expect(onShare).toHaveBeenCalledWith('reddit');
  });
});

describe('ShareMenu', () => {
  it('opens a popover and copies the link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<ShareMenu url="https://example.com/paris" />);
    await userEvent.click(screen.getByRole('button', { name: 'Share' }));
    await userEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    expect(writeText).toHaveBeenCalledWith('https://example.com/paris');
    expect(await screen.findByRole('button', { name: 'Link copied' })).toBeInTheDocument();
  });
});

describe('SocialLoginButton & BookmarkButton', () => {
  it('SocialLoginButton is a button with its label', async () => {
    const onClick = vi.fn();
    render(<SocialLoginButton provider="google" onClick={onClick}>Continue with Google</SocialLoginButton>);
    await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('BookmarkButton swaps label and pressed state', () => {
    const { rerender } = render(<BookmarkButton marked={false} />);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-pressed', 'false');
    rerender(<BookmarkButton marked />);
    expect(screen.getByRole('button', { name: 'Remove from saved' })).toHaveAttribute('aria-pressed', 'true');
  });
});
