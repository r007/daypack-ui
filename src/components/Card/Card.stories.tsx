import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardActions, CardBody, CardMedia, CardMeta, CardText, CardTitle } from './Card';
import { Badge } from '../Badge';
import { Price } from '../Price';
import { BookmarkIcon } from '../Icon/icons';

// Inline SVG so stories need no network or third-party photos.
const photo = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 410 232'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${hue} 60% 62%)'/><stop offset='1' stop-color='hsl(${hue + 40} 55% 38%)'/></linearGradient></defs><rect width='410' height='232' fill='url(#g)'/></svg>`,
  )}`;

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 340 }}><Story /></div>],
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardMedia src={photo(200)} alt="" />
      <CardBody>
        <CardTitle href="#paris">Paris in three days</CardTitle>
        <CardMeta>
          <span>3 days</span>
          <span>Europe</span>
        </CardMeta>
      </CardBody>
    </Card>
  ),
};

export const Tile: Story = {
  render: () => (
    <Card layout="tile">
      <CardMedia src={photo(20)} alt="" />
      <CardBody spacing="compact">
        <CardTitle href="#lisbon" spacing="compact">Lisbon for food lovers</CardTitle>
      </CardBody>
    </Card>
  ),
};

export const Poster: Story = {
  render: () => (
    <Card>
      <CardMedia src={photo(300)} ratio="poster" />
      <CardBody>
        <CardTitle href="#guide">Best in Travel 2026</CardTitle>
        <CardText>The ten countries, regions and cities to visit next year.</CardText>
      </CardBody>
    </Card>
  ),
};

export const WithActionsAndPrice: Story = {
  render: () => (
    <Card>
      <CardMedia src={photo(120)} alt="">
        <div style={{ padding: 12 }}><Badge tone="alert" style={{ background: '#fff', padding: '2px 6px' }}>Sale</Badge></div>
      </CardMedia>
      <CardBody>
        <CardTitle href="#hotel">Hotel Aurora</CardTitle>
        <CardText>Boutique stay near the old town.</CardText>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Price amount={140} discountedAmount={110} parent="card" rate="per night" />
          <CardActions>
            <button type="button" aria-label="Save Hotel Aurora" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 20 }}>
              <BookmarkIcon />
            </button>
          </CardActions>
        </div>
      </CardBody>
    </Card>
  ),
};

export const Dark: Story = {
  decorators: [(Story) => <div style={{ width: 340, background: '#2c3643', padding: 16 }}><Story /></div>],
  render: () => (
    <Card layout="tile" theme="dark">
      <CardMedia src={photo(260)} opacity={0.8} />
      <CardBody>
        <CardTitle href="#night">Night trains of Europe</CardTitle>
      </CardBody>
    </Card>
  ),
};
