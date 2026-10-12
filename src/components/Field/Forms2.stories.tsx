import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Input } from '../Input';
import { NumberInput } from '../NumberInput';
import { Slider, RangeSlider } from '../Slider';
import { DateField, DateRangeField } from '../DateField';
import { Calendar } from '../Calendar';
import { SettingGroup, SettingRow } from '../SettingRow';
import { Switch } from '../Switch';
import { Checkbox } from '../Checkbox';
import { AvatarUpload } from '../AvatarUpload';
import { Combobox } from '../Combobox';
import { art } from '../../stories/assets';

const meta = { title: 'Forms/Advanced', component: Field, parameters: { layout: 'padded' }, args: { label: 'Email', children: <Input /> } } satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithFeedback: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}>
      <Field label="Email" hint="We never share it" required><Input type="email" placeholder="you@example.com" /></Field>
      <Field label="Name" error="Please enter your name"><Input /></Field>
    </div>
  ),
};

export const Quantity: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 360 }}>
      <Field label="Guests"><NumberInput min={1} max={8} defaultValue={2} /></Field>
      <Field label="Maximum distance"><Slider min={1} max={50} defaultValue={10} /></Field>
      <RangeSlider label="Price per night" min={0} max={500} defaultValue={[60, 280]} formatValue={(v) => `$${v}`} />
    </div>
  ),
};

export const Dates: Story = {
  render: function Render() {
    const [value, setValue] = React.useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    return (
      <div style={{ display: 'grid', gap: 32 }}>
        <DateField aria-label="Date of birth" />
        <DateRangeField label="Travel dates" min={new Date()} />
        <Calendar mode="range" value={value} onValueChange={setValue} minDate={new Date()} weekStartsOn={1} />
        <p style={{ fontFamily: 'sans-serif', fontSize: 13 }}>
          {value.start ? value.start.toDateString() : '…'} → {value.end ? value.end.toDateString() : '…'}
        </p>
      </div>
    );
  },
};

export const Settings: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <SettingGroup title="Notifications" description="Choose what we email you about.">
        <SettingRow title="Weekly digest" description="Our best guides every Friday." controlId="s-digest"><Switch id="s-digest" defaultChecked /></SettingRow>
        <SettingRow title="Price alerts" description="When a saved hotel drops its price." controlId="s-price"><Checkbox id="s-price" aria-label="Price alerts" /></SettingRow>
      </SettingGroup>
    </div>
  ),
};

export const Profile: Story = {
  render: () => <AvatarUpload src={art(210, 200, 200)} onChange={() => {}} />,
};

export const Autocomplete: Story = {
  render: () => {
    const places = ['Paris, France', 'Lisbon, Portugal', 'Kyoto, Japan', 'Oaxaca, Mexico', 'Reykjavik, Iceland', 'Hanoi, Vietnam', 'Cusco, Peru'];
    return (
      <div style={{ display: 'grid', gap: 40, maxWidth: 420, minHeight: 360 }}>
        <Field label="Where to?"><Combobox options={places} placeholder="Search destinations" /></Field>
        <Field label="Cities you have visited"><Combobox multiple options={places} defaultValue={['Paris, France']} placeholder="Add a city" /></Field>
      </div>
    );
  },
};
