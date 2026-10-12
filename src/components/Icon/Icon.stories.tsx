import type { Meta, StoryObj } from '@storybook/react-vite';
import * as icons from './icons';

const meta = { title: 'Components/Icon', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 130px)', gap: 16, fontFamily: 'system-ui', fontSize: 11 }}>
      {Object.entries(icons).map(([name, Cmp]) => (
        <div key={name} style={{ textAlign: 'center', wordBreak: 'break-word' }}>
          <Cmp width={32} />
          <div>{name}</div>
        </div>
      ))}
    </div>
  ),
};
