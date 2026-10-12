import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { typography } from '../../theme/typography';

interface ProseBase extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /**
   * Type size of the body copy: `large` is 20px, `small` 16px.
   * @default 'large'
   */
  size?: 'large' | 'small';
}

export type ProseProps = ProseBase &
  (
    | { children: React.ReactNode; html?: undefined }
    | {
        /**
         * Markup from a CMS. It is inserted as-is, so **sanitize it first**
         * (e.g. with DOMPurify) unless it comes from a source you fully trust.
         */
        html: string;
        children?: undefined;
      }
  );

const useStyles = makeStyles({
  root: {
    color: vars.color.textPrimary,
    '& > :first-child': { marginTop: 0 },
    '& > :last-child': { marginBottom: 0 },
    '& p': { marginTop: 0, marginBottom: '1em' },
    '& h2, & h3, & h4': { fontFamily: vars.font.sans, fontWeight: vars.fontWeight.medium, lineHeight: 1.25, marginTop: '1.6em', marginBottom: '0.6em' },
    '& h2': { fontSize: '1.6em' },
    '& h3': { fontSize: '1.3em' },
    '& h4': { fontSize: '1.1em' },
    '& a': { color: vars.color.linkPrimary, textDecorationLine: 'underline', textUnderlineOffset: '0.15em' },
    '& a:hover': { color: vars.color.linkPrimaryHover },
    '& ul, & ol': { marginTop: 0, marginBottom: '1em', paddingLeft: '1.4em' },
    '& li': { marginBottom: '0.4em' },
    '& blockquote': {
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      borderLeftColor: vars.color.accentRed,
      fontStyle: 'italic',
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: '1em',
    },
    '& img, & video': { height: 'auto', maxWidth: '100%' },
    '& figure': { margin: 0, marginBottom: '1em' },
    '& figcaption': { color: vars.color.textLight, fontFamily: vars.font.sans, fontSize: '0.8em', marginTop: '0.5em' },
    '& hr': { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: vars.color.borderPrimary, borderBottomWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, marginTop: '2em', marginBottom: '2em' },
  },
  large: typography.bodyArticle(),
  small: typography.bodyArticleSmall(),
});

/**
 * Typographic container for long-form content: article body copy, with
 * consistent styling of paragraphs, headings, lists, quotes, links and media.
 * Replaces `ContentBlock` / `Narrative` body handling.
 *
 * @example
 * <Prose><p>Paris rewards slow walking.</p></Prose>
 * <Prose html={sanitizedHtmlFromCms} />
 */
export function Prose({ size = 'large', className, children, html, ...rest }: ProseProps) {
  const s = useStyles();
  const classes = mergeClasses(s.root, s[size], className);
  if (html !== undefined) {
    return <div className={classes} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
  }
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
