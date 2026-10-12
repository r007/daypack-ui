import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#', children: 'Read the guide' },
  argTypes: { variant: { control: 'inline-radio', options: ['plain', 'blue', 'underlined'] } },
} satisfies Meta<typeof Link>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};
export const Blue: Story = { args: { variant: 'blue' } };
export const Underlined: Story = { args: { variant: 'underlined' } };
