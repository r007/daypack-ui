import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from '../Container';
import { GridColumn } from './GridColumn';
import { GridRow } from './GridRow';

const meta = {
  title: 'Layout/Grid',
  component: GridColumn,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof GridColumn>;
export default meta;
type Story = StoryObj<typeof meta>;

const cell = { background: '#88bde7', color: '#fff', padding: 16, fontFamily: 'system-ui', textAlign: 'center' } as const;

/** Gutters sit *before* each column, so leave the first one off to fill the 12 columns exactly. */
export const Responsive: Story = {
  render: () => (
    <Container>
      <GridRow>
        <GridColumn sm={6} md={4} lg={3}><div style={cell}>1</div></GridColumn>
        <GridColumn sm={6} md={4} lg={3} includeGutter><div style={cell}>2</div></GridColumn>
        <GridColumn sm={6} md={4} lg={3} includeGutter><div style={cell}>3</div></GridColumn>
        <GridColumn sm={6} md={4} lg={3} includeGutter><div style={cell}>4</div></GridColumn>
      </GridRow>
    </Container>
  ),
};

export const Shifted: Story = {
  render: () => (
    <Container>
      <GridRow>
        <GridColumn md={6} mdShift={3} fluid><div style={cell}>6 columns, shifted by 3</div></GridColumn>
      </GridRow>
    </Container>
  ),
};
