import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Top choice' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'accent', 'success', 'alert'] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['neutral', 'accent', 'success', 'alert'] as const).map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}
    </div>
  ),
};
