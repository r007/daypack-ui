import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';
import { Popover } from '../Popover';

describe('Tooltip', () => {
  it('describes its trigger and is visible on keyboard focus', async () => {
    render(
      <Tooltip content="Save to trip">
        <button type="button">Save</button>
      </Tooltip>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip).not.toBeVisible();

    await userEvent.tab();
    expect(button).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeVisible();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Save to trip');
  });

  it('Esc dismisses it while focus stays on the trigger', async () => {
    render(
      <Tooltip content="Save to trip">
        <button type="button">Save</button>
      </Tooltip>,
    );
    await userEvent.tab();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('shows after a hover delay and hides shortly after leaving', async () => {
    vi.useFakeTimers();
    try {
      render(
        <Tooltip content="Hi" delay={150}>
          <button type="button">Trigger</button>
        </Tooltip>,
      );
      const button = screen.getByRole('button');
      await act(async () => {
        button.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        // React listens to mouseover/out to synthesize mouseenter/leave.
      });
      await act(async () => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.getByRole('tooltip')).toBeVisible();
      await act(async () => {
        button.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }));
        vi.advanceTimersByTime(150);
      });
      expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps an existing aria-describedby and calls the original handlers', async () => {
    const onFocus = vi.fn();
    render(
      <Tooltip content="x">
        <button type="button" aria-describedby="hint" onFocus={onFocus}>
          Go
        </button>
      </Tooltip>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-describedby')).toMatch(/^hint /);
    await userEvent.tab();
    expect(onFocus).toHaveBeenCalled();
  });
});

describe('Popover', () => {
  it('toggles from its trigger and wires aria attributes', async () => {
    render(
      <Popover content={<a href="/share">Copy link</a>}>
        <button type="button">Share</button>
      </Popover>,
    );
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).toBeNull();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = screen.getByRole('dialog');
    expect(panel).toBeVisible();
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(screen.getByRole('link', { name: 'Copy link' })).toBeVisible();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('works controlled', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover open={false} onOpenChange={onOpenChange} content="Hello">
        <button type="button">Open</button>
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });
});
