import { makeStyles, RendererProvider, mergeClasses } from '@griffel/react';
import { render } from '@testing-library/react';
import { createRenderer } from './renderer';

const useStyles = makeStyles({
  // Declared "wrong" on purpose: a later, smaller breakpoint written first.
  box: {
    '@media (min-width: 1024px)': { color: 'red' },
    '@media (min-width: 480px)': { color: 'blue' },
  },
});

function mediaOrder(doc: Document) {
  return [...doc.querySelectorAll('style[media]')].map((el) => el.getAttribute('media'));
}

describe('createRenderer', () => {
  it('inserts @media buckets in numeric (mobile-first) order', () => {
    const doc = document.implementation.createHTMLDocument('t');
    const renderer = createRenderer(doc);

    function Box() {
      const s = useStyles();
      return <div className={mergeClasses(s.box)} />;
    }
    render(
      <RendererProvider renderer={renderer} targetDocument={doc}>
        <Box />
      </RendererProvider>,
    );

    expect(mediaOrder(doc)).toEqual(['(min-width: 480px)', '(min-width: 1024px)']);
  });
});
