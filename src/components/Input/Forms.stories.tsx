import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import { Dropdown } from '../Dropdown';

const meta = { title: 'Forms/Overview', component: Input, parameters: { layout: 'padded' } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextField: Story = { args: { placeholder: 'Where are you going?', 'aria-label': 'Destination' }, decorators: [(S) => <div style={{ width: 360 }}><S /></div>] };

export const MultiLine: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Textarea aria-label="Notes" placeholder="Auto-growing, up to 4 lines" autoGrow maxLines={4} />
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Sixteen" size={16} defaultChecked />
      <Checkbox label="Twenty-four" size={24} />
      <Checkbox label="Thirty-two, rounded" size={32} rounded defaultChecked />
      <Checkbox label="Disabled" disabled />
      <fieldset style={{ border: 0, padding: 0, display: 'grid', gap: 8 }}>
        <Checkbox type="radio" name="room" label="Single" rounded defaultChecked />
        <Checkbox type="radio" name="room" label="Double" rounded />
      </fieldset>
    </div>
  ),
};

export const Switches: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled" disabled />
    </div>
  ),
};

export const Dropdowns: Story = {
  render: () => <Dropdown aria-label="Sort" options={['Most popular', 'Newest', 'Closest']} />,
};
