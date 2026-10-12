import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../Button';

const meta = {
  title: 'Overlays/Toast',
  component: Toast,
  parameters: { layout: 'padded' },
  args: { children: 'Your trip was saved.', type: 'success' },
  argTypes: { type: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] } },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};
export const WithAction: Story = { args: { title: 'Removed', children: 'Hotel Aurora was removed.', actionLabel: 'Undo', onClose: () => {} } };
export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 540 }}>
      <Toast type="info">Prices are shown in euros.</Toast>
      <Toast type="success">Saved to “Paris 2026”.</Toast>
      <Toast type="warning">This guide was last updated in 2023.</Toast>
      <Toast type="error">We couldn’t reach the server.</Toast>
    </div>
  ),
};

function Fire() {
  const { show } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button size="small" onClick={() => show({ type: 'success', message: 'Trip saved' })}>Success</Button>
      <Button size="small" color="red" onClick={() => show({ type: 'error', title: 'Failed', message: 'Could not save', duration: null })}>
        Error (stays)
      </Button>
    </div>
  );
}

export const Queue: Story = {
  render: () => (
    <ToastProvider>
      <Fire />
    </ToastProvider>
  ),
};
