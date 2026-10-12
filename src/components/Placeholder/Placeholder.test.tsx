import { placeholderLetter } from './Placeholder';

describe('placeholderLetter', () => {
  it.each([
    ['The best place', 'b'],
    ['A tale', 't'],
    ['Venice', 'V'],
    ['', ''],
  ])('%s → %s', (title, letter) => {
    expect(placeholderLetter(title)).toBe(letter);
  });
});
