import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';
import { blueLink } from '../../theme/mixins';
import { Avatar } from '../Avatar';
import { PinIcon } from '../Icon/icons';
import { ReadMore } from '../ReadMore';
import { Tag } from '../Tag';
import { TagList } from '../TagList';

export interface ProfileHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** The person's name (rendered as `<h1>`). */
  name: string;
  /** Avatar image URL. */
  avatarSrc?: string;
  /** City or region. */
  location?: string;
  /** Website URL. */
  website?: string;
  /** Short biography. Long text is clamped with a "Read more" toggle. */
  intro?: string;
  /** Interests shown as tags. */
  interests?: string[];
  /**
   * Interests shown before collapsing the rest.
   * @default 6
   */
  interestsLimit?: number;
}

const useStyles = makeStyles({
  root: { alignItems: 'flex-start', columnGap: '24px', display: 'flex', flexDirection: 'column', fontFamily: vars.font.sans, rowGap: '16px', [media({ minWidth: 600 })]: { flexDirection: 'row' } },
  body: { flexGrow: 1, minWidth: 0 },
  name: { color: vars.color.textPrimary, fontSize: '32px', fontWeight: vars.fontWeight.medium, lineHeight: 1.25, margin: 0 },
  meta: { alignItems: 'center', color: vars.color.textLight, columnGap: '16px', display: 'flex', flexWrap: 'wrap', fontSize: '14px', marginTop: '8px' },
  location: { alignItems: 'center', columnGap: '6px', display: 'inline-flex' },
  link: blueLink,
  intro: { color: vars.color.textPrimary, fontFamily: vars.font.serif, fontSize: '18px', lineHeight: 1.6, marginTop: '16px', maxWidth: '640px' },
  tags: { marginTop: '16px' },
});

/**
 * Person or author profile summary: avatar, name, location, website, bio and
 * interests. Replaces `ProfileHeader` and `ProfileIntro`.
 */
export function ProfileHeader({
  name,
  avatarSrc,
  location,
  website,
  intro,
  interests = [],
  interestsLimit = 6,
  className,
  ...rest
}: ProfileHeaderProps) {
  const s = useStyles();
  return (
    <header className={mergeClasses(s.root, className)} {...rest}>
      {avatarSrc && <Avatar src={avatarSrc} alt="" size={104} />}
      <div className={s.body}>
        <h1 className={s.name}>{name}</h1>
        {(location || website) && (
          <div className={s.meta}>
            {location && (
              <span className={s.location}>
                <PinIcon aria-hidden="true" />
                {location}
              </span>
            )}
            {website && (
              <a className={s.link} href={website} rel="me noopener noreferrer" target="_blank">
                {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        )}
        {intro && (
          <ReadMore className={s.intro} maxLines={4}>
            {intro}
          </ReadMore>
        )}
        {interests.length > 0 && (
          <TagList className={s.tags} aria-label="Interests" limit={interestsLimit}>
            {interests.map((interest) => (
              <Tag key={interest}>{interest}</Tag>
            ))}
          </TagList>
        )}
      </div>
    </header>
  );
}
