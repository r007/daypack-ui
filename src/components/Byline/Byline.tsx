import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { blueLink } from '../../theme/mixins';
import { Avatar } from '../Avatar';
import { Timestamp } from '../Timestamp';

export interface BylineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Author's name. */
  name: string;
  /** Link the name to the author's profile. */
  href?: string;
  /** Job title or role shown under the name. */
  role?: string;
  /** Avatar image URL. Omit for a name-only byline. */
  avatar?: string;
  /**
   * Avatar diameter in px.
   * @default 40
   */
  avatarSize?: 24 | 40 | 48;
  /** Publication date; rendered with `Timestamp`. */
  date?: Date | string | number;
  /**
   * How the date is shown.
   * @default 'date'
   */
  dateFormat?: 'relative' | 'date' | 'datetime';
}

const useStyles = makeStyles({
  root: { alignItems: 'center', columnGap: '12px', display: 'flex', fontFamily: vars.font.sans },
  text: { display: 'flex', flexDirection: 'column', rowGap: '2px' },
  name: { color: vars.color.textPrimary, fontSize: vars.fontSize.bodySmall, fontWeight: vars.fontWeight.medium },
  link: blueLink,
  meta: { color: vars.color.textLight, fontSize: '12px', fontWeight: 400, textTransform: 'none' },
});

/**
 * Author line: avatar, name (optionally linked), role and date. Replaces
 * `Author`, `AuthorName`, `ArticleAuthor` and `NewsArticleAuthor`.
 *
 * @example
 * <Byline name="Alex Butler" href="/authors/alex" role="Destination editor" avatar="/alex.jpg" date="2026-01-17" />
 */
export function Byline({ name, href, role, avatar, avatarSize = 40, date, dateFormat = 'date', className, ...rest }: BylineProps) {
  const s = useStyles();
  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      {avatar && <Avatar src={avatar} alt="" size={avatarSize} />}
      <div className={s.text}>
        <span className={s.name}>
          {href ? (
            <a className={s.link} href={href} rel="author">
              {name}
            </a>
          ) : (
            name
          )}
        </span>
        {role && <span className={s.meta}>{role}</span>}
        {date !== undefined && <Timestamp className={s.meta} date={date} format={dateFormat} />}
      </div>
    </div>
  );
}
