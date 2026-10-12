import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareButtons, ShareMenu } from './Share';
import { SocialLoginButton } from '../SocialLoginButton';
import { BookmarkButton } from '../BookmarkButton';

const meta = {
  title: 'Social/Share & sign-in',
  component: ShareButtons,
  parameters: { layout: 'padded' },
  args: { url: 'https://example.com/paris', text: 'The Paris travel guide' },
} satisfies Meta<typeof ShareButtons>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = { args: { heading: 'Share', networks: ['facebook', 'twitter', 'pinterest', 'reddit', 'whatsapp', 'email'] } };
export const BrandColors: Story = { args: { brandColors: true } };

export const Menu: Story = {
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 260 }}>
      <ShareMenu url={args.url} text={args.text} />
    </div>
  ),
};

export const SignIn: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <SocialLoginButton provider="google">Continue with Google</SocialLoginButton>
      <SocialLoginButton provider="facebook">Continue with Facebook</SocialLoginButton>
      <SocialLoginButton provider="apple">Continue with Apple</SocialLoginButton>
    </div>
  ),
};

export const Bookmarks: Story = {
  render: function Render() {
    const [saved, setSaved] = React.useState(false);
    const [added, setAdded] = React.useState(true);
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        <BookmarkButton marked={saved} onClick={() => setSaved(!saved)} />
        <BookmarkButton glyph="alt" marked={added} label="Add to list" markedLabel="Remove from list" onClick={() => setAdded(!added)} />
      </div>
    );
  },
};
