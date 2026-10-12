import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { blueLink } from '../../theme/mixins';
import { Bullet } from '../Bullet';

const useStyles = makeStyles({
  disclaimer: { color: vars.color.textLight, fontFamily: vars.font.sans, fontSize: '11px', lineHeight: 1.45, margin: 0 },
  disclaimerLinks: { '& a': { color: 'inherit', textDecorationLine: 'underline' } },
  edit: { ...blueLink, fontFamily: vars.font.sans, fontSize: '12px', fontWeight: vars.fontWeight.medium },
  bullets: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', listStyleType: 'none', margin: 0, padding: 0 },
  bubble: {
    backgroundColor: vars.color.bgSecondary,
    borderRadius: '8px',
    color: vars.color.textPrimary,
    display: 'inline-block',
    fontFamily: vars.font.sans,
    fontSize: '14px',
    lineHeight: 1.5,
    maxWidth: '100%',
    paddingTop: '10px',
    paddingRight: '14px',
    paddingBottom: '10px',
    paddingLeft: '14px',
    position: 'relative',
    '::after': {
      borderTopWidth: '8px',
      borderTopStyle: 'solid',
      borderTopColor: vars.color.bgSecondary,
      borderRightWidth: '8px',
      borderRightStyle: 'solid',
      borderRightColor: 'transparent',
      bottom: '-8px',
      content: '""',
      height: 0,
      left: '16px',
      position: 'absolute',
      width: 0,
    },
  },
});

/** Small print for legal notes and cookie text. Links inside inherit its color and are underlined. */
export function DisclaimerText({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  const s = useStyles();
  return <p className={mergeClasses(s.disclaimer, s.disclaimerLinks, className)} {...rest} />;
}

export interface EditLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination of the edit/suggestion page. */
  href: string;
  /**
   * Link text.
   * @default 'Suggest an edit'
   */
  children?: React.ReactNode;
}

/** Inline "Suggest an edit" style link. */
export function EditLink({ children = 'Suggest an edit', className, ...rest }: EditLinkProps) {
  const s = useStyles();
  return (
    <a className={mergeClasses(s.edit, className)} {...rest}>
      {children}
    </a>
  );
}

export interface BulletListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  /** Short items shown on one line, separated by bullets. Falsy entries are skipped. */
  items: React.ReactNode[];
}

/** Inline list separated by bullets ("Museum • Paris • Free"). Replaces `BulletDescription`. */
export function BulletList({ items, className, ...rest }: BulletListProps) {
  const s = useStyles();
  const visible = items.filter(Boolean);
  return (
    <ul className={mergeClasses(s.bullets, className)} {...rest}>
      {visible.map((item, index) => (
        <li key={index}>
          {index > 0 && <Bullet space="both" />}
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Speech-bubble callout for short quotes or tips. */
export function TextBubble({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const s = useStyles();
  return <div className={mergeClasses(s.bubble, className)} {...rest} />;
}
