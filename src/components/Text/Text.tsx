import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography, type FontWeightName, type HeadingScale } from '../../theme/typography';

const reset = { color: vars.color.textPrimary, marginTop: 0, marginBottom: 0 } as const;

const useStyles = makeStyles({
  base: reset,
  size1: typography.heading(1),
  size2: typography.heading(2),
  size3: typography.heading(3),
  size4: typography.heading(4),
  size5: typography.heading(5),
  size6: typography.heading(6),
  size7: typography.heading(7),
  size8: typography.heading(8),
  light: { fontWeight: vars.fontWeight.light },
  regular: { fontWeight: vars.fontWeight.regular },
  medium: { fontWeight: vars.fontWeight.medium },
  super: typography.super(),
  bodyArticle: typography.bodyArticle(),
  bodyArticleSmall: typography.bodyArticleSmall(),
  bodySmall: typography.bodySmall(),
  accent: typography.accent(),
  uppercase: typography.uppercase(),
});

type WithClass<T> = Omit<T, 'color'>;

export interface TextHeadingProps extends WithClass<React.HTMLAttributes<HTMLHeadingElement>> {
  /**
   * Semantic level (`<h1>`–`<h6>`). Choose by document outline.
   * @default 2
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Visual size from the 8-step type scale (1 = 64px … 8 = 11px), independent of `level`.
   * @default 2
   */
  size?: HeadingScale;
  /**
   * Font weight token.
   * @default 'regular'
   */
  weight?: FontWeightName;
}

/**
 * Heading set on the design's 8-step type scale. Accepts all heading attributes.
 *
 * @example
 * <TextHeading level={2} size={4} weight="light">Sleep</TextHeading>
 */
export const TextHeading = React.forwardRef<HTMLHeadingElement, TextHeadingProps>(
  function TextHeading({ level = 2, size = 2, weight = 'regular', className, ...rest }, ref) {
    const s = useStyles();
    const Element = `h${level}` as const;
    return (
      <Element
        ref={ref}
        className={mergeClasses(s.base, s[`size${size}`], s[weight], className)}
        {...rest}
      />
    );
  },
);

/** Oversized 88px display heading, rendered as `<h1>`. Accepts all heading attributes. */
export const TextSuper = React.forwardRef<HTMLHeadingElement, WithClass<React.HTMLAttributes<HTMLHeadingElement>>>(
  function TextSuper({ className, ...rest }, ref) {
    const s = useStyles();
    return <h1 ref={ref} className={mergeClasses(s.base, s.super, className)} {...rest} />;
  },
);

type ParagraphProps = WithClass<React.HTMLAttributes<HTMLParagraphElement>>;

function paragraph(name: string, key: 'bodyArticle' | 'bodyArticleSmall' | 'bodySmall' | 'accent' | 'uppercase') {
  const Component = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
    function Paragraph({ className, ...rest }, ref) {
      const s = useStyles();
      return <p ref={ref} className={mergeClasses(s.base, s[key], className)} {...rest} />;
    },
  );
  Component.displayName = name;
  return Component;
}

/** Serif article body copy, 20px. */
export const TextBodyArticle = paragraph('TextBodyArticle', 'bodyArticle');
/** Serif article body copy, 16px. */
export const TextBodyArticleSmall = paragraph('TextBodyArticleSmall', 'bodyArticleSmall');
/** Sans-serif UI copy, 14px. */
export const TextBodySmall = paragraph('TextBodySmall', 'bodySmall');
/** Italic serif accent, 16px. */
export const TextAccent = paragraph('TextAccent', 'accent');
/** Small uppercase label, 11px. */
export const TextUppercase = paragraph('TextUppercase', 'uppercase');
