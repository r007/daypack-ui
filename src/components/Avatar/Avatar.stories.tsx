import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const src =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%2388bde7'/><circle cx='50' cy='38' r='18' fill='white'/><ellipse cx='50' cy='90' rx='32' ry='28' fill='white'/></svg>";

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { src, alt: 'Traveller', size: 80 },
  argTypes: { size: { control: 'select', options: [24, 40, 48, 80, 104] } },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Linked: Story = { args: { href: '#' } };
