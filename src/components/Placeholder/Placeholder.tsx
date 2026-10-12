import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';

export interface PlaceholderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The first letter of the title is displayed (leading "The"/"A" skipped). */
  title: string;
  /** Fixed width in px. Use together with `height`. */
  width?: number;
  height?: number;
  /** Height ÷ width for a fluid box, e.g. `9 / 16`. */
  aspectRatio?: number;
  /** Letter size in px. */
  fontSize?: number;
}

const useStyles = makeStyles({
  root: {
    backgroundColor: '#e3e5e9',
    color: '#c4c7cc',
    fontFamily: vars.font.serif,
    lineHeight: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  fluid: { position: 'relative', width: '100%' },
  letter: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%' },
});

/** First letter of a title, skipping a leading article. */
export function placeholderLetter(title: string): string {
  const trimmed = title.trim();
  const withoutArticle = trimmed.replace(/^(the|a|an)\s+/i, '');
  return (withoutArticle || trimmed).charAt(0);
}

/** Letter tile shown in place of a missing image. */
export function Placeholder({
  title,
  width,
  height,
  aspectRatio,
  fontSize = 26,
  className,
  style,
  ...rest
}: PlaceholderProps) {
  const s = useStyles();
  const letter = placeholderLetter(title);
  const fixed = width != null && height != null;

  const dynamic: React.CSSProperties = { fontSize: `${fontSize}px` };
  if (fixed) {
    dynamic.width = `${width}px`;
    dynamic.height = `${height}px`;
    dynamic.lineHeight = (height + 1) / fontSize;
  } else if (aspectRatio) {
    dynamic.paddingBottom = `${aspectRatio * 100}%`;
  }

  return (
    <div
      className={mergeClasses(s.root, !fixed && aspectRatio ? s.fluid : undefined, className)}
      style={{ ...dynamic, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {fixed ? letter : aspectRatio ? <div className={s.letter}>{letter}</div> : null}
    </div>
  );
}
