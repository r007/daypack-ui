import { render, screen } from '@testing-library/react';
import { GridColumn, resolveColumnValues } from './GridColumn';
import { span, gutter } from './gridMath';
import { GridRow } from './GridRow';

describe('grid math', () => {
  it('matches the 12-col / 80px / 30px design', () => {
    expect(span(12, false)).toBe('1290px');
    expect(span(1, false)).toBe('80px');
    expect(span(6, false)).toBe('630px');
    expect(span(12, true)).toBe('100%');
    expect(gutter(false)).toBe('30px');
    expect(gutter(true)).toBe('2.3256%');
  });
});

describe('resolveColumnValues', () => {
  it('cascades mobile-first', () => {
    const v = resolveColumnValues({ sm: 12, lg: 6 });
    expect(v.sm.width).toBe('100%'.replace('100%', '1290px'));
    expect(v.md.width).toBe('1290px'); // inherited from sm
    expect(v.lg.width).toBe('630px');
  });

  it('adds gutters around partial-width columns only', () => {
    expect(resolveColumnValues({ md: 6, includeGutter: true }).md.marginLeft).toBe('30px');
    expect(resolveColumnValues({ md: 12, includeGutter: true }).md.marginLeft).toBeUndefined();
    expect(resolveColumnValues({ md: 6, includeGutter: true, gutterPosition: 'after' }).md.marginRight).toBe('30px');
  });

  it('shifts by columns plus a gutter', () => {
    expect(resolveColumnValues({ md: 6, mdShift: 3 }).md.marginLeft).toBe('330px'); // span(3) = 3*80 + 2*30, plus one gutter
  });
});

describe('<GridColumn>', () => {
  it('exposes widths as CSS variables for its breakpoints', () => {
    render(
      <GridRow>
        <GridColumn md={6} fluid>x</GridColumn>
      </GridRow>,
    );
    const col = screen.getByText('x');
    expect(col.style.getPropertyValue('--dp-col-md-w')).toBe('48.8372%');
    expect(col.style.getPropertyValue('--dp-col-sm-w')).toBe('');
  });
});
