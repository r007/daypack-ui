import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, ToastProvider, useToast } from './Toast';

function Trigger({ options }: { options: Parameters<ReturnType<typeof useToast>['show']>[0] }) {
  const { show } = useToast();
  return (
    <button type="button" onClick={() => show(options)}>
      Fire
    </button>
  );
}

describe('Toast', () => {
  it('uses alert for errors and status otherwise', () => {
    const { rerender } = render(<Toast type="error">Failed</Toast>);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
    rerender(<Toast type="success">Saved</Toast>);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders an action and a dismiss button', async () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(
      <Toast actionLabel="Undo" onAction={onAction} onClose={onClose}>
        Removed
      </Toast>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('ToastProvider', () => {
  it('shows a toast in a labelled region and dismisses it manually', async () => {
    render(
      <ToastProvider>
        <Trigger options={{ type: 'success', message: 'Trip saved', duration: null }} />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveTextContent('Trip saved');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Trip saved')).toBeNull();
  });

  it('auto-dismisses after the duration', async () => {
    vi.useFakeTimers();
    try {
      render(
        <ToastProvider>
          <Trigger options={{ message: 'Gone soon', duration: 1000 }} />
        </ToastProvider>,
      );
      await act(async () => {
        screen.getByRole('button', { name: 'Fire' }).click();
      });
      expect(screen.getByText('Gone soon')).toBeInTheDocument();
      await act(async () => {
        vi.advanceTimersByTime(1100);
      });
      expect(screen.queryByText('Gone soon')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('caps the number of visible toasts', async () => {
    render(
      <ToastProvider max={2}>
        <Trigger options={{ message: 'Hello', duration: null }} />
      </ToastProvider>,
    );
    const fire = screen.getByRole('button', { name: 'Fire' });
    await userEvent.click(fire);
    await userEvent.click(fire);
    await userEvent.click(fire);
    expect(screen.getAllByText('Hello')).toHaveLength(2);
  });

  it('throws a helpful error outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger options={{ message: 'x' }} />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
