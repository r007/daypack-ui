import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  TextAccent,
  TextBodyArticle,
  TextBodyArticleSmall,
  TextBodySmall,
  TextHeading,
  TextSuper,
  TextUppercase,
} from './Text';

const meta = { title: 'Foundations/Text', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sed mauris sit amet massa interdum bibendum. Ut ac ex leo.';

export const Headings: Story = {
  render: () => (
    <div>
      <TextSuper>Super</TextSuper>
      {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((size) => (
        <TextHeading key={size} size={size} level={2}>
          Heading size {size}
        </TextHeading>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div>
      {(['light', 'regular', 'medium'] as const).map((weight) => (
        <TextHeading key={weight} size={4} weight={weight}>
          {weight}
        </TextHeading>
      ))}
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <TextBodyArticle>{lorem}</TextBodyArticle>
      <TextBodyArticleSmall>{lorem}</TextBodyArticleSmall>
      <TextBodySmall>{lorem}</TextBodySmall>
      <TextAccent>Global news reporter</TextAccent>
      <TextUppercase>Uppercase label</TextUppercase>
    </div>
  ),
};
