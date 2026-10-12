import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import { Dropdown } from '../Dropdown';

describe('form controls', () => {
  it('Input is a text field that forwards native attributes', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" placeholder="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'Ada');
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('Textarea ignores Enter when disableEnter is set', async () => {
    render(<Textarea aria-label="Bio" disableEnter />);
    const el = screen.getByLabelText('Bio');
    await userEvent.type(el, 'a{Enter}b');
    expect(el).toHaveValue('ab');
  });

  it('Checkbox toggles via its label and reports state', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Subscribe" onChange={onChange} />);
    await userEvent.click(screen.getByText('Subscribe'));
    expect(screen.getByRole('checkbox', { name: 'Subscribe' })).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('Checkbox supports radio groups', async () => {
    render(
      <>
        <Checkbox type="radio" name="size" label="S" rounded />
        <Checkbox type="radio" name="size" label="M" rounded />
      </>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'M' }));
    expect(screen.getByRole('radio', { name: 'M' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'S' })).not.toBeChecked();
  });

  it('Switch is exposed as a switch and toggles with the keyboard', async () => {
    render(<Switch aria-label="Notifications" />);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    sw.focus();
    await userEvent.keyboard(' ');
    expect(sw).toBeChecked();
  });

  it('Dropdown renders string and object options', async () => {
    render(<Dropdown aria-label="Sort" options={['Newest', { value: 'p', label: 'Popular' }]} />);
    await userEvent.selectOptions(screen.getByLabelText('Sort'), 'Popular');
    expect(screen.getByLabelText('Sort')).toHaveValue('p');
  });
});
