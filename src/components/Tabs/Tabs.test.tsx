import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabList, Tab, TabPanel } from '.';

function setup(props: React.ComponentProps<typeof Tabs> = {}) {
  return render(
    <Tabs {...props}>
      <TabList aria-label="Sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="tips">Tips</Tab>
        <Tab value="map" disabled>Map</Tab>
      </TabList>
      <TabPanel value="overview">Overview body</TabPanel>
      <TabPanel value="tips">Tips body</TabPanel>
      <TabPanel value="map">Map body</TabPanel>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('selects the first tab by default and wires aria relationships', () => {
    setup();
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toHaveTextContent('Overview body');
    expect(overview).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id);
  });

  it('shows only the selected panel', async () => {
    setup();
    await userEvent.click(screen.getByRole('tab', { name: 'Tips' }));
    expect(screen.getByRole('tabpanel', { name: 'Tips' })).toBeVisible();
    expect(screen.getByText('Overview body')).not.toBeVisible();
  });

  it('uses a roving tabindex', async () => {
    setup();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Tips' })).toHaveAttribute('tabindex', '-1');
  });

  it('navigates with arrows, wrapping, and skipping disabled tabs', async () => {
    setup();
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tips' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tips' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Tips' })).toHaveFocus();
  });

  it('can be controlled', async () => {
    const onValueChange = vi.fn();
    setup({ value: 'overview', onValueChange });
    await userEvent.click(screen.getByRole('tab', { name: 'Tips' }));
    expect(onValueChange).toHaveBeenCalledWith('tips');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });
});
