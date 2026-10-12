import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem } from '.';

function setup(props: React.ComponentProps<typeof Accordion> = {}) {
  return render(
    <Accordion {...props}>
      <AccordionItem value="a" heading="Visas">Visa text</AccordionItem>
      <AccordionItem value="b" heading="Money">Money text</AccordionItem>
      <AccordionItem value="c" heading="Health" disabled>Health text</AccordionItem>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('toggles items and reflects aria-expanded', async () => {
    setup();
    const visas = screen.getByRole('button', { name: 'Visas' });
    expect(visas).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(visas);
    expect(visas).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Visas' })).toBeInTheDocument();
    await userEvent.click(visas);
    expect(visas).toHaveAttribute('aria-expanded', 'false');
  });

  it('single mode closes the previously open item', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Visas' }));
    await userEvent.click(screen.getByRole('button', { name: 'Money' }));
    expect(screen.getByRole('button', { name: 'Visas' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Money' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode keeps several open', async () => {
    setup({ type: 'multiple', defaultValue: ['a'] });
    await userEvent.click(screen.getByRole('button', { name: 'Money' }));
    expect(screen.getByRole('button', { name: 'Visas' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Money' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports controlled use', async () => {
    const onValueChange = vi.fn();
    setup({ value: [], onValueChange });
    await userEvent.click(screen.getByRole('button', { name: 'Visas' }));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
    expect(screen.getByRole('button', { name: 'Visas' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('moves focus between headers with arrow keys and skips disabled ones', async () => {
    setup();
    screen.getByRole('button', { name: 'Visas' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Money' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Visas' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Money' })).toHaveFocus();
  });
});
