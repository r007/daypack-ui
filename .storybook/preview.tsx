import * as React from 'react';
import { RendererProvider } from '@griffel/react';
import type { Preview } from '@storybook/react-vite';
import { createRenderer } from '../src/theme';

// Share one renderer so docs and canvas order media queries numerically.
const renderer = createRenderer(typeof document === 'undefined' ? undefined : document);

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i } },
  },
  decorators: [
    (Story) => (
      <RendererProvider renderer={renderer} targetDocument={document}>
        <Story />
      </RendererProvider>
    ),
  ],
};

export default preview;
