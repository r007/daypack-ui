import { IconButton, type IconButtonProps } from '../IconButton';
import { BookmarkActiveIcon, BookmarkAltActiveIcon, BookmarkAltIcon, BookmarkIcon } from '../Icon/icons';

export type BookmarkButtonProps = Omit<Extract<IconButtonProps, { href?: undefined }>, 'icon' | 'label' | 'pressed' | 'href'> & {
  /** Whether the item is currently saved. Announced as pressed / not pressed. */
  marked: boolean;
  /**
   * Accessible name when not saved.
   * @default 'Save'
   */
  label?: string;
  /**
   * Accessible name when saved.
   * @default 'Remove from saved'
   */
  markedLabel?: string;
  /**
   * `alt` uses the bookmark-with-plus glyph, for "add to list" actions.
   * @default 'default'
   */
  glyph?: 'default' | 'alt';
};

/**
 * Toggle button for saving an item. A thin preset over `IconButton` with the
 * bookmark glyphs and correct `aria-pressed` semantics.
 *
 * @example
 * <BookmarkButton marked={saved} onClick={() => setSaved(!saved)} />
 */
export function BookmarkButton({
  marked,
  label = 'Save',
  markedLabel = 'Remove from saved',
  glyph = 'default',
  variant = 'filled',
  ...rest
}: BookmarkButtonProps) {
  const Icon = glyph === 'alt' ? (marked ? BookmarkAltActiveIcon : BookmarkAltIcon) : marked ? BookmarkActiveIcon : BookmarkIcon;
  return <IconButton {...rest} variant={variant} icon={<Icon />} label={marked ? markedLabel : label} pressed={marked} />;
}
