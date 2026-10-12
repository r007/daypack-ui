import type { Meta, StoryObj } from '@storybook/react-vite';
import { Price } from './Price';

const meta = {
  title: 'Components/Price',
  component: Price,
  args: { amount: 129, currency: 'USD', rate: 'per night' },
} satisfies Meta<typeof Price>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Emphasized: Story = { args: { emphasized: true } };
export const Thin: Story = { args: { thin: true } };
export const Tag: Story = { args: { tag: true, rate: undefined } };
export const CardOnSale: Story = { args: { parent: 'card', discountedAmount: 99, amount: 129 } };
export const BookingOnSale: Story = {
  args: { parent: 'booking', poiType: 'partnerActivity', discountedAmount: 99, amount: 129, emphasized: true },
  decorators: [(Story) => <div style={{ width: 420, position: 'relative', minHeight: 120 }}><Story /></div>],
};
