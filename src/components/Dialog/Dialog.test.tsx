import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

function setup(props: Partial<React.ComponentProps<typeof Dialog>> = {}) {
  const onClose = vi.fn();
  const utils = render(
    <Dialog open title="Delete trip?" onClose={onClose} actions={<button type="button">Confirm</button>} {...props}>
      This can't be undone.
    </Dialog>,
  );
  return { onClose, ...utils };
}

describe('Dialog', () => {
  it('is labelled by its title and shows content and actions', () => {
    setup();
    const dialog = screen.getByRole('dialog', { name: 'Delete trip?' });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('focuses the dialog itself on open, not the first control', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('can focus a specific element on open', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(
      <Dialog open title="Rename" onClose={() => {}} initialFocusRef={ref}>
        <input ref={(el) => { ref.current = el; }} aria-label="Name" />
      </Dialog>,
    );
    expect(screen.getByLabelText('Name')).toHaveFocus();
  });

  it('does not mount its content while closed', () => {
    setup({ open: false });
    expect(screen.queryByText("This can't be undone.")).toBeNull();
  });

  it('supports alertdialog', () => {
    setup({ role: 'alertdialog' });
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('asks to close on Esc (cancel event) without closing natively', () => {
    const { onClose } = setup();
    const dialog = screen.getByRole('dialog');
    const event = new Event('cancel', { cancelable: true });
    fireEvent(dialog, event);
    expect(onClose).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it('closes from the close button', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes on backdrop click only when dismissible', async () => {
    const first = setup();
    await userEvent.click(screen.getByRole('dialog'));
    expect(first.onClose).toHaveBeenCalledOnce();
    first.unmount();

    const second = setup({ dismissible: false });
    await userEvent.click(screen.getByRole('dialog'));
    expect(second.onClose).not.toHaveBeenCalled();
  });

  it('does not close when clicking inside the content', async () => {
    const { onClose } = setup();
    await userEvent.click(screen.getByText("This can't be undone."));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks page scroll while open and restores it afterwards', () => {
    const { unmount } = setup();
    expect(document.documentElement.style.overflow).toBe('hidden');
    unmount();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
