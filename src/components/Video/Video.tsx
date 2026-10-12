import * as React from 'react';
import { makeStyles, mergeClasses } from '@griffel/react';
import { vars } from '../../theme/vars';
import { focusRing } from '../../theme/focus';
import { PlayIcon } from '../Icon/icons';

export interface VideoSource {
  src: string;
  /** MIME type, e.g. `video/mp4`. Lets the browser skip formats it cannot play. */
  type?: string;
}

export interface VideoTrack {
  src: string;
  /** Language of the track, e.g. `en`. */
  srcLang: string;
  /** Name shown in the captions menu. */
  label: string;
  /** @default 'captions' */
  kind?: 'captions' | 'subtitles' | 'descriptions' | 'chapters';
  default?: boolean;
}

export interface VideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster' | 'title' | 'children'> {
  /** One URL, or several `{ src, type }` sources in order of preference. */
  src: string | VideoSource[];
  /** What the video is, used for the play button's accessible name. */
  title: string;
  /**
   * Still image shown before playback. With a poster the video is not loaded
   * until the viewer presses play (see `deferred`).
   */
  poster?: string;
  /** Caption and subtitle tracks. Provide captions for any video with speech. */
  tracks?: VideoTrack[];
  /**
   * Show the poster with a play button first and only load the video on
   * demand. Turn off to render the `<video>` immediately.
   * @default true when `poster` is set
   */
  deferred?: boolean;
  /**
   * Shape of the player (width ÷ height).
   * @default 16 / 9
   */
  aspectRatio?: number;
  /**
   * Label template of the play button; `{title}` is replaced.
   * @default 'Play video: {title}'
   */
  playLabel?: string;
  /** Called when playback is requested from the poster. */
  onActivate?: () => void;
}

const useStyles = makeStyles({
  root: { backgroundColor: vars.color.bgOverlay, overflow: 'hidden', position: 'relative', width: '100%' },
  media: { display: 'block', height: '100%', inset: 0, objectFit: 'contain', position: 'absolute', width: '100%' },
  posterButton: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    cursor: 'pointer',
    height: '100%',
    inset: 0,
    padding: 0,
    position: 'absolute',
    width: '100%',
    ':focus-visible': { ...focusRing, outlineOffset: '-4px' },
  },
  posterImage: { display: 'block', height: '100%', objectFit: 'cover', width: '100%' },
  play: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '100%',
    color: vars.color.textOverlay,
    display: 'flex',
    fontSize: '28px',
    height: '72px',
    justifyContent: 'center',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transitionProperty: 'background-color, transform',
    transitionDuration: vars.duration.fast,
    width: '72px',
  },
  playHover: { ':hover': { backgroundColor: 'rgba(0, 0, 0, 0.85)' } },
});

/**
 * Accessible video player on the native `<video>` element: captions through
 * `<track>`, built-in keyboard-operable controls, no player library.
 *
 * With a `poster` it behaves as "click to play": only the image is fetched
 * until the viewer presses play, which keeps pages light.
 *
 * @example
 * <Video title="Introducing Italy" poster="/italy.jpg" src="/italy.mp4"
 *   tracks={[{ src: '/italy.en.vtt', srcLang: 'en', label: 'English', default: true }]} />
 */
export function Video({
  src,
  title,
  poster,
  tracks = [],
  deferred,
  aspectRatio = 16 / 9,
  playLabel = 'Play video: {title}',
  onActivate,
  className,
  style,
  controls = true,
  ...rest
}: VideoProps) {
  const s = useStyles();
  const waitForPlay = deferred ?? Boolean(poster);
  const [requested, setRequested] = React.useState(false);
  const active = !waitForPlay || requested;
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const sources = typeof src === 'string' ? [{ src }] : src;

  // Move focus to the player once it replaces the poster button.
  React.useEffect(() => {
    if (requested) videoRef.current?.focus();
  }, [requested]);

  return (
    <div className={mergeClasses(s.root, className)} style={{ aspectRatio, ...style }}>
      {active ? (
        <video
          ref={videoRef}
          className={s.media}
          poster={poster}
          controls={controls}
          autoPlay={requested || rest.autoPlay}
          playsInline
          aria-label={title}
          {...rest}
        >
          {sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
          {tracks.map((track) => (
            <track key={track.src} src={track.src} srcLang={track.srcLang} label={track.label} kind={track.kind ?? 'captions'} default={track.default} />
          ))}
        </video>
      ) : (
        <button
          type="button"
          className={s.posterButton}
          aria-label={playLabel.replace('{title}', title)}
          onClick={() => {
            setRequested(true);
            onActivate?.();
          }}
        >
          {poster && <img className={s.posterImage} src={poster} alt="" loading="lazy" />}
          <span aria-hidden="true" className={mergeClasses(s.play, s.playHover)}>
            <PlayIcon />
          </span>
        </button>
      )}
    </div>
  );
}
