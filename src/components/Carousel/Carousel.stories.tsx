import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './Carousel';
import { Card, CardBody, CardMedia, CardTitle } from '../Card';
import { Masthead } from '../Masthead';
import { PhotoGallery } from '../PhotoGallery';
import { Video } from '../Video';
import { TileGrid } from '../TileGrid';
import { Image } from '../Image';
import { ScrollIndicator } from '../ScrollIndicator';
import { Button } from '../Button';
import { art } from '../../stories/assets';

const meta = {
  title: 'Media/Carousel & gallery',
  component: Carousel,
  parameters: { layout: 'padded' },
  args: { label: 'Featured guides', children: <span /> },
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

const places = ['Paris', 'Lisbon', 'Kyoto', 'Oaxaca', 'Reykjavik', 'Hanoi', 'Cusco'];

export const Cards: Story = {
  render: (args) => (
    <Carousel {...args} slidesPerView={{ base: 1, md: 2, lg: 3 }} showCounter>
      {places.map((name, i) => (
        <Card key={name}>
          <CardMedia src={art(i * 50, 410, 232, name)} alt="" />
          <CardBody>
            <CardTitle href={`#${name}`}>{name}: where to eat, sleep and wander</CardTitle>
          </CardBody>
        </Card>
      ))}
    </Carousel>
  ),
};

export const Hero: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <Carousel {...args} label="Hero" slidesPerView={1} gap={0}>
      {places.slice(0, 3).map((name, i) => (
        <Masthead key={name} image={art(i * 90, 1600, 700, '')} height={420}>
          <h2 style={{ margin: 0, fontFamily: 'sans-serif', fontSize: 48 }}>{name}</h2>
          <p style={{ fontFamily: 'sans-serif' }}>Plan the perfect trip.</p>
          <Button size="small" color="white">Explore</Button>
        </Masthead>
      ))}
    </Carousel>
  ),
};

export const Gallery: Story = {
  render: () => (
    <PhotoGallery
      photos={places.map((name, i) => ({
        src: art(i * 50, 1600, 1000, name),
        thumbSrc: art(i * 50, 400, 300),
        alt: `${name} at golden hour`,
        caption: `${name}, early light`,
      }))}
    />
  ),
};

export const ImageStates: Story = {
  render: () => (
    <TileGrid minTileWidth={220}>
      <Image src={art(200, 600, 340)} alt="Video ratio" ratio="video" />
      <Image src={art(20, 400, 500)} alt="Poster ratio" ratio="poster" />
      <Image src="/this-image-does-not-exist.jpg" alt="Broken image" ratio="square" />
    </TileGrid>
  ),
};

export const HeroWithScrollCue: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Masthead image={art(280, 1600, 800)} height={360} overlay="radial" align="center">
      <h1 style={{ margin: 0, textAlign: 'center', fontFamily: 'sans-serif' }}>Welcome</h1>
      <div style={{ textAlign: 'center', marginTop: 24 }}><ScrollIndicator /></div>
    </Masthead>
  ),
};

export const VideoPlayer: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Video
        title="Sample clip"
        poster={art(150, 1280, 720, 'Click to play')}
        src="data:video/mp4;base64,"
        tracks={[{ src: 'data:text/vtt;charset=utf-8,WEBVTT', srcLang: 'en', label: 'English', default: true }]}
      />
    </div>
  ),
};
