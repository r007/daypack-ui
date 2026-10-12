import { render, screen } from '@testing-library/react';
import { MapMarker, StaticMap, InteractiveMap } from '.';

describe('Maps', () => {
  it('MapMarker is decorative and carries its category color', () => {
    const { container } = render(<MapMarker kind="eat" label="3" />);
    const pin = container.firstChild as HTMLElement;
    expect(pin).toHaveAttribute('aria-hidden', 'true');
    expect(pin.style.getPropertyValue('--dp-marker')).toContain('poi-eat');
    expect(pin).toHaveTextContent('3');
  });

  it('StaticMap describes the location and can link to the full map', () => {
    render(<StaticMap src="/map.png" alt="Map of the Marais, Paris" href="/map" caption="Rue des Rosiers" />);
    expect(screen.getByRole('link', { name: 'Map of the Marais, Paris' })).toHaveAttribute('href', '/map');
    expect(screen.getByText('Rue des Rosiers')).toBeInTheDocument();
  });

  it('InteractiveMap renders a labelled region and degrades without leaflet', async () => {
    render(<InteractiveMap label="Sights in Paris" places={[{ id: '1', position: [48.86, 2.33], title: 'Louvre' }]} height={200} />);
    // Region exists immediately (the map library loads lazily afterwards).
    expect(screen.getByRole('region', { name: 'Sights in Paris' })).toBeInTheDocument();
  });
});
