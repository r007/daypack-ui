export interface BulletProps {
  /** Non-breaking space placed around the bullet. */
  space?: 'none' | 'before' | 'after' | 'both';
  /** CSS color; inherits by default. */
  color?: string;
}

const NBSP = ' ';
const BULLET = '•';

/** Decorative inline "•" separator, hidden from assistive technology. */
export function Bullet({ space = 'none', color }: BulletProps) {
  const before = space === 'before' || space === 'both' ? NBSP : '';
  const after = space === 'after' || space === 'both' ? NBSP : '';
  return (
    <span aria-hidden="true" style={color ? { color } : undefined}>
      {before}
      {BULLET}
      {after}
    </span>
  );
}
