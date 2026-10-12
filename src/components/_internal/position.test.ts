import { computePosition, type Box } from './position';

const box = (left: number, top: number, width: number, height: number): Box => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

const viewport = { width: 1000, height: 800 };
const floating = { width: 100, height: 40 };

describe('computePosition', () => {
  it('centers on the preferred side', () => {
    const r = computePosition({ anchor: box(450, 400, 100, 40), floating, placement: 'top', offset: 8, viewport });
    expect(r.side).toBe('top');
    expect(r.x).toBe(450); // 500 center - 50
    expect(r.y).toBe(400 - 8 - 40);
  });

  it('flips to the opposite side when there is no room', () => {
    const r = computePosition({ anchor: box(450, 10, 100, 40), floating, placement: 'top', viewport });
    expect(r.side).toBe('bottom');
    expect(r.y).toBe(50 + 8);
  });

  it('stays on the preferred side when the opposite has even less room', () => {
    const tall = { width: 100, height: 900 };
    // 492px above, 252px below: neither fits 908px, but the top has more room.
    const r = computePosition({ anchor: box(450, 500, 100, 40), floating: tall, placement: 'top', viewport });
    expect(r.side).toBe('top');
  });

  it('aligns to the start and end edges', () => {
    const a = box(300, 400, 200, 40);
    expect(computePosition({ anchor: a, floating, placement: 'bottom-start', viewport }).x).toBe(300);
    expect(computePosition({ anchor: a, floating, placement: 'bottom-end', viewport }).x).toBe(400);
  });

  it('slides to stay inside the viewport and points the arrow at the anchor', () => {
    const r = computePosition({ anchor: box(0, 400, 20, 20), floating, placement: 'top', viewport, margin: 8 });
    expect(r.x).toBe(8);
    expect(r.arrow).toBe(12); // anchor center 10 - x 8 = 2, clamped to the arrow inset
  });

  it('works on the horizontal axis', () => {
    const r = computePosition({ anchor: box(500, 400, 100, 40), floating, placement: 'right', viewport });
    expect(r.side).toBe('right');
    expect(r.x).toBe(608);
    expect(r.y).toBe(420 - 20);
  });
});
