import type { Meta, StoryObj } from '@storybook/react-vite';
import { lightTokens } from './tokens';
import { vars } from './vars';
import { ThemeProvider } from './ThemeProvider';
import { Button } from '../components/Button';

const meta = { title: 'Foundations/Tokens', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const swatch = { width: 160, fontSize: 12, fontFamily: 'system-ui' } as const;

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 160px)', gap: 16 }}>
      {Object.entries(lightTokens.color).map(([name, value]) => (
        <div key={name} style={swatch}>
          <div style={{ height: 56, background: (vars.color as Record<string, string>)[name], border: '1px solid #e4e4e4' }} />
          <strong>{name}</strong>
          <div>{value}</div>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div>
      {Object.entries(lightTokens.fontSize).map(([name, value]) => (
        <p key={name} style={{ fontSize: value, margin: '0 0 8px', fontFamily: vars.font.sans }}>
          {name} · {value}
        </p>
      ))}
    </div>
  ),
};

export const Theming: Story = {
  name: 'Theming with ThemeProvider',
  render: () => (
    <ThemeProvider theme={{ color: { linkPrimary: '#0f766e' }, font: { sans: 'Georgia, serif' } }}>
      <Button>Teal button, serif font</Button>
    </ThemeProvider>
  ),
};
