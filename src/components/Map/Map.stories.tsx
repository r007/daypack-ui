import type { Meta, StoryObj } from '@storybook/react-vite';
import 'leaflet/dist/leaflet.css';
import { InteractiveMap } from './InteractiveMap';
import { MapMarker } from './MapMarker';
import { StaticMap } from './StaticMap';
import { art } from '../../stories/assets';

const meta = { title: 'Maps/Map', component: InteractiveMap, parameters: { layout: 'padded' }, args: { label: 'Sights in Paris' } } satisfies Meta<typeof InteractiveMap>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    places: [
      { id: 'louvre', position: [48.8606, 2.3376], title: 'Louvre Museum', kind: 'see', label: '1' },
      { id: 'flore', position: [48.8542, 2.3331], title: 'Café de Flore', kind: 'eat', label: '2' },
      { id: 'chapelle', position: [48.8554, 2.345], title: 'Sainte-Chapelle', kind: 'see', label: '3' },
      { id: 'hotel', position: [48.8625, 2.3522], title: 'Hotel Aurora', kind: 'sleep' },
    ],
    height: 420,
  },
};

export const Static: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <StaticMap src={art(120, 800, 450, '')} alt="Map of the Marais district, Paris" href="#map" caption="Rue des Rosiers, Paris" />
    </div>
  ),
};

export const Markers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, padding: 16 }}>
      {(['default', 'eat', 'drink', 'play', 'see', 'shop', 'sleep', 'transport'] as const).map((kind, i) => (
        <MapMarker key={kind} kind={kind} label={String(i + 1)} />
      ))}
      <MapMarker kind="see" label="9" selected />
    </div>
  ),
};
