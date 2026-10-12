import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  argTypes: { type: { control: 'inline-radio', options: ['single', 'multiple'] } },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: { type: 'single', defaultValue: ['visas'] },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 720 }}>
      <AccordionItem value="visas" heading="Do I need a visa?"><p>Most visitors can stay up to 90 days without one.</p></AccordionItem>
      <AccordionItem value="money" heading="What currency should I bring?"><p>Euros. Cards are widely accepted.</p></AccordionItem>
      <AccordionItem value="health" heading="Health & safety"><p>Tap water is safe to drink.</p></AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: { type: 'multiple' },
  render: Single.render,
};
