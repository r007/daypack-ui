import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta = {
  title: 'Components/Heading',
  component: Heading,
  args: { children: 'Where to next?', level: 2, size: 'large' },
} satisfies Meta<typeof Heading>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Huge: Story = { args: { size: 'huge', level: 1 } };
export const Caps: Story = { args: { caps: true, tracking: 'loose', size: 'small' } };
export const Alert: Story = { args: { importance: 'alert' } };
