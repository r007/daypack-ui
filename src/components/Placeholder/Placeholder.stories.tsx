import type { Meta, StoryObj } from '@storybook/react-vite';
import { Placeholder } from './Placeholder';

const meta = {
  title: 'Components/Placeholder',
  component: Placeholder,
  args: { title: 'The best place in the world' },
} satisfies Meta<typeof Placeholder>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fixed: Story = { args: { width: 200, height: 120, fontSize: 48 } };
export const Fluid: Story = {
  args: { aspectRatio: 9 / 16, fontSize: 64 },
  decorators: [(Story) => <div style={{ width: 400 }}><Story /></div>],
};
