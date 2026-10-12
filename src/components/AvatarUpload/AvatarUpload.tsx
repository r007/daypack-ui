import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { Avatar } from '../Avatar';

export interface AvatarUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current image URL. */
  src?: string;
  /**
   * Called with the chosen file and a temporary preview URL once it passes
   * validation. Upload it yourself.
   */
  onChange: (file: File, previewUrl: string) => void;
  /**
   * Accepted MIME types.
   * @default 'image/*'
   */
  accept?: string;
  /**
   * Largest file size in megabytes.
   * @default 5
   */
  maxSizeMb?: number;
  /**
   * Avatar diameter in px.
   * @default 104
   */
  size?: 80 | 104;
  /**
   * Button text.
   * @default 'Change photo'
   */
  label?: string;
  /**
   * Message when the file is too large; `{max}` is replaced.
   * @default 'Please choose an image under {max} MB.'
   */
  tooLargeMessage?: string;
}

const useStyles = makeStyles({
  root: { alignItems: 'center', columnGap: '16px', display: 'flex', fontFamily: vars.font.sans },
  placeholder: { backgroundColor: vars.color.bgMap, borderRadius: '100%', display: 'inline-block' },
  label: {
    backgroundColor: vars.color.bgPrimary,
    borderRadius: '4px',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderTopStyle: 'solid',
    borderRightStyle: 'solid',
    borderBottomStyle: 'solid',
    borderLeftStyle: 'solid',
    borderTopColor: vars.color.borderLight,
    borderRightColor: vars.color.borderLight,
    borderBottomColor: vars.color.borderLight,
    borderLeftColor: vars.color.borderLight,
    color: vars.color.textPrimary,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: vars.fontWeight.medium,
    paddingTop: '10px',
    paddingRight: '16px',
    paddingBottom: '10px',
    paddingLeft: '16px',
    ':hover': { color: vars.color.linkPrimary },
    ':has(:focus-visible)': focusRing,
  },
  input: { clipPath: 'inset(50%)', height: '1px', overflow: 'hidden', position: 'absolute', width: '1px' },
  error: { color: vars.color.accentRed, fontSize: '13px', marginTop: '8px' },
});

/**
 * Profile photo picker on a native file input: keyboard and screen-reader
 * accessible, validates size, and previews the chosen image.
 *
 * @example
 * <AvatarUpload src={user.avatar} onChange={(file) => upload(file)} />
 */
export function AvatarUpload({
  src,
  onChange,
  accept = 'image/*',
  maxSizeMb = 5,
  size = 104,
  label = 'Change photo',
  tooLargeMessage = 'Please choose an image under {max} MB.',
  className,
  ...rest
}: AvatarUploadProps) {
  const s = useStyles();
  const [preview, setPreview] = React.useState<string | undefined>();
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();

  // Release the object URL when it is replaced or the component unmounts.
  React.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const shown = preview ?? src;

  return (
    <div className={mergeClasses(s.root, className)} {...rest}>
      {shown ? <Avatar src={shown} alt="" size={size} /> : <span aria-hidden="true" className={s.placeholder} style={{ width: size, height: size }} />}
      <div>
        <label className={s.label}>
          {label}
          <input
            className={s.input}
            type="file"
            accept={accept}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              if (file.size > maxSizeMb * 1024 * 1024) {
                setError(tooLargeMessage.replace('{max}', String(maxSizeMb)));
                event.target.value = '';
                return;
              }
              setError(null);
              const url = URL.createObjectURL(file);
              setPreview(url);
              onChange(file, url);
            }}
          />
        </label>
        <div id={errorId} role={error ? 'alert' : undefined} className={error ? s.error : undefined}>
          {error}
        </div>
      </div>
    </div>
  );
}
