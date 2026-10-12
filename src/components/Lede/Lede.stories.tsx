import type { Meta, StoryObj } from '@storybook/react-vite';
import { Lede } from './Lede';

const meta = {
  title: 'Components/Lede',
  component: Lede,
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  decorators: [(Story) => <div style={{ maxWidth: 720 }}><Story /></div>],
} satisfies Meta<typeof Lede>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
