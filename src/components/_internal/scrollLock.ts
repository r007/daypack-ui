// Several overlays may be open at once; lock page scroll until all have closed.
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (--locks === 0) document.documentElement.style.overflow = '';
}
