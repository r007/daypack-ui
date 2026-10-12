import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { media } from '../../theme/media';

export interface SettingGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Group heading ("Notifications"). */
  title?: React.ReactNode;
  /** Short explanation under the heading. */
  description?: React.ReactNode;
  /**
   * Heading level.
   * @default 2
   */
  level?: 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export interface SettingRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What the setting is. Becomes the control's label when `controlId` is set. */
  title: React.ReactNode;
  /** One line of help text. */
  description?: React.ReactNode;
  /**
   * `id` of the control (switch, checkbox, input) this row labels. Clicking
   * the title then toggles it, and the description is linked with
   * `aria-describedby` automatically only if you also put the id passed to
   * `describedById` on the control.
   */
  controlId?: string;
  /** The control: a `Switch`, `Checkbox`, `Input`, `Dropdown` or `Button`. */
  children: React.ReactNode;
}

const useStyles = makeStyles({
  group: { color: vars.color.textPrimary, fontFamily: vars.font.sans },
  groupTitle: { fontSize: '20px', fontWeight: vars.fontWeight.regular, lineHeight: 1.4, margin: 0 },
  groupDescription: { color: vars.color.textSecondary, fontSize: '14px', margin: 0, marginTop: '4px' },
  rows: { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: vars.color.borderPrimary, listStyleType: 'none', margin: 0, marginTop: '16px', padding: 0 },
  row: {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: vars.color.borderPrimary,
    columnGap: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: '16px',
    paddingBottom: '16px',
    rowGap: '12px',
    [media({ minWidth: 600 })]: { flexDirection: 'row' },
  },
  text: { alignSelf: 'stretch', minWidth: 0 },
  title: { display: 'block', fontSize: '16px', fontWeight: vars.fontWeight.medium },
  description: { color: vars.color.textSecondary, display: 'block', fontSize: '14px', marginTop: '2px' },
  control: { alignSelf: 'flex-start', flexShrink: 0, [media({ minWidth: 600 })]: { alignSelf: 'center' } },
});

/**
 * Titled list of `SettingRow`s (account and preference pages). Replaces the
 * `SettingBlock*` family.
 *
 * @example
 * <SettingGroup title="Notifications">
 *   <SettingRow title="Weekly digest" description="Our best guides every Friday." controlId="digest">
 *     <Switch id="digest" />
 *   </SettingRow>
 * </SettingGroup>
 */
export function SettingGroup({ title, description, level = 2, className, children, ...rest }: SettingGroupProps) {
  const s = useStyles();
  const Heading = `h${level}` as const;
  return (
    <section className={mergeClasses(s.group, className)} {...rest}>
      {title && <Heading className={s.groupTitle}>{title}</Heading>}
      {description && <p className={s.groupDescription}>{description}</p>}
      <div className={s.rows} role="list">
        {children}
      </div>
    </section>
  );
}

/** One setting: a title and description on the left, its control on the right. */
export function SettingRow({ title, description, controlId, children, className, ...rest }: SettingRowProps) {
  const s = useStyles();
  const Title = controlId ? 'label' : 'span';
  return (
    <div role="listitem" className={mergeClasses(s.row, className)} {...rest}>
      <div className={s.text}>
        <Title className={s.title} {...(controlId ? { htmlFor: controlId } : {})}>
          {title}
        </Title>
        {description && <span className={s.description}>{description}</span>}
      </div>
      <div className={s.control}>{children}</div>
    </div>
  );
}
