import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListItem, ListItemActions, ListItemBody, ListItemMedia, ListItemText, ListItemTitle } from './ListItem';
import { Badge } from '../Badge';

const thumb = (hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='hsl(${hue} 55% 60%)'/></svg>`,
  )}`;

const meta = { title: 'Components/ListItem', component: ListItem, parameters: { layout: 'padded' } } satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Results: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxWidth: 560 }}>
      {[
        ['Louvre Museum', 'Museum', 'accent', 'The world’s most visited art museum.', 210],
        ['Café de Flore', 'Café', 'neutral', 'Literary haunt on Boulevard Saint-Germain.', 30],
        ['Sainte-Chapelle', 'Sight', 'success', 'Gothic chapel with 15 stained-glass windows.', 150],
      ].map(([title, kind, tone, text, hue]) => (
        <ListItem as="li" key={String(title)}>
          <ListItemMedia src={thumb(Number(hue))} />
          <ListItemBody>
            <Badge tone={tone as 'accent' | 'neutral' | 'success'}>{String(kind)}</Badge>
            <ListItemTitle href="#poi">{String(title)}</ListItemTitle>
            <ListItemText>{String(text)}</ListItemText>
          </ListItemBody>
          <ListItemActions>
            <button type="button" aria-label={`Save ${title}`}>♡</button>
          </ListItemActions>
        </ListItem>
      ))}
    </ul>
  ),
};
