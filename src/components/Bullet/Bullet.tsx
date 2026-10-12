export interface BulletProps {
  /**
   * Where to put a non-breaking space so the bullet doesn't wrap away from its neighbours.
   * @default 'none'
   */
  space?: 'none' | 'before' | 'after' | 'both';
  /** Any CSS color; inherits from the surrounding text by default. */
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
