import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'medium', 'large', 'fullscreen'] },
    align: { control: 'inline-radio', options: ['start', 'center'] },
    role: { control: 'inline-radio', options: ['dialog', 'alertdialog'] },
  },
  args: { open: false, onClose: () => {} },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo(props: Omit<React.ComponentProps<typeof Dialog>, 'open' | 'onClose'> & { label?: string }) {
  const [open, setOpen] = React.useState(false);
  const { label = 'Open dialog', ...rest } = props;
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Dialog {...rest} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export const Confirmation: Story = {
  render: () => (
    <Demo
      role="alertdialog"
      align="center"
      title="Remove this trip?"
      dismissible={false}
      actions={
        <>
          <Button color="red" size="small" full>Remove</Button>
          <Button color="gray" size="small" full border>Keep it</Button>
        </>
      }
    >
      It will be deleted from your account. This can’t be undone.
    </Demo>
  ),
};

export const Content: Story = {
  render: () => (
    <Demo size="medium" title="Share this guide" label="Share">
      <p>Anyone with the link can read this guide.</p>
      <input readOnly value="https://example.com/guide/paris" style={{ width: '100%' }} aria-label="Link" />
    </Demo>
  ),
};

export const Fullscreen: Story = {
  render: () => (
    <Demo size="fullscreen" title="Gallery" label="Open gallery">
      <p>Full-viewport takeover, for galleries and mobile menus.</p>
    </Demo>
  ),
};
