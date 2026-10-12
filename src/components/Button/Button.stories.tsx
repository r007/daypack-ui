import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Book now' },
  argTypes: {
    color: { control: 'select', options: ['blue', 'white', 'gray', 'red', 'transparent'] },
    size: { control: 'select', options: ['tiny', 'small', 'medium', 'large', 'huge'] },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Rounded: Story = { args: { rounded: true, size: 'small' } };
export const Bordered: Story = { args: { color: 'gray', border: true } };
export const Disabled: Story = { args: { disabled: true } };
export const AsLink: Story = { args: { href: '#', children: 'Read more' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {(['tiny', 'small', 'medium', 'large', 'huge'] as const).map((size) => (
        <Button key={size} {...args} size={size}>{size}</Button>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, padding: 16, background: '#555' }}>
      {(['blue', 'white', 'gray', 'red', 'transparent'] as const).map((color) => (
        <Button key={color} {...args} color={color} border>{color}</Button>
      ))}
    </div>
  ),
};
