import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';
import { Image } from '../Image';
import { Masthead, GradientOverlay } from '../Masthead';
import { PhotoGallery } from '../PhotoGallery';
import { Video } from '../Video';
import { TileGrid } from '../TileGrid';
import { HideAt } from '../HideAt';
import { ScrollIndicator } from '../ScrollIndicator';

describe('Carousel', () => {
  it('exposes carousel and slide roles with position labels', () => {
    render(
      <Carousel label="Featured guides" slidesPerView={{ base: 1, md: 2 }}>
        <p>One</p>
        <p>Two</p>
        <p>Three</p>
      </Carousel>,
    );
    const region = screen.getByRole('region', { name: 'Featured guides' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const slides = screen.getAllByRole('group').filter((el) => el.getAttribute('aria-roledescription') === 'slide');
    expect(slides).toHaveLength(3);
    expect(slides[1]).toHaveAttribute('aria-label', '2 of 3');
    expect(slides[1]).toHaveAttribute('aria-roledescription', 'slide');
  });

  it('pages with the buttons, disables previous at the start', async () => {
    // jsdom has no layout: pretend the track is wider than its viewport.
    const widths = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1000);
    const client = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
    render(
      <Carousel label="Guides" showCounter>
        <p>One</p>
        <p>Two</p>
      </Carousel>,
    );
    const list = screen.getByRole('group', { name: 'Guides slides' });
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy as unknown as typeof list.scrollBy;
    expect(screen.getByRole('button', { name: 'Previous slides' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next slides' }));
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: expect.any(Number) }));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    widths.mockRestore();
    client.mockRestore();
  });

  it('can hide the controls', () => {
    render(<Carousel label="Guides" controls={false}><p>One</p></Carousel>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('Image', () => {
  it('lazy-loads and keeps the alt text', () => {
    render(<Image src="/a.jpg" alt="Eiffel Tower" ratio="video" />);
    const img = screen.getByRole('img', { name: 'Eiffel Tower' });
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('falls back when the image fails', () => {
    render(<Image src="/missing.jpg" alt="Eiffel Tower" />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('supports a custom fallback', () => {
    render(<Image src="/missing.jpg" alt="x" fallback={<span>Nothing here</span>} />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});

describe('Masthead', () => {
  it('renders the image, content and a decorative overlay', () => {
    const { container } = render(
      <Masthead image="/hero.jpg"><h1>Paris</h1></Masthead>,
    );
    expect(screen.getByRole('heading', { name: 'Paris' })).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('GradientOverlay is decorative', () => {
    const { container } = render(<GradientOverlay type="radial" />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('PhotoGallery', () => {
  const photos = [
    { src: '/a.jpg', alt: 'Market at dawn', caption: 'The market' },
    { src: '/b.jpg', alt: 'Harbour' },
    { src: '/c.jpg', alt: 'Old town' },
  ];

  it('opens a lightbox from a thumbnail and navigates with arrow keys', async () => {
    render(<PhotoGallery photos={photos} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open photo 2: Harbour' }));

    const dialog = screen.getByRole('dialog', { name: 'Photo gallery' });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('img', { name: 'Harbour' })).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('img', { name: 'Old town' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next photo' })).toBeDisabled();

    await userEvent.keyboard('{Home}');
    expect(screen.getByText('The market')).toBeInTheDocument();
  });

  it('closes with the close button', async () => {
    render(<PhotoGallery photos={photos} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open photo 1: Market at dawn' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('img', { name: 'Market at dawn' })).toBeNull();
  });
});

describe('Video', () => {
  it('shows a labelled play button first, then the player with captions', async () => {
    const { container } = render(
      <Video
        title="Introducing Italy"
        poster="/italy.jpg"
        src="/italy.mp4"
        tracks={[{ src: '/italy.en.vtt', srcLang: 'en', label: 'English', default: true }]}
      />,
    );
    expect(container.querySelector('video')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Play video: Introducing Italy' }));

    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('controls');
    expect(video.querySelector('source')).toHaveAttribute('src', '/italy.mp4');
    expect(video.querySelector('track')).toHaveAttribute('kind', 'captions');
  });

  it('renders the player immediately without a poster', () => {
    const { container } = render(<Video title="Clip" src="/clip.mp4" />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });
});

describe('TileGrid, HideAt, ScrollIndicator', () => {
  it('TileGrid exposes sizing through custom properties', () => {
    render(<TileGrid as="ul" minTileWidth={200} gap={12} data-testid="grid"><li>a</li></TileGrid>);
    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('UL');
    expect(grid.style.getPropertyValue('--dp-tile-min')).toBe('200px');
  });

  it('HideAt rejects unsupported breakpoints', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<HideAt below={999}>x</HideAt>)).toThrow(/use one of/);
    spy.mockRestore();
  });

  it('HideAt renders its children', () => {
    render(<HideAt below={768}>Sidebar</HideAt>);
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
  });

  it('ScrollIndicator is a labelled button', async () => {
    const onClick = vi.fn();
    render(<ScrollIndicator onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Scroll down' }));
    expect(onClick).toHaveBeenCalled();
  });
});
