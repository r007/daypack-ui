import type { Meta, StoryObj } from '@storybook/react-vite';
import { Rating } from './Rating';

const meta = {
  title: 'Components/Rating',
  component: Rating,
  args: { amount: 4.5, description: 'Excellent' },
  argTypes: { amount: { control: { type: 'range', min: 0, max: 5, step: 0.5 } } },
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const Icon: Story = { args: { icon: true } };
