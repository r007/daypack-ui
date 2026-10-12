import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './Field';
import { Input } from '../Input';
import { NumberInput } from '../NumberInput';
import { Slider, RangeSlider } from '../Slider';
import { DateField, DateRangeField } from '../DateField';
import { Calendar } from '../Calendar';
import { SettingGroup, SettingRow } from '../SettingRow';
import { Switch } from '../Switch';
import { AvatarUpload } from '../AvatarUpload';
import { Combobox } from '../Combobox';
import { monthGrid, toISODate, fromISODate } from '../_internal/date';

describe('Field', () => {
  it('links label, hint and error to the control', () => {
    render(
      <Field label="Email" hint="We never share it" error="Enter a valid email" required>
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby')!.split(' ');
    expect(describedBy).toHaveLength(2);
    expect(screen.getByText('We never share it').id).toBe(describedBy[0]);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
  });

  it('supports a render function', () => {
    render(
      <Field label="Notes">
        {(props) => <textarea {...props} />}
      </Field>,
    );
    expect(screen.getByLabelText('Notes').tagName).toBe('TEXTAREA');
  });
});

describe('NumberInput', () => {
  it('increments, decrements and respects min/max', async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Guests" min={1} max={3} defaultValue={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(screen.getByLabelText('Guests')).toHaveValue(3);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByLabelText('Guests')).toHaveValue(1);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });
});

describe('Sliders', () => {
  it('Slider is a native range input', () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Distance" min={0} max={10} defaultValue={5} onValueChange={onValueChange} />);
    // jsdom does not implement key-driven stepping of range inputs; drive the change event.
    fireEvent.change(screen.getByRole('slider', { name: 'Distance' }), { target: { value: '6' } });
    expect(onValueChange).toHaveBeenCalledWith(6);
  });

  it('RangeSlider exposes two labelled sliders and keeps them ordered', () => {
    const onValueChange = vi.fn();
    render(<RangeSlider label="Price" min={0} max={100} defaultValue={[20, 30]} onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Price' })).toBeInTheDocument();
    const [low, high] = screen.getAllByRole('slider');
    expect(low).toHaveAccessibleName('Minimum');
    expect(high).toHaveAccessibleName('Maximum');
    fireEvent.change(high!, { target: { value: '29' } });
    expect(onValueChange).toHaveBeenLastCalledWith([20, 29]);
    // The thumbs cannot cross.
    fireEvent.change(high!, { target: { value: '10' } });
    expect(onValueChange).toHaveBeenLastCalledWith([20, 20]);
  });
});

describe('Date fields', () => {
  it('DateField converts to and from Date objects', async () => {
    const onValueChange = vi.fn();
    render(<DateField aria-label="Check-in" min={new Date(2026, 0, 1)} onValueChange={onValueChange} />);
    const input = screen.getByLabelText('Check-in');
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('min', '2026-01-01');
    await userEvent.type(input, '2026-03-05');
    const last = onValueChange.mock.calls.at(-1)![0] as Date;
    expect(toISODate(last)).toBe('2026-03-05');
  });

  it('DateRangeField ties the end minimum to the start', async () => {
    render(<DateRangeField label="Dates" defaultValue={{ start: new Date(2026, 0, 10), end: null }} />);
    expect(screen.getByLabelText('End date')).toHaveAttribute('min', '2026-01-10');
    expect(screen.getByRole('group', { name: 'Dates' })).toBeInTheDocument();
  });

  it('date helpers', () => {
    expect(fromISODate('2026-02-30')?.getMonth()).toBe(2); // JS rolls over; callers validate
    expect(fromISODate('nope')).toBeNull();
    const weeks = monthGrid(new Date(2026, 1, 1), 1); // Feb 2026, Monday start
    expect(weeks[0]![0]!.getDay()).toBe(1);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });
});

describe('Calendar', () => {
  it('shows the month as a grid and selects a day', async () => {
    const onValueChange = vi.fn();
    render(<Calendar defaultMonth={new Date(2026, 0, 1)} onValueChange={onValueChange} />);
    expect(screen.getByRole('heading', { name: 'January 2026' })).toBeInTheDocument();
    expect(screen.getByRole('grid')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Thursday, January 15, 2026' }));
    expect((onValueChange.mock.calls[0]![0] as Date).getDate()).toBe(15);
    expect(screen.getByRole('button', { name: 'Thursday, January 15, 2026' }).closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates months with the buttons and keyboard', async () => {
    render(<Calendar defaultMonth={new Date(2026, 0, 1)} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('heading', { name: 'February 2026' })).toBeInTheDocument();

    const day = screen.getByRole('button', { name: 'Sunday, February 1, 2026' });
    day.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Monday, February 2, 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByRole('heading', { name: 'January 2026' })).toBeInTheDocument();
  });

  it('selects a range with two clicks and skips disabled days', async () => {
    const onValueChange = vi.fn();
    render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 0, 1)}
        isDateDisabled={(d) => d.getDate() === 20}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Monday, January 12, 2026' }));
    await userEvent.click(screen.getByRole('button', { name: 'Wednesday, January 14, 2026' }));
    const result = onValueChange.mock.calls.at(-1)![0] as { start: Date; end: Date };
    expect([result.start.getDate(), result.end.getDate()]).toEqual([12, 14]);

    const calls = onValueChange.mock.calls.length;
    await userEvent.click(screen.getByRole('button', { name: 'Tuesday, January 20, 2026' }));
    expect(onValueChange.mock.calls.length).toBe(calls);
  });
});

describe('SettingRow & AvatarUpload', () => {
  it('SettingRow labels its control', async () => {
    render(
      <SettingGroup title="Notifications">
        <SettingRow title="Weekly digest" description="Every Friday" controlId="digest">
          <Switch id="digest" />
        </SettingRow>
      </SettingGroup>,
    );
    expect(screen.getByRole('switch', { name: 'Weekly digest' })).toBeInTheDocument();
    await userEvent.click(screen.getByText('Weekly digest'));
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('AvatarUpload validates size and reports the file', async () => {
    const onChange = vi.fn();
    const create = vi.fn(() => 'blob:preview');
    URL.createObjectURL = create as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn();
    render(<AvatarUpload onChange={onChange} maxSizeMb={1} />);
    const input = screen.getByLabelText('Change photo');

    const big = new File([new Uint8Array(2 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    await userEvent.upload(input, big);
    expect(await screen.findByRole('alert')).toHaveTextContent('under 1 MB');
    expect(onChange).not.toHaveBeenCalled();

    const ok = new File(['x'], 'ok.png', { type: 'image/png' });
    await userEvent.upload(input, ok);
    expect(onChange).toHaveBeenCalledWith(ok, 'blob:preview');
  });
});

describe('Combobox', () => {
  const places = ['Paris', 'Lisbon', 'Kyoto', 'Oaxaca'];

  it('follows the ARIA combobox pattern and selects with the keyboard', async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Destination" options={places} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox', { name: 'Destination' });
    expect(input).toHaveAttribute('aria-expanded', 'false');

    await userEvent.type(input, 'o');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['Lisbon', 'Kyoto', 'Oaxaca']);
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id);

    await userEvent.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', options[1]!.id);
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('Kyoto');
    expect(input).toHaveValue('Kyoto');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows an empty message and closes on Escape', async () => {
    render(<Combobox aria-label="Destination" options={places} />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'zzz');
    expect(screen.getByText('No results')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports multiple selection with removable chips', async () => {
    const onValueChange = vi.fn();
    render(<Combobox aria-label="Cities" multiple options={places} onValueChange={onValueChange} />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'Paris' }));
    await userEvent.click(screen.getByRole('option', { name: 'Kyoto' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['Paris', 'Kyoto']);
    expect(screen.getByRole('button', { name: 'Remove Paris' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove Paris' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['Kyoto']);
  });

  it('delegates filtering to the server when filter is off', async () => {
    const onInputChange = vi.fn();
    render(<Combobox aria-label="Search" options={places} filter={false} onInputChange={onInputChange} />);
    await userEvent.type(screen.getByRole('combobox'), 'x');
    expect(onInputChange).toHaveBeenCalledWith('x');
    expect(screen.getAllByRole('option')).toHaveLength(4);
  });
});
