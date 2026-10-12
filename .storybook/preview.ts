import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
